// rwpGenerator.js OLD server-side generator
import {
	getCurrentUser,
	getCompleteUnit,
	getUserPreferences,
	saveRwpContent,
	checkRWPAvailability,
    incrementRWPUsage
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
		const updateProgress = (phase) => {
			if (typeof progressCallback === 'function') {
				progressCallback(phase);
			}
		};

		// Check RWP availability first
		updateProgress('checking_limits');
		const availability = await checkRWPAvailability();

		if (!availability.allowed) {
			throw new Error(
				`RWP limit reached: ${availability.reason}. ${
					availability.resetTime
						? `Available again: ${new Date(availability.resetTime).toLocaleString()}`
						: ''
				}`
			);
		}

		// Track usage immediately
		await incrementRWPUsage();

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
		const analysisStartTime = Date.now();

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

		console.log(`Story analysis took ${(Date.now() - analysisStartTime) / 1000} seconds`);

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
		const storyStartTime = Date.now();

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

		console.log(`Story generation took ${(Date.now() - storyStartTime) / 1000} seconds`);

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
		const questionsStartTime = Date.now();

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

		console.log(`Question generation took ${(Date.now() - questionsStartTime) / 1000} seconds`);

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
		const formatStartTime = Date.now();

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

		console.log(`Exercise formatting took ${(Date.now() - formatStartTime) / 1000} seconds`);

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
