// src/routes/api/stripe/create-portal/+server.js
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ locals, url }) {
	try {
		// Get the authenticated user from the server-side session
		const session = locals.session;

		if (!session) {
			return json({ error: 'Not authenticated' }, { status: 401 });
		}

		const user = session.user;

		// Get customer ID from Supabase
		const { data: subscription, error } = await locals.supabase
			.from('user_subscriptions')
			.select('stripe_customer_id')
			.eq('user_id', user.id)
			.single();

		if (error || !subscription?.stripe_customer_id) {
			return json({ error: 'No subscription found for this user' }, { status: 404 });
		}

		// Create portal session
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: subscription.stripe_customer_id,
			return_url: `${url.origin}/login/profile`
		});

		return json({ url: portalSession.url });
	} catch (error) {
		console.error('Create portal error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
