// src/routes/api/stripe/webhook/+server.js
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

// Webhooks don't have auth - they use the signature for verification
export async function POST({ request, locals }) {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	let event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error(`Webhook signature verification failed:`, err.message);
		return json({ error: `Webhook signature verification failed` }, { status: 400 });
	}

	const supabase = locals.supabase;

	try {
		// Handle the event
		switch (event.type) {
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
				const subscription = event.data.object;

				// Get user_id from customer metadata
				const customer = await stripe.customers.retrieve(subscription.customer);
				const userId = customer.metadata.userId;

				if (!userId) {
					console.error('No userId found in customer metadata');
					return json({ error: 'Customer metadata missing userId' }, { status: 400 });
				}

				// Update subscription in database
				await supabase
					.from('user_subscriptions')
					.update({
						stripe_subscription_id: subscription.id,
						subscription_status: subscription.status,
						current_period_start: new Date(subscription.current_period_start * 1000),
						current_period_end: new Date(subscription.current_period_end * 1000),
						cancel_at_period_end: subscription.cancel_at_period_end,
						updated_at: new Date()
					})
					.eq('user_id', userId);
				break;

			case 'customer.subscription.deleted':
				const canceledSubscription = event.data.object;
				const canceledCustomer = await stripe.customers.retrieve(canceledSubscription.customer);
				const canceledUserId = canceledCustomer.metadata.userId;

				if (canceledUserId) {
					await supabase
						.from('user_subscriptions')
						.update({
							subscription_status: 'canceled',
							updated_at: new Date()
						})
						.eq('user_id', canceledUserId);
				}
				break;
		}

		return json({ received: true });
	} catch (error) {
		console.error(`Webhook error: ${error.message}`);
		return json({ error: `Webhook handler failed: ${error.message}` }, { status: 500 });
	}
}
