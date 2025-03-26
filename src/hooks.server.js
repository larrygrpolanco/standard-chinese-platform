// hooks.server.js
import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// For admin-level operations that need service role
const supabaseAdmin = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function handle({ event, resolve }) {
	// Only add admin client for operations needing higher privileges
	event.locals.supabaseAdmin = supabaseAdmin;

	const response = await resolve(event);
	return response;
}
