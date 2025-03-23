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
## ANALYSIS OBJECTIVE
Analyze the unit content and learner profile to to create a first-person narrative Chinese language practice story that:
- Uses vocabulary and grammar patterns from the current unit
- Authentically connects to the learner's personal context and interests
- Presents language in relevant situations
- Is comprehensible! Uses simple language with harder vocabulary only for words related to the learner's interests.

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

## Personal Preferences and interests: 
Personal Responses: ${formattedResponses}

## UNIT CONTENT
### Key Vocabulary (include at least 5)
${formattedVocabulary}

### Dialogue Patterns (Analyze Key Grammatical Patterns to Practice)
${formattedDialogues}

## SPECIFIC FOCUS (if any)
${specificFocus || 'None specified'}

## ANALYSIS TASKS
Provide an analysis of how to create an effective, personalized language practice story by addressing the following:

1. **Grammar Pattern Identification**:
   - Identify 3-4 key grammatical structures from the dialogues
   - Explain how these patterns could be applied in contexts relevant to the learner

2. **Vocabulary Selection**:
   - Select 5-8 vocabulary items most relevant to the learner's context
   - The vocabulary and formatted dialogues are more than 50 years old. How can you make them more modern while keeping them relevant to the learner?

3. **Learner Context Integration**:
   - Based on the learner profile, how could the unit's grammar and vocabulary be used to connect to this learner?
   - What tone and style might resonate with this particular learner?
   - Based on the learner's level, suggest specific ways to improve this stories comprehensibility (repetition, simplified structures, etc.)

4. **Interest Integration Opportunities**:
   - List a natural way to incorporate the learner's specific interests as background elements
   - Identify a possible connections between the unit topic and the learner's life/interests

Format your analysis in clear sections with the headings above. Be specific and concrete in your recommendations for story elements, but do NOT write the actual story. Focus on planning an pedagogical approach to creating a relevant and engaging practice story for the learner.
`;
}
