// src/routes/api/stripe/webhook/+server.js
import { stripe } from '$lib/stripe/server.js';
import {
	STRIPE_WEBHOOK_SECRET,
	VITE_SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY
} from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

export async function POST({ request }) {
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		return new Response('Missing signature', { status: 400 });
	}

	try {
		const body = await request.text();

		// First verify the signature
		const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

		// Then log - AFTER event is defined
		console.log(`Processing ${event.type} event`);

		// Create supabaseAdmin client directly in this route handler
		const supabaseAdmin = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

		// Handle specific events
		switch (event.type) {
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
				await handleSubscriptionUpdated(event.data.object, supabaseAdmin);
				break;

			case 'customer.subscription.deleted':
				await handleSubscriptionDeleted(event.data.object, supabaseAdmin);
				break;
		}

		return json({ received: true });
	} catch (err) {
		console.error('Webhook error:', err);
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}
}

// Helper function to handle subscription deletions
async function handleSubscriptionUpdated(subscription, supabaseAdmin) {
	try {
		const customerId = subscription.customer;
		const subscriptionId = subscription.id;
		const status = subscription.status;

		// Look up the user by customer ID
		const { data: userData, error: userError } = await supabaseAdmin
			.from('user_subscriptions')
			.select('user_id')
			.eq('stripe_customer_id', customerId)
			.maybeSingle();

		if (userError) {
			console.error('Error looking up user:', userError);
			return;
		}

		if (!userData) {
			console.error('User not found for customer:', customerId);
			return;
		}

		const userId = userData.user_id;
		const subscriptionStatus = status === 'active' || status === 'trialing' ? 'premium' : 'free';

		// Now these logs are AFTER variables are defined
		console.log('Updating subscription for user:', userId);
		console.log('New status:', subscriptionStatus);

		// Calculate the period end (when the subscription will expire)
		// Add some buffer time (1 hour) to avoid timezone issues
		const periodEnd = new Date(subscription.current_period_end * 1000);
		periodEnd.setHours(periodEnd.getHours() + 1);

		// Update the user's subscription details
		const { error: updateError } = await supabaseAdmin
			.from('user_subscriptions')
			.update({
				subscription_status: subscriptionStatus,
				subscription_id: subscriptionId,
				current_period_end: periodEnd.toISOString()
			})
			.eq('user_id', userId);

		if (updateError) {
			console.error('Error updating subscription in database:', updateError);
		}
	} catch (error) {
		console.error('Error handling subscription update:', error);
	}
}

async function handleSubscriptionDeleted(subscription, supabaseAdmin) {
	const customerId = subscription.customer;

	// Look up the user by customer ID
	const { data: userData } = await supabaseAdmin
		.from('user_subscriptions')
		.select('user_id')
		.eq('stripe_customer_id', customerId)
		.maybeSingle();

	if (!userData) {
		console.error('User not found for customer:', customerId);
		return;
	}

	const userId = userData.user_id;

	await supabaseAdmin
		.from('user_subscriptions')
		.update({
			subscription_status: 'free',
			subscription_id: null,
			current_period_end: null
		})
		.eq('user_id', userId);
}
