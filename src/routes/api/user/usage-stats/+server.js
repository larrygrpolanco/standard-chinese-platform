// src/routes/api/user/usage-stats/+server.js
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { STRIPE_CONFIG } from '$lib/stripe/config.js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function GET({ request, cookies }) {
	try {
		// Create a new Supabase client
		const supabase = createClient(supabaseUrl, supabaseAnonKey, {
			auth: {
				persistSession: false,
				autoRefreshToken: false
			},
			global: {
				headers: {
					cookie: request.headers.get('cookie') || ''
				}
			}
		});

		// Get the user from the current session
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			return json({ error: 'User not authenticated' }, { status: 401 });
		}

		// Get subscription status
		const { data: subscription } = await supabase
			.from('user_subscriptions')
			.select('subscription_status, current_period_end')
			.eq('user_id', user.id)
			.single();

		// Get feature usage
		const { data: usage } = await supabase
			.from('feature_usage')
			.select('rwp_count, tts_count, rwp_reset_at')
			.eq('user_id', user.id)
			.single();

		const isPremium = subscription?.subscription_status === 'active';

		return json({
			subscription: {
				status: subscription?.subscription_status || 'free',
				renewalDate: subscription?.current_period_end || null
			},
			rwp: {
				count: usage?.rwp_count || 0,
				limit: isPremium
					? STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day
					: STRIPE_CONFIG.FREE_TIER_LIMITS.rwp_per_week,
				resetAt: usage?.rwp_reset_at || null,
				periodType: isPremium ? 'daily' : 'weekly'
			},
			tts: {
				count: usage?.tts_count || 0,
				available: isPremium
			}
		});
	} catch (error) {
		console.error('Error getting usage stats:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
