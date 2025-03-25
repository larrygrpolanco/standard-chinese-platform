// src/routes/api/stripe/create-checkout/+server.js
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { createOrUpdateStripeCustomer, getCurrentUser } from '$lib/supabase/client.js';
import { STRIPE_CONFIG } from '$lib/stripe/config.js';
import { supabase } from '$lib/supabase/client';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ url }) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return json({ error: 'User not authenticated' }, { status: 401 });
		}

		// Check if customer already exists in Supabase
		let { data: subscription } = await supabase
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

			// Save customer ID to Supabase
			await createOrUpdateStripeCustomer(customerId);
		}

		// Create a checkout session
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			line_items: [
				{
					price: STRIPE_CONFIG.PRODUCTS.MONTHLY_SUBSCRIPTION.price_id,
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${url.origin}/account?subscription=success`,
			cancel_url: `${url.origin}/account?subscription=canceled`
		});

		return json({ url: session.url });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
