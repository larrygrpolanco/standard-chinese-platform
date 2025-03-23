// rwpGenerator.js
import {
	getCurrentUser,
	getCompleteUnit,
	getUserPreferences,
	saveRwpContent
} from '$lib/supabase/client.js';

/**
 * Generates a comprehensive practice exercise for a specific unit
 * using a three-phase approach: story creation, question creation, and formatting
 *
 * @param {number} unitId - The ID of the unit to generate content for
 * @param {string} specificFocus - Optional specific focus for the exercise
 * @param {boolean} debug - Whether to run in debug mode
 * @returns {Promise<Object>} The generated exercise content
 */
// Add a progress callback parameter to the function
export async function generateRwpExercise(
	unitId,
	specificFocus = '',
	debug = false,
	progressCallback = null
) {
	try {
		// Add a helper function to report progress
		const updateProgress = (phase) => {
			if (typeof progressCallback === 'function') {
				progressCallback(phase);
			}
		};

		// 1. Get user data
		updateProgress('init'); // Initial phase
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

		// 4. PHASE 1A: Analyze story requirements
		updateProgress('analysis'); // Update to analysis phase
		console.log('Analyzing story requirements...');
		const analysisResponse = await fetch('/api/rwp/analyze-story', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				unitData,
				userProfile,
				specificFocus,
				debug
			})
		});

		if (!analysisResponse.ok) {
			const errorData = await analysisResponse.json();
			throw new Error(errorData.error || 'Error analyzing story requirements');
		}

		const analysisData = await analysisResponse.json();
		const analysis = analysisData.analysis;

		if (debug) {
			console.log('=== STORY ANALYSIS COMPLETED ===');
			console.log(analysis);
		}

		// 5. PHASE 1B: Generate the story based on analysis
		updateProgress('story'); // Update to story generation phase
		console.log('Generating story based on analysis...');
		const storyResponse = await fetch('/api/rwp/generate-story', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				analysis,
				unitData,
				userProfile,
				specificFocus,
				debug
			})
		});

		if (!storyResponse.ok) {
			const errorData = await storyResponse.json();
			throw new Error(errorData.error || 'Error generating story');
		}

		const storyData = await storyResponse.json();
		const story = storyData.story;

		if (debug) {
			console.log('=== STORY GENERATED ===');
			console.log(story);
		}

		// 6. PHASE 2: Generate questions based on the story and analysis
		updateProgress('questions');
		console.log('Generating questions...');
		const questionsResponse = await fetch('/api/rwp/create-questions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				story,
				analysis, // Pass the analysis as well
				unitData,
				userProfile,
				specificFocus,
				debug
			})
		});

		// Continue with the rest of the function as before
		if (!questionsResponse.ok) {
			const errorData = await questionsResponse.json();
			throw new Error(errorData.error || 'Error generating questions');
		}

		const questionsData = await questionsResponse.json();
		const questions = questionsData.questions;

		if (debug) {
			console.log('=== QUESTIONS GENERATED ===');
			console.log(questions);
		}

		// 7. PHASE 3: Format everything into JSON structure
		updateProgress('formatting');
		console.log('Formatting exercise...');
		const formatResponse = await fetch('/api/rwp/format-exercise', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				story,
				questions,
				unitData,
				debug
			})
		});

		if (!formatResponse.ok) {
			const errorData = await formatResponse.json();
			throw new Error(errorData.error || 'Error formatting exercise');
		}

		// Get formatted data
		const formatData = await formatResponse.json();
		const contentToSave = debug ? formatData.parsed : formatData;

		if (debug) {
			console.log('=== FORMATTED RESULT ===');
			console.log(formatData);
		}

		// Save to database
		await saveRwpContent(unitId, contentToSave);

		// Return the content
		return contentToSave;
	} catch (error) {
		console.error('Error in generateRwpExercise:', error);
		throw error;
	}
}
