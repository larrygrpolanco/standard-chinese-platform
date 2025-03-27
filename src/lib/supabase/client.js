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
		.maybeSingle();

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

// Add this to src/lib/supabase/client.js
export async function deleteUserAccount() {
	const { data: sessionData } = await supabase.auth.getSession();
	const token = sessionData?.session?.access_token;

	if (!token) {
		throw new Error('Not authenticated. Please log in.');
	}

	const response = await fetch('/api/account/delete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to delete account');
	}

	return true;
}

// Stripe
// Get user's subscription status
export async function getUserSubscription() {
	const user = await getCurrentUser();
	if (!user) return { tier: 'free' };

	const { data, error } = await supabase
		.from('user_subscriptions')
		.select('subscription_status, current_period_end, stripe_customer_id, subscription_id')
		.eq('user_id', user.id)
		.maybeSingle();

	if (error) {
		console.error('Error fetching subscription:', error);
		return { tier: 'free' };
	}

	if (!data) {
		return { tier: 'free' };
	}

	return {
		tier: data.subscription_status || 'free',
		expiresAt: data.current_period_end,
		customerId: data.stripe_customer_id,
		subscriptionId: data.subscription_id
	};
}

// Check if RWP is available for current user
export async function checkRWPAvailability() {
	const user = await getCurrentUser();
	if (!user) return { allowed: false, reason: 'Not authenticated' };

	// First get the subscription status
	const subscription = await getUserSubscription();

	// Get the usage information
	const { data: usage, error } = await supabase
		.from('user_usage')
		.select('rwp_week_count, rwp_week_reset, rwp_day_count, rwp_day_reset')
		.eq('user_id', user.id)
		.maybeSingle();

	if (error) {
		console.error('Error fetching usage:', error);
		return { allowed: false, reason: 'Error checking limits' };
	}

	// Initialize usage if not exists
	if (!usage) {
		// Create a new usage record
		const now = new Date().toISOString();
		const nextWeek = new Date();
		nextWeek.setDate(nextWeek.getDate() + 7);

		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		await supabase.from('user_usage').insert({
			user_id: user.id,
			rwp_week_count: 0,
			rwp_week_reset: nextWeek.toISOString(),
			rwp_day_count: 0,
			rwp_day_reset: tomorrow.toISOString(),
			last_updated: now
		});

		return {
			allowed: true,
			remaining: subscription.tier === 'premium' ? 20 : 3,
			tier: subscription.tier
		};
	}

	// Check if we need to reset counters
	const now = new Date();
	let weekCount = usage.rwp_week_count;
	let dayCount = usage.rwp_day_count;

	// Check if week needs reset
	if (new Date(usage.rwp_week_reset) <= now) {
		weekCount = 0;
		const nextWeek = new Date();
		nextWeek.setDate(nextWeek.getDate() + 7);

		await supabase
			.from('user_usage')
			.update({
				rwp_week_count: 0,
				rwp_week_reset: nextWeek.toISOString(),
				last_updated: now.toISOString()
			})
			.eq('user_id', user.id);
	}

	// Check if day needs reset (for premium tier)
	if (subscription.tier === 'premium' && new Date(usage.rwp_day_reset) <= now) {
		dayCount = 0;
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		await supabase
			.from('user_usage')
			.update({
				rwp_day_count: 0,
				rwp_day_reset: tomorrow.toISOString(),
				last_updated: now.toISOString()
			})
			.eq('user_id', user.id);
	}

	// Check limits based on tier
	if (subscription.tier === 'premium') {
		// Premium: 20 per day limit
		if (dayCount >= 20) {
			const resetTime = new Date(usage.rwp_day_reset);
			return {
				allowed: false,
				reason: 'Daily limit reached',
				resetTime,
				tier: 'premium',
				remaining: 0
			};
		}

		return {
			allowed: true,
			tier: 'premium',
			remaining: 20 - dayCount
		};
	} else {
		// Free tier: 3 per week limit
		if (weekCount >= 3) {
			const resetTime = new Date(usage.rwp_week_reset);
			return {
				allowed: false,
				reason: 'Weekly limit reached',
				resetTime,
				tier: 'free',
				remaining: 0
			};
		}

		return {
			allowed: true,
			tier: 'free',
			remaining: 3 - weekCount
		};
	}
}

// Increment RWP usage counter
export async function incrementRWPUsage() {
	const user = await getCurrentUser();
	if (!user) return false;

	const { data: usage } = await supabase
		.from('user_usage')
		.select('rwp_week_count, rwp_day_count')
		.eq('user_id', user.id)
		.maybeSingle();

	if (!usage) {
		// Handle first-time usage
		await checkRWPAvailability(); // This creates the usage record
		return true;
	}

	// Update both counters
	const { error: updateError } = await supabase
		.from('user_usage')
		.update({
			rwp_week_count: usage.rwp_week_count + 1,
			rwp_day_count: usage.rwp_day_count + 1,
			last_updated: new Date().toISOString()
		})
		.eq('user_id', user.id);

	if (updateError) {
		console.error('Error updating usage count:', updateError);
		return false;
	}

	return true;
}

// Check if TTS is available for current user
export async function checkTTSAvailability() {
	const user = await getCurrentUser();
	if (!user) return { allowed: false, reason: 'Not authenticated' };

	// First get the subscription status
	const subscription = await getUserSubscription();

	// TTS is premium-only
	if (subscription.tier !== 'premium') {
		return {
			allowed: false,
			reason: 'TTS requires premium subscription',
			upgradeAvailable: true
		};
	}

	// Get the usage information
	const { data: usage, error } = await supabase
		.from('user_usage')
		.select('tts_day_count, tts_day_reset')
		.eq('user_id', user.id)
		.maybeSingle();

	if (error) {
		console.error('Error fetching usage:', error);
		return { allowed: false, reason: 'Error checking limits' };
	}

	// Initialize usage if not exists
	if (!usage) {
		// Create a new usage record
		const now = new Date().toISOString();
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		await supabase.from('user_usage').upsert({
			user_id: user.id,
			tts_day_count: 0,
			tts_day_reset: tomorrow.toISOString(),
			last_updated: now
		});

		return {
			allowed: true,
			remaining: 20,
			tier: 'premium'
		};
	}

	// Check if day needs reset
	const now = new Date();
	let dayCount = usage.tts_day_count;

	if (new Date(usage.tts_day_reset) <= now) {
		dayCount = 0;
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		await supabase
			.from('user_usage')
			.update({
				tts_day_count: 0,
				tts_day_reset: tomorrow.toISOString(),
				last_updated: now.toISOString()
			})
			.eq('user_id', user.id);
	}

	// Check if limit reached
	if (dayCount >= 20) {
		const resetTime = new Date(usage.tts_day_reset);
		return {
			allowed: false,
			reason: 'Daily TTS limit reached',
			resetTime,
			tier: 'premium',
			remaining: 0
		};
	}

	return {
		allowed: true,
		tier: 'premium',
		remaining: 20 - dayCount
	};
}

// Increment TTS usage counter
export async function incrementTTSUsage() {
	const user = await getCurrentUser();
	if (!user) return false;

	const { data: usage } = await supabase
		.from('user_usage')
		.select('tts_day_count')
		.eq('user_id', user.id)
		.maybeSingle();

	if (!usage) {
		// Handle first-time usage
		await checkTTSAvailability(); // This creates the usage record
		return true;
	}

	// Update counter
	const { error: updateError } = await supabase
		.from('user_usage')
		.update({
			tts_day_count: usage.tts_day_count + 1,
			last_updated: new Date().toISOString()
		})
		.eq('user_id', user.id);

	if (updateError) {
		console.error('Error updating TTS usage count:', updateError);
		return false;
	}

	return true;
}

// Helper function to generate TTS audio
export async function generateTTS(text, voice, language = 'zh', instructions = '') {
	// Check TTS availability first
	const availability = await checkTTSAvailability();

	if (!availability.allowed) {
		throw new Error(
			`TTS not available: ${availability.reason}. ${
				availability.resetTime
					? `Available again: ${new Date(availability.resetTime).toLocaleString()}`
					: ''
			}`
		);
	}

	// Get current auth session
	const { data: sessionData } = await supabase.auth.getSession();

	if (!sessionData?.session?.access_token) {
		throw new Error('Authentication required');
	}

	const response = await fetch('/api/tts', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sessionData.session.access_token}`
		},
		body: JSON.stringify({ text, voice, language, instructions })
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || 'Failed to generate speech');
	}

	// Increment the usage after successful generation
	await incrementTTSUsage();

	return await response.json();
}

// Create a checkout session
export async function createCheckoutSession() {
	// Get the current session token
	const { data: sessionData } = await supabase.auth.getSession();
	const token = sessionData?.session?.access_token;

	if (!token) {
		throw new Error('Not authenticated. Please log in.');
	}

	const response = await fetch('/api/stripe/create-checkout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to create checkout session');
	}

	const data = await response.json();
	return data.url;
}

// Create a customer portal session for managing subscription
// In src/lib/supabase/client.js
export async function createCustomerPortalSession() {
	// Get the current session token
	const { data: sessionData } = await supabase.auth.getSession();
	const token = sessionData?.session?.access_token;

	if (!token) {
		throw new Error('Not authenticated. Please log in.');
	}

	const response = await fetch('/api/stripe/portal', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to create portal session');
	}

	const data = await response.json();
	return data.url;
}
