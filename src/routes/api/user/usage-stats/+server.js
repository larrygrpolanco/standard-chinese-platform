// src/routes/api/user/usage-stats/+server.js
import { json } from '@sveltejs/kit';
import { getUserUsageStats } from '$lib/supabase/client.js';

export async function GET() {
	try {
		const usageStats = await getUserUsageStats();
		if (!usageStats) {
			return json({ error: 'User not authenticated' }, { status: 401 });
		}

		return json(usageStats);
	} catch (error) {
		console.error('Error getting usage stats:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
