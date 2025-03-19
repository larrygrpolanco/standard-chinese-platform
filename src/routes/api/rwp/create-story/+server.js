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

	// Format responses with clear presentation for better context
	const formattedResponses = Object.entries(currentModuleResponses)
		.map(([questionId, answer]) => `${questionId}: "${answer}"`)
		.join('\n');

	// Determine appropriate length based on level
	let recommendedLength, sentenceComplexity;
	switch (learningLevel.toLowerCase()) {
		case 'beginner':
			recommendedLength = '2-3 short paragraphs (6-10 sentences total)';
			sentenceComplexity = 'Use simple sentence structures with basic grammar patterns';
			break;
		case 'intermediate':
			recommendedLength = '3-4 paragraphs (10-15 sentences total)';
			sentenceComplexity = 'Use a mix of simple and compound sentences';
			break;
		case 'advanced':
			recommendedLength = '4-5 paragraphs (15-20 sentences total)';
			sentenceComplexity =
				'Use more varied sentence structures while maintaining conversational tone';
			break;
		default:
			recommendedLength = '2-3 paragraphs (8-12 sentences total)';
			sentenceComplexity = 'Use straightforward conversational structures';
	}

	return `
Create a personalized Chinese language story that sounds like natural conversation and connects to the learner's interests and preferences.

# UNIT INFORMATION
Unit Title: ${unitData.title}
Description: ${unitData.description}
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

# USER'S PERSONAL PREFERENCES AND INTERESTS
${formattedResponses}

# SPECIFIC FOCUS (if any)
${specificFocus || 'None specified'}

# INSTRUCTIONS
1. Create a CONVERSATIONAL story that sounds like natural spoken Chinese, not formal written text. There should only be one speaker.
2. Length: ${recommendedLength}
3. Complexity: ${sentenceComplexity}
4. PERSONALIZATION PRIORITIES:
   - Make the story directly relevant to the user's expressed interests and preferences
   - Create a scenario the learner could imagine themselves in
   - Reference their specific responses about what they enjoy or are curious about
   - Focus on practical, everyday situations they might encounter

5. LANGUAGE APPROACH:
   - Use vocabulary and grammar from the unit naturally in context
   - Include realistic dialogue exchanges
   - Use speech patterns that reflect how people actually talk
   - Maintain an engaging, friendly tone

6. If the user provided minimal context, create an engaging scenario based on the module theme

7. Translate the story into English

Before writing the exercise story, take some time to plan the story. Plan the story inside <story_planning> tags:

a. Brainstorm story themes based on the chapter and vocabulary
b. Outline the story structure, ensuring it incorporates the DIALOGUE PATTERNS
c. List out potential sentences, marking where vocabulary words and grammar patterns will be used
d. Refine sentences to match the student level and character count
`;
}
