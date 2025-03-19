import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { unitData, userProfile, specificFocus, debug = false } = await request.json();

		if (!unitData) {
			return json({ error: 'No unit data provided' }, { status: 400 });
		}

		if (debug) {
			console.log('Story generator received:', { unitData, userProfile, specificFocus });
		}

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini-2024-07-18',
				messages: [
					{
						role: 'system',
						content:
							"You are a Chinese language education expert specializing in creating personalized, relevant learning materials. Your task is to create engaging stories that incorporate vocabulary and grammar from the lesson while connecting to the learner's personal context."
					},
					{
						role: 'user',
						content: createStoryPrompt(unitData, userProfile, specificFocus)
					}
				],
				temperature: 0.8 // Higher temperature for more creative stories
			})
		});

		const data = await response.json();

		if (!response.ok) {
			return json(
				{ error: data.error?.message || 'OpenAI API error' },
				{ status: response.status }
			);
		}

		const content = data.choices[0].message.content;

		return json({ story: content });
	} catch (error) {
		console.error('Error generating story:', error);
		return json({ error: 'Failed to generate story' }, { status: 500 });
	}
}

// Helper function to create the story prompt
function createStoryPrompt(unitData, userProfile, specificFocus) {
	// Extract vocabulary and dialogues
	const vocabulary = unitData.vocabulary || [];
	const dialogues = unitData.dialogues || [];

	const formattedVocabulary = vocabulary
		.map((v) => `- ${v.chinese_simplified || ''}: ${v.english || ''}`)
		.join('\n');

	const formattedDialogues = dialogues
		.map((d) => `- ${d.chinese_simplified || ''}: ${d.english || ''}`)
		.join('\n');

	// Extract user profile information
	const fullName = userProfile?.full_name || 'Student';
	const learningLevel = userProfile?.learning_level || 'beginner';
	const occupation = userProfile?.personal_context?.occupation || 'not specified';
	const location = userProfile?.personal_context?.location || 'not specified';
	const hobbies = userProfile?.personal_context?.hobbies || 'not specified';
	const reasonLearning = userProfile?.personal_context?.reason_learning || 'not specified';

	// Get module responses relevant to this unit
	const moduleId = unitData.module?.id || unitData.module_id;
	const currentModuleResponses = userProfile?.module_responses?.[moduleId] || {};

	const formattedResponses = Object.entries(currentModuleResponses)
		.map(([question, answer]) => `${question}: ${answer}`)
		.join('\n');

	return `
Create a personalized, engaging Chinese reading passage that will help the learner practice vocabulary and grammar from this unit. Make it deeply relevant to their personal context.

# UNIT INFORMATION
Unit Title: ${unitData.title}
Module: ${unitData.module?.title || ''}

# VOCABULARY TO INCLUDE
${formattedVocabulary}

# DIALOGUE PATTERNS TO INCORPORATE
${formattedDialogues}

# USER PROFILE
Name: ${fullName}
Level: ${learningLevel}
Occupation: ${occupation}
Location: ${location}
Hobbies: ${hobbies}
Reason for Learning: ${reasonLearning}

# USER'S MODULE RESPONSES
${formattedResponses}

# SPECIFIC FOCUS (if any)
${specificFocus || 'None specified'}

# INSTRUCTIONS
1. Create a story (3-4 paragraphs) that naturally uses vocabulary and grammar from this unit
2. Make it personally relevant to the user's life, work, location, and interests
3. Incorporate themes from their module responses
4. Write at an appropriate difficulty level (${learningLevel})
5. Write ONLY the story in Chinese - no translations yet
6. Include at least 8-10 vocabulary items from the unit naturally in the story
7. Make the story engaging, practical and useful for real-life situations

Return ONLY the Chinese story without any additional text, explanations, or translations.
`;
}
