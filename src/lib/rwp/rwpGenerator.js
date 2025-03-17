// src/lib/rwp/rwpGenerator.js
import { exerciseTypes } from './exerciseTypes.js';
import {
	getCompleteUnit,
	getCurrentUser,
	getUserPreferences,
	saveRwpContent
} from '$lib/supabase/client.js';

export async function generateRwpExercise(unitId, exerciseType, specificFocus = '', debug = false) {
	try {
		// 1. Get user data
		const user = await getCurrentUser();
		if (!user) throw new Error('User not authenticated');

		const userPreferences = await getUserPreferences();

		// 2. Get unit data
		const unitData = await getCompleteUnit(unitId);
		if (!unitData) throw new Error('Unit not found');

		// 3. Build user profile
		const userProfile = {
			full_name: userPreferences?.full_name || 'Student',
			learning_goals: userPreferences?.learning_goals || 'not specified',
			learning_level: userPreferences?.learning_level || 'beginner',
			personal_context: userPreferences?.personal_context || {},
			module_responses: userPreferences?.module_responses || {}
		};

		// 4. Get exercise type configuration
		const exerciseTypeConfig = exerciseTypes[exerciseType];
		if (!exerciseTypeConfig) throw new Error(`Exercise type '${exerciseType}' not supported`);

		// 5. PHASE 1: Plan the exercise content
		const plannerPrompt = exerciseTypeConfig.planTemplate(unitData, userProfile, specificFocus);

		const planResponse = await fetch('/api/generate-rwp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt: plannerPrompt, debug })
		});

		if (!planResponse.ok) {
			const error = await planResponse.json();
			throw new Error(error.error || 'Error generating content plan');
		}

		const planData = await planResponse.json();
		const plan = debug ? planData.raw : planData;

		if (debug) {
			console.log('=== PLAN PROMPT ===');
			console.log(plannerPrompt);
			console.log('=== PLAN RESPONSE ===');
			console.log(plan);
		}

		// 6. PHASE 2: Format the plan into proper JSON
		const formatterPrompt = exerciseTypeConfig.formatTemplate(plan, userProfile, specificFocus);

		const jsonResponse = await fetch('/api/generate-rwp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt: formatterPrompt, debug: true }) // Always use debug mode for reliable parsing
		});

		if (!jsonResponse.ok) {
			const error = await jsonResponse.json();
			throw new Error(error.error || 'Error formatting content');
		}

		// Always get both raw and parsed data for better error handling
		const jsonData = await jsonResponse.json();
		console.log('Response from formatting phase:', jsonData);

		// Handle debug mode display
		if (debug) {
			console.log('=== FORMATTER PROMPT ===');
			console.log(formatterPrompt);
			console.log('=== JSON RESPONSE ===');
			console.log(jsonData.raw);
			console.log('=== PARSED RESULT ===');
			console.log(jsonData.parsed);
		}

		// Check if we have a parsing error
		if (jsonData.error) {
			throw new Error(`JSON parsing error: ${jsonData.message}`);
		}

		// Use the parsed data in both debug and non-debug modes
		const contentToSave = jsonData.parsed || jsonData;

		if (!contentToSave || typeof contentToSave !== 'object') {
			throw new Error('Generated content is not a valid object');
		}

		// Add exercise_type to the content
		contentToSave.exercise_type = exerciseType;

		// Save to database (in both debug and non-debug mode)
		await saveRwpContent(unitId, contentToSave);

		// Return the content
		return contentToSave;
	} catch (error) {
		console.error('Error in generateRwpExercise:', error);
		throw error;
	}
}
