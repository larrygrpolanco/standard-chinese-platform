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
			learning_level: userPreferences?.learning_level || 'beginner',
			personal_context: userPreferences?.personal_context || {},
			module_responses: userPreferences?.module_responses || {}
		};

		// 4. Get exercise type configuration
		const exerciseTypeConfig = exerciseTypes[exerciseType];
		if (!exerciseTypeConfig) throw new Error(`Exercise type '${exerciseType}' not supported`);

		// 5. PHASE 1: Plan the exercise content
		const plannerPrompt = exerciseTypeConfig.plannerTemplate(unitData, userProfile, specificFocus);

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

		// 6. PHASE 2: Format the plan into proper JSON with traditional characters
		const formatterPrompt = exerciseTypeConfig.formatterTemplate(plan, userProfile, specificFocus);

		const jsonResponse = await fetch('/api/generate-rwp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt: formatterPrompt, debug })
		});

		if (!jsonResponse.ok) {
			const error = await jsonResponse.json();
			throw new Error(error.error || 'Error formatting content');
		}

		const jsonData = await jsonResponse.json();

		// Debug logging for second phase
		if (debug) {
			console.log('=== FORMATTER PROMPT ===');
			console.log(formatterPrompt);
			console.log('=== JSON RESPONSE ===');
			console.log(jsonData.raw);
			console.log('=== PARSED RESULT ===');
			console.log(jsonData.parsed);

			if (jsonData.parsed && jsonData.parsed.error) {
				throw new Error(`JSON parsing failed: ${jsonData.parsed.message}`);
			}

			return jsonData.parsed;
		}

		// 7. Save to database
		try {
			const parsedContent = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
			await saveRwpContent(unitId, parsedContent);
			return parsedContent;
		} catch (error) {
			console.error('Failed to process LLM response:', error);
			throw new Error('Failed to process generated content');
		}
	} catch (error) {
		console.error('Error in generateRwpExercise:', error);
		throw error;
	}
}
