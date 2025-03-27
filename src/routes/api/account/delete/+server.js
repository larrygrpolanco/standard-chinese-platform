// src/routes/api/account/delete/+server.js
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	try {
		// Verify the user is authenticated
		const session = await locals.getSession();
		if (!session?.user) {
			return json({ success: false, message: 'Not authenticated' }, { status: 401 });
		}

		const userId = session.user.id;

		// Delete user data from various tables
		const tables = [
			'rwp_content',
			'user_progress',
			'user_preferences',
			'user_subscriptions',
			'user_usage'
		];

		// Delete user data from each table
		for (const table of tables) {
			const { error } = await locals.supabaseAdmin.from(table).delete().eq('user_id', userId);

			if (error && error.code !== 'PGRST116') {
				// Ignore "no rows" errors
				console.error(`Error deleting from ${table}:`, error);
			}
		}

		// Finally delete the user
		const { error } = await locals.supabaseAdmin.auth.admin.deleteUser(userId);

		if (error) {
			console.error('Error deleting user:', error);
			return json({ success: false, message: error.message }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Unexpected error deleting account:', error);
		return json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
	}
}
