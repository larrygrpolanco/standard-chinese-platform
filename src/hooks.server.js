// hooks.server.js
import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// For admin-level operations that need service role
const supabaseAdmin = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function handle({ event, resolve }) {
	console.log(`Request path: ${event.url.pathname}`);
	console.log(`Request headers:`, Object.fromEntries(event.request.headers));

	// Get the auth token from the request headers
	const authHeader = event.request.headers.get('Authorization');
	let session = null;

	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];
		if (token) {
			// Verify the token
			const { data, error } = await supabaseAdmin.auth.getUser(token);
			if (!error) {
				session = {
					user: data.user
				};
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
