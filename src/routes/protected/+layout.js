// src/routes/protected/+layout.js
import { redirect } from '@sveltejs/kit';
import { getCurrentUser } from '$lib/supabase/client';

export async function load({ url }) {
	const user = await getCurrentUser();

	if (!user) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}

	return {
		user
	};
}
