import { json } from '@sveltejs/kit';
import { createApiClient } from '$lib/apiClient.js';

export async function POST({ request }) {
	try {
		const {
			analysis,
			unitData,
			userProfile,
			specificFocus,
			apiProvider = 'deepseek',
			debug = false
		} = await request.json();

		if (!analysis) {
			return json({ error: 'No story analysis provided' }, { status: 400 });
		}

		if (!unitData) {
			return json({ error: 'No unit data provided' }, { status: 400 });
		}

		const apiClient = createApiClient(apiProvider);
		const messages = [
			{
				role: 'system',
				content:
					'You are a Chinese language education expert specializing in creating personalized, relevant learning materials.'
			},
			{
				role: 'user',
				content: createStoryGenerationPrompt(analysis, unitData, userProfile, specificFocus)
			}
		];

		const { response, data } = await apiClient.fetchCompletion(messages, {
			temperature: 0.8, // Higher temperature for more creative stories
			model: 'gpt-4o-mini-2024-07-18'
		});

		if (!response.ok) {
			return json(
				{ error: data.error?.message || `${apiClient.provider} API error` },
				{ status: response.status }
			);
		}

		const content = data.choices[0].message.content;
		return json({ story: content, provider: apiClient.provider });
	} catch (error) {
		console.error('Error generating story:', error);
		return json({ error: 'Failed to generate story' }, { status: 500 });
	}
}

function createStoryGenerationPrompt(analysis, unitData, userProfile, specificFocus) {
	// Extract data
	const vocabulary = unitData.vocabulary || [];
	const dialogues = unitData.dialogues || [];
	const formattedVocabulary = vocabulary
		.map((v) => `- ${v.chinese_simplified || ''}: ${v.english || ''}`)
		.join('\n');
	const formattedDialogues = dialogues
		.map((d) => `- ${d.chinese_simplified || ''}: ${d.english || ''}`)
		.join('\n');

	// Extract user profile
	const fullName = userProfile?.full_name || 'Student';
	const learningLevel = userProfile?.learning_level || 'beginner';
	const occupation = userProfile?.personal_context?.occupation || 'not specified';
	const location = userProfile?.personal_context?.location || 'not specified';
	const hobbies = userProfile?.personal_context?.hobbies || 'not specified';
	const reasonLearning = userProfile?.personal_context?.reason_learning || 'not specified';

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
## OBJECTIVE
Create a first-person narrative Chinese language practice story based on the provided analysis that:
1. Uses vocabulary and grammar patterns from the current unit
2. Authentically connects to the learner's personal context and interests
3. Presents language in natural, practical situations
4. Is comprehensible! Try to use simple language with harder vocabulary only for words related to the learner's interests.

## UNIT INFORMATION
Unit Title: ${unitData.title}
Description: ${unitData.description}
Module: ${unitData.module?.title || ''}

## LEARNER PROFILE
Name: ${fullName}
Level: ${learningLevel}
Occupation: ${occupation}
Location: ${location}
Hobbies: ${hobbies}
Reason for Learning: ${reasonLearning}

## CONTENT REQUIREMENTS
### Vocabulary to Include
${formattedVocabulary}

### Key Grammatical Patterns to Practice
${formattedDialogues}

## STORY PARAMETERS
Length: ${recommendedLength}
Complexity: ${sentenceComplexity}
Format: First-person narrative (single speaker)
Specific Focus (if any): ${specificFocus || 'None specified'}

## PREVIOUS ANALYSIS
The following analysis was created to guide your story creation. Use these insights to craft your narrative:

${analysis}

## STORY CREATION GUIDELINES
Write a first-person narrative story that:

1. **Begins with authentic context**:
   - Start from the learner's life situation (location, occupation)
   - Establish an interesting scenario where the language would naturally be used

2. **Integrates language patterns naturally**:
   - Incorporate the unit's language patterns in contextually appropriate and more modern ways
   - Occasionally add metacognitive elements that highlight the language being practiced

3. **Incorporates interests subtly**:
   - Weave in references to the learner's interests as background elements
   - Use these references to enhance the story rather than forcing them into the main plot

4. **Uses appropriate complexity**:
   - Match sentence structure to the specified learning level
   - Ensure vocabulary beyond the unit list is accessible to their level

After writing the Chinese story, provide a simple English translation.

## QUALITY CHECKLIST
Before submitting, verify the story meets these criteria:
- [ ] Uses first-person perspective consistently
- [ ] Set around the learner's context and interests
- [ ] References their reason for learning or personal preferences
- [ ] Incorporates at least one specific detail from their profile
- [ ] Uses required vocabulary/grammar naturally in context
- [ ] Maintains easy and appropriate language level throughout
- [ ] Feels like an engaging scenario, not just a contrived exercise
`;
}
