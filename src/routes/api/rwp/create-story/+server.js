// src/routes/api/create-story/+server.js
import { json } from '@sveltejs/kit';
import { createApiClient } from '$lib/apiClient.js';

export async function POST({ request }) {
	try {
		const {
			unitData,
			userProfile,
			specificFocus,
			apiProvider = 'deepseek',
			debug = true
		} = await request.json();

		if (!unitData) {
			return json({ error: 'No unit data provided' }, { status: 400 });
		}

		if (debug) {
			console.log('Story generator received:', {
				unitData,
				userProfile,
				specificFocus,
				apiProvider
			});
		}

		const apiClient = createApiClient(apiProvider);
		const messages = [
			{
				role: 'system',
				content:
					"You are a Chinese language education expert specializing in creating personalized, relevant learning materials. Your task is to create engaging stories that incorporate vocabulary and grammar from the lesson while connecting to the learner's personal context."
			},
			{
				role: 'user',
				content: createStoryPrompt(unitData, userProfile, specificFocus)
			}
		];

		const { response, data } = await apiClient.fetchCompletion(messages, {
			temperature: 0.8, // Higher temperature for more creative stories
			model: 'o3-mini-2025-01-31' // Will be mapped to deepseek-chat if using DeepSeek
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
## OBJECTIVE
Create a first-person narrative Chinese language practice story that:
1. Uses vocabulary and grammar patterns from the current unit
2. Authentically connects to the learner's personal context and interests
3. Presents language in natural, practical situations
4. Feels personally relevant and engaging to the learner
5. Is comprehensible! Try to use as simple language as you can while only using harder vocabulary for words related to the learners interest. They are more likely to learn words that interest them.

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
Personal Preferences and interests: 
${formattedResponses}

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

## PRE-WRITING ANALYSIS

Before writing the story, carefully analyze how to create a relevant, engaging narrative by completing the following analysis inside <story_planning> tags:

1. **Learner Context Analysis**:
   - Based on the profile, what aspects of this person's life would make a relevant language practice scenerio/story?
   - What real scenarios might they encounter where this unit's language would be useful?
   - What tone and style might resonate with this particular learner?

2. **Core Language Pattern Identification**:
   - Identify 3-5 key grammatical structures from the dialogues (not just vocabulary)
   - Note how these patterns could be used in contexts relevant to the learner
   - The vocabulary and formatted dialogues are more than 50 years old how can you make it more modern while keeping it easy?

3. **Interest Integration Opportunities**:
   - List 3-4 natural ways to incorporate the learner's specific interests as background elements
   - Identify 2-3 possible connections between the unit topic and the learner's life/interests

4. **Setting & Scenario Design**:
   - Create an interesting scenario set in the learner's location that would require using this unit's language
   - Ensure the scenario aligns with their occupation, daily activities, or learning goals


## STORY CREATION GUIDELINES

After completing your analysis, write a first-person narrative story that:

1. **Begins with authentic context**:
   - Start from the learner's life situation (location, occupation)
   - Establish an interesting scenario where the language would naturally be used
   - Show how the language connects to real-life situations and possibly their reason for learning if appropriate

2. **Integrates language patterns naturally**:
   - Incorporate the unit's language patterns in contextually appropriate and more modern ways
   - Occasionally add metacognitive elements that highlight the language being practiced

3. **Incorporates interests subtly**:
   - Weave in references to the learner's interests as background elements
   - Use these references to enhance the story rather than forcing them into the main plot unless the plot can naturally center around it

4. **Uses appropriate complexity**:
   - Match sentence structure to the specified learning level
   - Ensure vocabulary beyond the unit list is easy to their level
   


After writing the Chinese story, provide an simple English translation.

## QUALITY CHECKLIST
Before submitting, verify the story meets these criteria:
- [ ] Uses first-person perspective consistently
- [ ] Set around the learner's context and interests
- [ ] References their reason for learning or personal prefrences
- [ ] Incorporates at least one specific detail from their profile
- [ ] Uses some required vocabulary/grammar naturally in context
- [ ] Maintains appropriate easy language level throughout
- [ ] Feels like an fun and engaging scenario, not just a contrived exercise
`;
}
