// src/routes/api/stripe/create-checkout/+server.js
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { STRIPE_CONFIG } from '$lib/stripe/config.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ locals, url }) {
	try {
		// Get the authenticated user from the server-side session
		const session = locals.session;

		if (!session) {
			return json({ error: 'Not authenticated' }, { status: 401 });
		}

		const user = session.user;

		// Check if customer already exists in Supabase
		let { data: subscription } = await locals.supabase
			.from('user_subscriptions')
			.select('stripe_customer_id')
			.eq('user_id', user.id)
			.single();

		let customerId;

		if (subscription?.stripe_customer_id) {
			customerId = subscription.stripe_customer_id;
		} else {
			// Create a new customer in Stripe
			const customer = await stripe.customers.create({
				email: user.email,
				metadata: {
					userId: user.id
				}
			});
			customerId = customer.id;

			// Save customer ID to Supabase using server client
			await locals.supabase.from('user_subscriptions').upsert(
				{
					user_id: user.id,
					stripe_customer_id: customerId,
					updated_at: new Date()
				},
				{
					onConflict: 'user_id'
				}
			);
		}

		// Create a checkout session
		const stripeSession = await stripe.checkout.sessions.create({
			customer: customerId,
			line_items: [
				{
					price: STRIPE_CONFIG.PRODUCTS.MONTHLY_SUBSCRIPTION.price_id,
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${url.origin}/login/profile?subscription=success`,
			cancel_url: `${url.origin}/login/profile?subscription=canceled`
		});

		return json({ url: stripeSession.url });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
