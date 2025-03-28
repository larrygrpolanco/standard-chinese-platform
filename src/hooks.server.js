// hooks.server.js
import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// For admin-level operations that need service role
const supabaseAdmin = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function handle({ event, resolve }) {
	console.log(`Request path: ${event.url.pathname}`);

	// Get the auth token from the request headers
	const authHeader = event.request.headers.get('Authorization');
	let session = null;

	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];
		if (token) {
			try {
				// Add a timeout to prevent hanging
				const authPromise = supabaseAdmin.auth.getUser(token);
				const timeoutPromise = new Promise((_, reject) =>
					setTimeout(() => reject(new Error('Auth verification timed out')), 5000)
				);

				// Use Promise.race to implement the timeout
				const { data, error } = await Promise.race([authPromise, timeoutPromise]);

				if (!error) {
					session = {
						user: data.user
					};
				}
			} catch (err) {
				console.error('Auth verification error or timeout:', err.message);
				// Continue without session rather than hanging
			}
		}
	}

	// Add the session and admin client to event.locals
	event.locals.session = session;
	event.locals.supabaseAdmin = supabaseAdmin;

	// Helper method to get the session
	event.locals.getSession = async () => {
		return session;
	};

	const response = await resolve(event);
	return response;
}
