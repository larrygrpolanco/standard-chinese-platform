// src/routes/api/stripe/create-checkout/+server.js
import { stripe } from '$lib/stripe/server.js';
import { STRIPE_CONFIG } from '$lib/stripe/config.js';
import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

// Get these from your environment variables
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '$env/static/private';

export async function POST({ request, locals }) {
	try {
		// First try with SSR auth (locals.user)
		let user = locals.user;

		// If not found, check Authorization header from client auth
		if (!user) {
			const authHeader = request.headers.get('Authorization');
			if (authHeader && authHeader.startsWith('Bearer ')) {
				const token = authHeader.split(' ')[1];

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

		// Continue with the existing code...
		const userEmail = user.email;

		// Check if user already has a Stripe customer ID
		const { data: subscription } = await locals.supabaseAdmin
			.from('user_subscriptions')
			.select('stripe_customer_id')
			.eq('user_id', user.id)
			.maybeSingle();

		let customerId = subscription?.stripe_customer_id;

		// If no customer ID exists, create a new Stripe customer
		if (!customerId) {
			const customer = await stripe.customers.create({
				email: userEmail,
				metadata: { userId: user.id }
			});

			customerId = customer.id;

			// Store the customer ID
			await locals.supabaseAdmin.from('user_subscriptions').upsert({
				user_id: user.id,
				stripe_customer_id: customerId,
				subscription_status: 'free'
			});
		}

		// Create a checkout session
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			payment_method_types: ['card'],
			line_items: [
				{
					price: STRIPE_CONFIG.PRODUCTS.MONTHLY_SUBSCRIPTION.price_id,
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${request.headers.get('origin')}/profile?checkout=success`,
			cancel_url: `${request.headers.get('origin')}/profile?checkout=canceled`,
			metadata: { userId: user.id }
		});

		return json({ url: session.url });
	} catch (err) {
		console.error('Error creating checkout session:', err);
		throw error(500, err.message);
	}
}
