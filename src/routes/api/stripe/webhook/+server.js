// src/routes/api/stripe/webhook/+server.js
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { supabase } from '$lib/supabase/client';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request }) {
	const payload = await request.text();
	const signature = request.headers.get('stripe-signature');

	let event;
	try {
		event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature verification failed:', err.message);
		return json({ error: 'Webhook signature verification failed' }, { status: 400 });
	}

	// Handle the event
	switch (event.type) {
		case 'customer.subscription.created':
		case 'customer.subscription.updated':
			const subscription = event.data.object;
			await handleSubscriptionChange(subscription);
			break;
		case 'customer.subscription.deleted':
			const canceledSubscription = event.data.object;
			await handleSubscriptionCanceled(canceledSubscription);
			break;
	}

	return json({ received: true });
}

async function handleSubscriptionChange(subscription) {
	// Get the customer to find our user
	const customer = await stripe.customers.retrieve(subscription.customer);
	const userId = customer.metadata.userId;

	// Update subscription data
	await supabase.from('user_subscriptions').upsert({
		user_id: userId,
		stripe_subscription_id: subscription.id,
		subscription_status: subscription.status,
		current_period_start: new Date(subscription.current_period_start * 1000),
		current_period_end: new Date(subscription.current_period_end * 1000),
		cancel_at_period_end: subscription.cancel_at_period_end,
		updated_at: new Date()
	});
}

async function handleSubscriptionCanceled(subscription) {
	// Get the customer to find our user
	const customer = await stripe.customers.retrieve(subscription.customer);
	const userId = customer.metadata.userId;

	// Update subscription status
	await supabase
		.from('user_subscriptions')
		.update({
			subscription_status: 'canceled',
			updated_at: new Date()
		})
		.eq('user_id', userId);
}
