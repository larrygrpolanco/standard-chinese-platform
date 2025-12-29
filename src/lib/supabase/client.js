// client.js
// Local Demo Version - Replaces Supabase backend
import { DB } from '$lib/local-data';

// Helper function to simulate DB queries
const cleanData = (data) => JSON.parse(JSON.stringify(data));

export const supabase = {
    // Mock supabase client to avoid errors if imported elsewhere
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithOAuth: async () => ({ data: null, error: { message: 'Demo mode' } }),
    },
    from: (table) => {
        let mockData = [];
        if (table === 'modules') mockData = DB.modules || [];
        if (table === 'units') mockData = DB.units || [];
        if (table === 'vocabulary') mockData = DB.vocabulary || [];
        if (table === 'tapes') mockData = DB.tapes || [];
        if (table === 'reference_list') mockData = DB.reference_list || [];
        if (table === 'exercises') mockData = DB.exercises || [];

        // For user tables, basically valid but empty
        const isUserTable = ['user_usage', 'user_subscriptions', 'user_progress'].includes(table);

        const mkBuilder = (data) => ({
            select: () => mkBuilder(data),
            eq: (col, val) => mkBuilder(data.filter(i => i[col] == val)),
            in: (col, vals) => mkBuilder(data.filter(i => vals.includes(i[col]))),
            order: (col) => {
                 const sorted = [...data].sort((a,b) => a[col] - b[col]);
                 return mkBuilder(sorted);
            },
            single: async () => ({ data: data[0] || null, error: null }),
            maybeSingle: async () => ({ data: data[0] || null, error: null }),
            // Make it thenable to return the data list
            then: (resolve) => Promise.resolve({ data: cleanData(data), error: null }).then(resolve),
            
            // Write mocks
            update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
            insert: () => Promise.resolve({ data: null, error: null }),
            upsert: () => Promise.resolve({ data: null, error: null }),
            delete: () => Promise.resolve({ data: null, error: null })
        });

        return mkBuilder(mockData);
    }
};

// Add this to src/lib/supabase/client.js
export async function resetPassword(email) {
	console.log('Reset password mock for:', email);
	return true;
}

// Fetch all modules (ordered by order_num)
export async function getModules() {
	const modules = DB.modules.sort((a, b) => a.order_num - b.order_num);
	return cleanData(modules);
}

// Fetch a specific module by ID
export async function getModuleById(id) {
	const module = DB.modules.find((m) => m.id == id);
	return cleanData(module || null);
}

// Fetch units by module ID
export async function getUnitsByModuleId(moduleId) {
	const units = DB.units
		.filter((u) => u.module_id == moduleId)
		.sort((a, b) => a.order_num - b.order_num);
	return cleanData(units);
}

// Fetch unit with its module - basic info needed for all tabs
export async function getUnitBasicInfo(unitId) {
    const unit = DB.units.find(u => u.id == unitId);
    if (!unit) return null;

    const module = DB.modules.find(m => m.id == unit.module_id);
    const result = {
        ...unit,
        module: module ? { ...module } : null
    };
    return cleanData(result);
}

// Fetch vocabulary for the Vocabulary tab
export async function getUnitVocabularyData(unitId) {
    const vocabulary = DB.vocabulary
        .filter(v => v.unit_id == unitId)
        .sort((a, b) => a.order_num - b.order_num);
    
    return { vocabulary: cleanData(vocabulary) };
}

// Fetch review tapes and dialogues for the Review tab
export async function getUnitReviewData(unitId) {
    const reviewTapes = DB.tapes
        .filter(t => t.unit_id == unitId && t.tape_type === 'review')
        .sort((a, b) => a.order_num - b.order_num);
    
    const dialogues = DB.reference_list
        .filter(d => d.unit_id == unitId)
        .sort((a, b) => a.order_num - b.order_num);

	return {
		reviewTapes: cleanData(reviewTapes),
		dialogues: cleanData(dialogues)
	};
}

// Fetch workbook tapes and exercises for the Exercises tab
export async function getUnitExercisesData(unitId) {
	const workbookTapes = DB.tapes
        .filter(t => t.unit_id == unitId && t.tape_type === 'workbook')
        .sort((a, b) => a.order_num - b.order_num);
    
    const workbookTapeIds = workbookTapes.map(t => t.id);

    let exercises = [];
    if (workbookTapeIds.length > 0) {
        exercises = DB.exercises
            .filter(e => workbookTapeIds.includes(e.tape_id))
            .sort((a, b) => a.order_num - b.order_num);
    }

	return {
		workbookTapes: cleanData(workbookTapes),
		exercises: cleanData(exercises)
	};
}

// New function to fetch questions for a specific exercise
export async function getExerciseQuestions(exerciseId) {
    const questions = (DB.exercise_questions || [])
        .filter(q => q.exercise_id == exerciseId)
        .sort((a, b) => a.order_num - b.order_num);
    
    return cleanData(questions);
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

// Authentication functions - Disabled for Demo
export async function signUp(email, password) {
    console.log('SignUp disabled in demo');
	return { data: { user: null }, error: null };
}

export async function signIn(email, password) {
    console.log('SignIn disabled in demo');
    return { data: { user: null, session: null }, error: { message: 'Demo mode: Login disabled' } };
}

export async function signOut() {
	return true;
}

export async function getCurrentUser() {
	return null; 
}

// Update a unit's progress status
export async function updateUnitProgress(unitId, status) {
	// No-op for demo
	return null;
}

// Get user progress for either all units or a specific unit
export async function getUserProgress(unitId = null) {
	// Return empty progress
    if (unitId) return null;
    return [];
}

// Get the most recently accessed unit
export async function getLatestUnit() {
	return null;
}

// Get RWP content for a unit
export async function getRwpContent(unitId) {
	return null;
}

// Save RWP generated content
export async function saveRwpContent(unitId, content) {
	// No-op
	return null;
}

// Save or update user preferences
export async function saveUserPreferences(preferences) {
	return null;
}

// Get user preferences
export async function getUserPreferences() {
	return null;
}

export async function deleteUserAccount() {
    throw new Error('Demo mode: Action disabled');
}

// Stripe check
export async function getUserSubscription() {
    return { tier: 'free' };
}

// Check if RWP is available for current user
// Check if RWP is available for current user
export async function checkRWPAvailability() {
    return { allowed: false, reason: 'Not authenticated' };
}

// Increment RWP usage counter
export async function incrementRWPUsage() {
    return false;
}

// Check if TTS is available for current user
export async function checkTTSAvailability() {
    return { allowed: false, reason: 'Demo mode' };
}

// Increment TTS usage counter
export async function incrementTTSUsage() {
    return false;
}

// Helper function to generate TTS audio
export async function generateTTS(text, voice, language = 'zh', instructions = '') {
    throw new Error('TTS disabled in demo mode');
}

// Create a checkout session
export async function createCheckoutSession() {
    throw new Error('Payments disabled in demo mode');
}

// Create a customer portal session for managing subscription
export async function createCustomerPortalSession() {
    throw new Error('Portal disabled in demo mode');
}

// Google OAuth
export async function signInWithGoogle() {
    console.log('OAuth disabled in demo');
    return { data: null, error: { message: 'Demo mode: Login disabled' } };
}

// Add this to handle user setup for OAuth users
export async function setupUserIfNeeded() {
    return null;
}

// Register service worker for audio caching if browser supports it
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(function(error) {
        console.log('Service Worker registration failed:', error);
      });
  });
}