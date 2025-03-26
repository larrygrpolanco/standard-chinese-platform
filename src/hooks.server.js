import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';

// Get environment variables (should be in .env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const handle = async ({ event, resolve }) => {
	// Create a supabase client for this request
	event.locals.supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, {
					path: '/',
					...options
				});
			},
			remove: (key, options) => {
				event.cookies.delete(key, {
					path: '/',
					...options
				});
			}
		}
	});

	// Get session for this request
	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	// Store the session in locals so it's available to endpoints
	event.locals.session = session;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
