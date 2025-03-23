import { json } from '@sveltejs/kit';
import { createApiClient } from '$lib/apiClient.js';

export async function POST({ request }) {
	try {
		const {
			unitData,
			userProfile,
			specificFocus,
			apiProvider = 'deepseek',
			debug = false
		} = await request.json();

		if (!unitData) {
			return json({ error: 'No unit data provided' }, { status: 400 });
		}

		const apiClient = createApiClient(apiProvider);
		const messages = [
			{
				role: 'system',
				content:
					'You are a Chinese language education expert specializing in analyzing and planning personalized learning materials.'
			},
			{
				role: 'user',
				content: createStoryAnalysisPrompt(unitData, userProfile, specificFocus)
			}
		];

		const { response, data } = await apiClient.fetchCompletion(messages, {
			temperature: 0.7,
			model: 'gpt-4o-mini-2024-07-18'
		});

		if (!response.ok) {
			return json(
				{ error: data.error?.message || `${apiClient.provider} API error` },
				{ status: response.status }
			);
		}

		const content = data.choices[0].message.content;
		return json({ analysis: content, provider: apiClient.provider });
	} catch (error) {
		console.error('Error analyzing story:', error);
		return json({ error: 'Failed to analyze story' }, { status: 500 });
	}
}

function createStoryAnalysisPrompt(unitData, userProfile, specificFocus) {
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

	// Module responses
	const moduleId = unitData.module?.id || unitData.module_id;
	const currentModuleResponses = userProfile?.module_responses?.[moduleId] || {};
	const formattedResponses = Object.entries(currentModuleResponses)
		.map(([questionId, answer]) => `${questionId}: "${answer}"`)
		.join('\n');

	return `
## OBJECTIVE
Analyze how to create a first-person narrative Chinese language practice story that:
1. Uses vocabulary and grammar patterns from the current unit
2. Authentically connects to the learner's personal context and interests
3. Presents language in natural, practical situations
4. Is comprehensible! Uses simple language with harder vocabulary only for words related to the learner's interests.

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

## CONTENT TO WORK WITH
### Vocabulary to Include
${formattedVocabulary}

### Key Grammatical Patterns to Practice
${formattedDialogues}

## SPECIFIC FOCUS (if any)
${specificFocus || 'None specified'}

## ANALYSIS TASK

Provide a comprehensive analysis of how to create an effective, personalized language practice story by addressing the following:

1. **Learner Context Analysis**:
   - Based on the profile, what aspects of this person's life would make a relevant language practice scenario/story?
   - What real scenarios might they encounter where this unit's language would be useful?
   - What tone and style might resonate with this particular learner?

2. **Core Language Pattern Identification**:
   - Identify 3-5 key grammatical structures from the dialogues (not just vocabulary)
   - Note how these patterns could be used in contexts relevant to the learner
   - The vocabulary and formatted dialogues are more than 50 years old - how can you make them more modern while keeping them accessible?

3. **Interest Integration Opportunities**:
   - List 3-4 natural ways to incorporate the learner's specific interests as background elements
   - Identify 2-3 possible connections between the unit topic and the learner's life/interests

4. **Setting & Scenario Design**:
   - Create an interesting scenario set in the learner's location that would require using this unit's language
   - Ensure the scenario aligns with their occupation, daily activities, or learning goals

5. **Question Planning for Later Assessment**:
   - Outline 3-4 potential question topics that would test comprehension of both language patterns AND the story content
   - Note how these questions could connect to the learner's personal context
   - Suggest 1-2 reflection questions that would help the learner apply this language to their own goals

Format your analysis in clear sections with the headings above. Be specific and concrete in your recommendations for story elements, but do NOT write the actual story. Focus on planning an optimal approach.
`;
}
