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
	// Extract user profile
	const fullName = userProfile?.full_name || 'Student';
	const occupation = userProfile?.personal_context?.occupation || 'not specified';
	const location = userProfile?.personal_context?.location || 'not specified';
	const hobbies = userProfile?.personal_context?.hobbies || 'not specified';
	const reasonLearning = userProfile?.personal_context?.reason_learning || 'not specified';

	// Determine appropriate length based on level
	const learningLevel = userProfile?.learning_level || 'beginner';
	let recommendedLength, sentenceComplexity;

	switch (learningLevel.toLowerCase()) {
		case 'beginner':
			recommendedLength = '2 short paragraphs (5-7 sentences total)';
			sentenceComplexity = 'Use simple sentence structures with basic patterns';
			break;
		case 'intermediate':
			recommendedLength = '2-3 paragraphs (7-10 sentences total)';
			sentenceComplexity = 'Use mostly simple sentences with occasional compound structures';
			break;
		case 'advanced':
			recommendedLength = '3-4 paragraphs (10-15 sentences total)';
			sentenceComplexity = 'Use natural variety of sentence structures while ensuring clarity';
			break;
		default:
			recommendedLength = '2-3 paragraphs (6-9 sentences total)';
			sentenceComplexity = 'Use straightforward conversational structures';
	}

	return `
## STORY CREATION TASK
Create a first-person narrative in Chinese that applies the previous analysis to create a personalized, comprehensible language practice experience.

## PREVIOUS ANALYSIS
${analysis}

## LEARNER PROFILE
Name: ${fullName}
Level: ${learningLevel}
Occupation: ${occupation}
Location: ${location}
Hobbies: ${hobbies}
Reason for Learning: ${reasonLearning}

## STORY PARAMETERS
- First-person perspective (as if the learner is speaking)
- Length: ${recommendedLength}
- Complexity: ${sentenceComplexity}
- Special focus: ${specificFocus || 'None specified'}

## CREATION GUIDELINES
1. **Prioritize comprehensibility** - make it accessible for the learner's level
2. **Use the specific grammar patterns and vocabulary identified** in the analysis
3. **Set the story in a relevant context** from the learner's life where Chinese would be used
4. **Incorporate natural repetition** of important language patterns
5. **Make connections explicit** between the language and the learner's interests or daily activities

The goal is to help the learner experience how the Chinese they're learning connects directly to their life, making it feel practical and meaningful rather than just academic.

## QUALITY CHECKLIST
Before submitting, verify the story meets these criteria:
- [ ] Uses first-person perspective consistently
- [ ] Incorporate the unit's language patterns in contextually appropriate and more modern ways
- [ ] References their reason for learning or personal preferences
- [ ] Incorporates at least one specific detail from their profile
- [ ] Uses required vocabulary/grammar naturally in context
- [ ] Maintains easy and appropriate language level throughout
- [ ] Feels like an engaging scenario, not just a contrived exercise
- [ ] Weave in references to the learner's interests as background elements

After writing the Chinese story, provide a simple English translation.
`;
}
