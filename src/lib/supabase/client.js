// client.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add this to src/lib/supabase/client.js
export async function resetPassword(email) {
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${window.location.origin}/reset-password`
	});

	if (error) throw error;
	return true;
}

// Fetch all modules (ordered by order_num)
export async function getModules() {
	const { data, error } = await supabase
		.from('modules')
		.select('id, title, description, order_num, module_type')
		.order('order_num');

	if (error) {
		console.error('Error fetching modules:', error);
		return [];
	}

	return data || [];
}

// Fetch a specific module by ID
export async function getModuleById(id) {
	const { data, error } = await supabase
		.from('modules')
		.select('id, title, description, order_num, module_type')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching module:', error);
		return null;
	}

	return data;
}

// Fetch units by module ID
export async function getUnitsByModuleId(moduleId) {
	const { data, error } = await supabase
		.from('units')
		.select('id, title, description, order_num, module_id')
		.eq('module_id', moduleId)
		.order('order_num');

	if (error) {
		console.error('Error fetching units:', error);
		return [];
	}

	return data || [];
}

// Fetch unit with its module - basic info needed for all tabs
export async function getUnitBasicInfo(unitId) {
	const { data, error } = await supabase
		.from('units')
		.select(
			`
      id, title, description, order_num, module_id,
      module:modules(id, title, description, order_num)
    `
		)
		.eq('id', unitId)
		.single();

	if (error) {
		console.error('Error fetching unit with module:', error);
		return null;
	}

	return data;
}

// Fetch vocabulary for the Vocabulary tab
export async function getUnitVocabularyData(unitId) {
	const { data, error } = await supabase
		.from('vocabulary')
		.select('id, chinese_simplified, chinese_traditional, pinyin, english, order_num')
		.eq('unit_id', unitId)
		.order('order_num');

	if (error) {
		console.error('Error fetching vocabulary:', error);
		return { vocabulary: [] };
	}

	return { vocabulary: data || [] };
}

// Fetch review tapes and dialogues for the Review tab
export async function getUnitReviewData(unitId) {
	const [tapesResult, dialoguesResult] = await Promise.all([
		supabase
			.from('tapes')
			.select('id, title, tape_type, audio_file, order_num')
			.eq('unit_id', unitId)
			.eq('tape_type', 'review')
			.order('order_num'),

		supabase
			.from('reference_list')
			.select(
				'id, number, chinese_simplified, chinese_traditional, pinyin, english, notes, order_num'
			)
			.eq('unit_id', unitId)
			.order('order_num')
	]);

	const { data: tapesData, error: tapesError } = tapesResult;
	const { data: dialoguesData, error: dialoguesError } = dialoguesResult;

	if (tapesError) console.error('Error fetching review tapes:', tapesError);
	if (dialoguesError) console.error('Error fetching dialogues:', dialoguesError);

	// Return the dialogues directly without restructuring them
	return {
		reviewTapes: tapesData || [],
		dialogues: dialoguesData || [] // <-- This is now correct
	};
}

// Fetch workbook tapes and exercises for the Exercises tab
export async function getUnitExercisesData(unitId) {
	const { data: tapesData, error: tapesError } = await supabase
		.from('tapes')
		.select('id, title, tape_type, audio_file, order_num')
		.eq('unit_id', unitId)
		.eq('tape_type', 'workbook')
		.order('order_num');

	if (tapesError) {
		console.error('Error fetching workbook tapes:', tapesError);
		return { workbookTapes: [], exercises: [] };
	}

	const workbookTapes = tapesData || [];
	const workbookTapeIds = workbookTapes.map((tape) => tape.id);

	if (workbookTapeIds.length === 0) {
		return { workbookTapes: [], exercises: [] };
	}

	const { data: exercisesData, error: exercisesError } = await supabase
		.from('exercises')
		.select('id, tape_id, title, exercise_type, instructions, display_url, order_num')
		.in('tape_id', workbookTapeIds)
		.order('order_num');

	if (exercisesError) {
		console.error('Error fetching exercises:', exercisesError);
		return { workbookTapes, exercises: [] };
	}

	return {
		workbookTapes,
		exercises: exercisesData || []
	};
}

// New function to fetch questions for a specific exercise
export async function getExerciseQuestions(exerciseId) {
	const { data, error } = await supabase
		.from('exercise_questions')
		.select('id, exercise_id, question_text, question_type, options, order_num')
		.eq('exercise_id', exerciseId)
		.order('order_num');

	if (error) {
		console.error('Error fetching exercise questions:', error);
		return [];
	}

	return data || [];
}

// Legacy function for backward compatibility
export async function getCompleteUnit(unitId) {
	const unitBasicInfo = await getUnitBasicInfo(unitId);
	if (!unitBasicInfo) return null;

	const [reviewData, exercisesData, vocabularyData] = await Promise.all([
		getUnitReviewData(unitId),
		getUnitExercisesData(unitId),
		getUnitVocabularyData(unitId)
	]);

	return {
		...unitBasicInfo,
		...reviewData,
		...exercisesData,
		...vocabularyData
	};
}

// Authentication functions
export async function signUp(email, password) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password
	});

	if (error) throw error;
	return data;
}

export async function signIn(email, password) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) throw error;
	return data;
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
	return true;
}

export async function getCurrentUser() {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	return user;
}

// Update a unit's progress status
export async function updateUnitProgress(unitId, status) {
	const user = await getCurrentUser();
	if (!user) throw new Error('User not authenticated');

	const { data, error } = await supabase.from('user_progress').upsert(
		{
			user_id: user.id,
			unit_id: unitId,
			status,
			last_accessed: new Date().toISOString()
		},
		{
			onConflict: 'user_id,unit_id'
		}
	);

	if (error) throw error;
	return data;
}

// Get user progress for either all units or a specific unit
export async function getUserProgress(unitId = null) {
	const user = await getCurrentUser();
	if (!user) return unitId ? null : [];

	let query = supabase
		.from('user_progress')
		.select(
			`
      id, 
      unit_id, 
      status, 
      last_accessed
    `
		)
		.eq('user_id', user.id);

	// If unitId is provided, filter for just that unit
	if (unitId) {
		query = query.eq('unit_id', unitId);
		const { data, error } = await query.maybeSingle();
		if (error) throw error;
		return data; // Will be null if no record exists
	} else {
		// Return all progress records
		const { data, error } = await query;
		if (error) throw error;
		return data || [];
	}
}

// Get the most recently accessed unit
export async function getLatestUnit() {
	const user = await getCurrentUser();
	if (!user) return null;

	const { data, error } = await supabase
		.from('user_progress')
		.select(
			`
      unit_id, 
      status,
      units(id, title, module_id, 
        modules(id, title, order_num))
    `
		)
		.eq('user_id', user.id)
		.order('last_accessed', { ascending: false })
		.limit(1)
		.single();

	if (error && error.code !== 'PGRST116') throw error;
	return data;
}

// Get RWP content for a unit
export async function getRwpContent(unitId) {
	const user = await getCurrentUser();
	if (!user) return null;

	const { data, error } = await supabase
		.from('rwp_content')
		.select('*')
		.eq('user_id', user.id)
		.eq('unit_id', unitId)
		.single();

	if (error && error.code !== 'PGRST116') throw error;

	// Important: Make sure exercise_type is at root level when returning
	if (data && data.content) {
		// If exercise_type isn't in the content, set a default
		if (!data.content.exercise_type) {
			data.content.exercise_type = 'reading_comprehension';
		}
	}

	return data;
}

// Save RWP generated content
export async function saveRwpContent(unitId, content) {
	const user = await getCurrentUser();
	if (!user) throw new Error('User not authenticated');

	// Ensure exercise_type is set
	if (!content.exercise_type) {
		content.exercise_type = 'reading_comprehension';
	}

	const { data, error } = await supabase.from('rwp_content').upsert(
		{
			user_id: user.id,
			unit_id: unitId,
			content,
			created_at: new Date().toISOString()
		},
		{
			onConflict: 'user_id,unit_id'
		}
	);

	if (error) throw error;
	return data;
}
// Save or update user preferences
export async function saveUserPreferences(preferences) {
	const user = await getCurrentUser();
	if (!user) throw new Error('User not authenticated');

	const { data, error } = await supabase.from('user_preferences').upsert(
		{
			user_id: user.id,
			...preferences,
			updated_at: new Date().toISOString()
		},
		{
			onConflict: 'user_id'
		}
	);

	if (error) throw error;
	return data;
}

// Get user preferences
export async function getUserPreferences() {
	const user = await getCurrentUser();
	if (!user) return null;

	const { data, error } = await supabase
		.from('user_preferences')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	if (error) throw error;
	return data;
}

// Subscription Functions
// Check if a user can use a specific feature
export async function canUseFeature(feature) {
	const user = await getCurrentUser();
	if (!user) {
		return { allowed: false, reason: 'not_authenticated' };
	}

	// Get subscription status
	const { data: subscription } = await supabase
		.from('user_subscriptions')
		.select('subscription_status')
		.eq('user_id', user.id)
		.single();

	const isPremium = subscription?.subscription_status === 'active';

	// Get the feature limits from config
	const { STRIPE_CONFIG } = await import('$lib/stripe/config.js');

	// TTS is premium-only
	if (feature === 'tts' && !isPremium) {
		return { allowed: false, reason: 'premium_required' };
	}

	// For RWP, check usage limits
	if (feature === 'rwp') {
		const { data: usage } = await supabase
			.from('feature_usage')
			.select('rwp_count, rwp_reset_at')
			.eq('user_id', user.id)
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
					.eq('user_id', user.id);

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

// Increment usage for a feature
export async function incrementUsage(feature) {
	const user = await getCurrentUser();
	if (!user) return false;

	const now = new Date();

	// Get current usage
	const { data: usage } = await supabase
		.from('feature_usage')
		.select('*')
		.eq('user_id', user.id)
		.single();

	// Create usage record if it doesn't exist
	if (!usage) {
		let insertData = {
			user_id: user.id,
			updated_at: now
		};

		// For free users, set a reset date for RWP
		if (feature === 'rwp') {
			const { data: subscription } = await supabase
				.from('user_subscriptions')
				.select('subscription_status')
				.eq('user_id', user.id)
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

	await supabase.from('feature_usage').update(updateData).eq('user_id', user.id);

	return true;
}

// Get user usage statistics
export async function getUserUsageStats() {
	const user = await getCurrentUser();
	if (!user) return null;

	// Get the config
	const { STRIPE_CONFIG } = await import('$lib/stripe/config.js');

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

// Create or update a Stripe customer
export async function createOrUpdateStripeCustomer(stripeCustomerId) {
	const user = await getCurrentUser();
	if (!user) throw new Error('User not authenticated');

	const { data, error } = await supabase.from('user_subscriptions').upsert(
		{
			user_id: user.id,
			stripe_customer_id: stripeCustomerId,
			updated_at: new Date()
		},
		{
			onConflict: 'user_id'
		}
	);

	if (error) throw error;
	return data;
}

// Update subscription details
export async function updateSubscription(subscriptionDetails) {
	const user = await getCurrentUser();
	if (!user) throw new Error('User not authenticated');

	const { data, error } = await supabase
		.from('user_subscriptions')
		.update({
			stripe_subscription_id: subscriptionDetails.id,
			subscription_status: subscriptionDetails.status,
			current_period_start: new Date(subscriptionDetails.current_period_start * 1000),
			current_period_end: new Date(subscriptionDetails.current_period_end * 1000),
			cancel_at_period_end: subscriptionDetails.cancel_at_period_end,
			updated_at: new Date()
		})
		.eq('user_id', user.id);

	if (error) throw error;
	return data;
}
