// src/lib/usage/usageTracking.js
import { supabase } from '$lib/supabase/client';
import { STRIPE_CONFIG } from '$lib/stripe/config';

/**
 * Checks if a user can use a specific feature
 * @param {string} userId - The user's ID
 * @param {string} feature - The feature to check ('rwp' or 'tts')
 * @returns {Promise<Object>} - Object with allowed status and reason
 */
export async function canUseFeature(userId, feature) {
	if (!userId) {
		return { allowed: false, reason: 'not_authenticated' };
	}

	// Get subscription status
	const { data: subscription } = await supabase
		.from('user_subscriptions')
		.select('subscription_status')
		.eq('id', userId)
		.single();

	const isPremium = subscription?.subscription_status === 'active';

	// TTS is premium-only
	if (feature === 'tts' && !isPremium) {
		return { allowed: false, reason: 'premium_required' };
	}

	// For RWP, check usage limits
	if (feature === 'rwp') {
		const { data: usage } = await supabase
			.from('feature_usage')
			.select('rwp_count, rwp_reset_at')
			.eq('id', userId)
			.single();

		// If premium, check against premium limits
		if (isPremium) {
			// Get current day count
			const dailyCount = usage?.rwp_count || 0;
			const dailyLimit = STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day;

			if (dailyCount >= dailyLimit) {
				return { allowed: false, reason: 'daily_limit_reached' };
			}
		}
		// Free tier limits
		else {
			const weeklyCount = usage?.rwp_count || 0;
			const weeklyLimit = STRIPE_CONFIG.FREE_TIER_LIMITS.rwp_per_week;

			// Check if we need to reset the counter
			const resetAt = usage?.rwp_reset_at ? new Date(usage.rwp_reset_at) : null;
			const now = new Date();

			if (resetAt && now >= resetAt) {
				// Reset counter
				await supabase
					.from('feature_usage')
					.update({
						rwp_count: 0,
						rwp_reset_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 days
						updated_at: now
					})
					.eq('id', userId);

				// They can use it now
				return { allowed: true, reason: 'counter_reset' };
			}

			// Check against weekly limit
			if (weeklyCount >= weeklyLimit) {
				return {
					allowed: false,
					reason: 'weekly_limit_reached',
					resetAt
				};
			}
		}
	}

	// If we made it here, they can use the feature
	return { allowed: true };
}

/**
 * Increments the usage count for a feature
 * @param {string} userId - The user's ID
 * @param {string} feature - The feature to increment ('rwp' or 'tts')
 * @returns {Promise<boolean>} - Success status
 */
export async function incrementUsage(userId, feature) {
	if (!userId) return false;

	const now = new Date();

	// Get current usage
	const { data: usage } = await supabase
		.from('feature_usage')
		.select('*')
		.eq('id', userId)
		.single();

	// Create usage record if it doesn't exist
	if (!usage) {
		let insertData = {
			id: userId,
			updated_at: now
		};

		// For free users, set a reset date for RWP
		if (feature === 'rwp') {
			const { data: subscription } = await supabase
				.from('user_subscriptions')
				.select('subscription_status')
				.eq('id', userId)
				.single();

			if (subscription?.subscription_status !== 'active') {
				insertData.rwp_reset_at = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days
			}

			insertData.rwp_count = 1;
		} else if (feature === 'tts') {
			insertData.tts_count = 1;
		}

		await supabase.from('feature_usage').insert(insertData);

		return true;
	}

	// Update existing usage record
	const updateData = {
		updated_at: now
	};

	if (feature === 'rwp') {
		updateData.rwp_count = (usage.rwp_count || 0) + 1;
	} else if (feature === 'tts') {
		updateData.tts_count = (usage.tts_count || 0) + 1;
	}

	await supabase.from('feature_usage').update(updateData).eq('id', userId);

	return true;
}

/**
 * Gets usage statistics for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} - Object with usage statistics
 */
export async function getUserUsageStats(userId) {
	if (!userId) return null;

	// Get subscription status
	const { data: subscription } = await supabase
		.from('user_subscriptions')
		.select('subscription_status, current_period_end')
		.eq('id', userId)
		.single();

	// Get feature usage
	const { data: usage } = await supabase
		.from('feature_usage')
		.select('rwp_count, tts_count, rwp_reset_at')
		.eq('id', userId)
		.single();

	const isPremium = subscription?.subscription_status === 'active';

	return {
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
	};
}
