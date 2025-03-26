// src/lib/middleware/subscriptionCheck.js
import { STRIPE_CONFIG } from '$lib/stripe/config.js';

// Check if user can access RWP
export async function checkRWPAccess(supabase, userId) {
	if (!userId) {
		return { allowed: false, reason: 'Not authenticated' };
	}

	// Get subscription status
	const { data: subscription } = await supabase
		.from('user_subscriptions')
		.select('subscription_status, current_period_end')
		.eq('user_id', userId)
		.maybeSingle();

	const subscriptionTier = subscription?.subscription_status || 'free';

	// Get usage data
	const { data: usage } = await supabase
		.from('user_usage')
		.select('rwp_week_count, rwp_week_reset, rwp_day_count, rwp_day_reset')
		.eq('user_id', userId)
		.maybeSingle();

	// If no usage record exists, the user is allowed (first use)
	if (!usage) {
		return { allowed: true, tier: subscriptionTier };
	}

	// Check limits based on subscription tier
	const now = new Date();

	if (subscriptionTier === 'premium') {
		// Check if subscription is expired
		if (subscription?.current_period_end && new Date(subscription.current_period_end) < now) {
			return {
				allowed: false,
				reason: 'Subscription expired',
				tier: 'free'
			};
		}

		// Check daily limit for premium tier
		if (usage.rwp_day_count >= STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day) {
			// Check if the day reset time has passed
			if (new Date(usage.rwp_day_reset) <= now) {
				return { allowed: true, tier: 'premium' };
			}

			return {
				allowed: false,
				reason: 'Daily limit reached',
				tier: 'premium',
				resetTime: new Date(usage.rwp_day_reset)
			};
		}

		return {
			allowed: true,
			tier: 'premium',
			remaining: STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day - usage.rwp_day_count
		};
	} else {
		// Free tier - check weekly limit
		if (usage.rwp_week_count >= STRIPE_CONFIG.FREE_TIER_LIMITS.rwp_per_week) {
			// Check if the week reset time has passed
			if (new Date(usage.rwp_week_reset) <= now) {
				return { allowed: true, tier: 'free' };
			}

			return {
				allowed: false,
				reason: 'Weekly limit reached',
				tier: 'free',
				resetTime: new Date(usage.rwp_week_reset),
				upgradeAvailable: true
			};
		}

		return {
			allowed: true,
			tier: 'free',
			remaining: STRIPE_CONFIG.FREE_TIER_LIMITS.rwp_per_week - usage.rwp_week_count
		};
	}
}

// Check if user can access TTS
export async function checkTTSAccess(supabase, userId) {
	if (!userId) {
		return { allowed: false, reason: 'Not authenticated' };
	}

	// Get subscription status
	const { data: subscription } = await supabase
		.from('user_subscriptions')
		.select('subscription_status, current_period_end')
		.eq('user_id', userId)
		.maybeSingle();

	// TTS is premium-only
	if (!subscription || subscription.subscription_status !== 'premium') {
		return {
			allowed: false,
			reason: 'TTS requires premium subscription',
			upgradeAvailable: true
		};
	}

	// Check if subscription is expired
	if (new Date(subscription.current_period_end) < new Date()) {
		return {
			allowed: false,
			reason: 'Subscription expired',
			upgradeAvailable: true
		};
	}

	return { allowed: true, tier: 'premium' };
}
