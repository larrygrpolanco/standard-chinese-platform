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

		// 4. Generate the prompt
		const exerciseTypeConfig = exerciseTypes[exerciseType];
		if (!exerciseTypeConfig) throw new Error(`Exercise type '${exerciseType}' not supported`);

		const prompt = exerciseTypeConfig.template(unitData, userProfile, specificFocus);

		// 5. Call API through server endpoint
		const response = await fetch('/api/generate-rwp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt, debug }) // Pass debug flag
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Error generating content');
		}

		const responseData = await response.json();

		// If in debug mode, return the debugging info and log to console
		if (debug) {
			console.log('=== LLM RAW RESPONSE ===');
			console.log(responseData.raw);
			console.log('=== PARSED RESULT ===');
			console.log(responseData.parsed);

			if (responseData.parsed.error) {
				throw new Error(`JSON parsing failed: ${responseData.parsed.message}`);
			}

			return responseData.parsed;
		}

		// 6. Parse and save to database
		let parsedContent;
		try {
			// For normal mode, responseData contains the raw string
			parsedContent = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
			await saveRwpContent(unitId, parsedContent);
			return parsedContent;
		} catch (error) {
			console.error('Failed to parse LLM response:', error);
			throw new Error('Generated content was not valid JSON');
		}
	} catch (error) {
		console.error('Error in generateRwpExercise:', error);
		throw error;
	}
}
