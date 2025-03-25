// src/routes/api/stripe/create-portal/+server.js
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { supabase } from '$lib/supabase/client';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request, url }) {
	try {
		const { user } = await request.json();
		if (!user) {
			return json({ error: 'User not authenticated' }, { status: 401 });
		}

		// Get customer ID
		const { data: subscription } = await supabase
			.from('user_subscriptions')
			.select('stripe_customer_id')
			.eq('id', user.id)
			.single();

		if (!subscription?.stripe_customer_id) {
			return json({ error: 'No subscription found' }, { status: 404 });
		}

		// Create portal session
		const session = await stripe.billingPortal.sessions.create({
			customer: subscription.stripe_customer_id,
			return_url: `${url.origin}/account`
		});

		return json({ url: session.url });
	} catch (error) {
		console.error('Stripe portal error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
