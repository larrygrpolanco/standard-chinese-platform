// src/routes/api/stripe/portal/+server.js
import { stripe } from '$lib/stripe/server.js';
import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '$env/static/private';

export async function POST({ request, locals }) {
	try {
		// First try with SSR auth (locals.user)
		let user = locals.user;

		// If not found, check Authorization header from client auth
		if (!user) {
			const authHeader = request.headers.get('Authorization');
			if (authHeader && authHeader.startsWith('Bearer ')) {
				const token = authHeader.split('Bearer ')[1];

				// Create a temporary Supabase client to validate the token
				const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

				// Get user from token
				const { data, error: authError } = await supabase.auth.getUser(token);
				if (authError) {
					console.error('Token validation error:', authError);
					throw error(401, 'Invalid token');
				}

				user = data?.user;
			}
		}

		if (!user) {
			throw error(401, 'Not authenticated');
		}

		// Get the customer ID
		const { data: subscription } = await locals.supabaseAdmin
			.from('user_subscriptions')
			.select('stripe_customer_id')
			.eq('user_id', user.id)
			.maybeSingle();

		if (!subscription?.stripe_customer_id) {
			throw error(400, 'No subscription found');
		}

		// Create a customer portal session
		const session = await stripe.billingPortal.sessions.create({
			customer: subscription.stripe_customer_id,
			return_url: `${request.headers.get('origin')}/profile`
		});

		return json({ url: session.url });
	} catch (err) {
		console.error('Error creating portal session:', err);
		throw error(500, err.message);
	}
}
