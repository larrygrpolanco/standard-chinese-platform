// src/routes/api/create-questions/+server.js
import { json } from '@sveltejs/kit';
import { createApiClient } from '$lib/apiClient.js';

export async function POST({ request }) {
	try {
		const {
			story,
			analysis,
			unitData,
			userProfile,
			specificFocus,
			apiProvider = 'deepseek',
			debug = false
		} = await request.json();

		if (!story) {
			return json({ error: 'No story provided' }, { status: 400 });
		}

		if (debug) {
			console.log('Question generator received:', {
				story: story.substring(0, 100) + '...',
				unitData,
				userProfile,
				apiProvider
			});
		}

		const apiClient = createApiClient(apiProvider);
		const messages = [
			{
				role: 'system',
				content:
					"You are a Chinese language education expert specializing in creating effective, personalized assessment questions. Your task is to create various types of questions based on a provided reading passage that connect to both the unit content and the learner's personal context."
			},
			{
				role: 'user',
				content: createQuestionsPrompt(story, analysis, unitData, userProfile, specificFocus)
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

		return json({ questions: content, provider: apiClient.provider });
	} catch (error) {
		console.error('Error generating questions:', error);
		return json({ error: 'Failed to generate questions' }, { status: 500 });
	}
}

function createQuestionsPrompt(story, analysis, unitData, userProfile, specificFocus) {
	// Keep vocabulary and dialogues as reference
	const vocabulary = unitData.vocabulary || [];
	const dialogues = unitData.dialogues || [];
	const formattedVocabulary = vocabulary
		.map((v) => `- ${v.chinese_simplified || ''}: ${v.english || ''}`)
		.join('\n');
	const formattedDialogues = dialogues
		.map((d) => `- ${d.chinese_simplified || ''}: ${d.english || ''}`)
		.join('\n');

	// User profile information
	const learningLevel = userProfile?.learning_level || 'beginner';
	const fullName = userProfile?.full_name || 'Student';
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

	// Complexity based on level
	let questionComplexity;
	switch (learningLevel.toLowerCase()) {
		case 'beginner':
			questionComplexity =
				'Use basic sentence structures and vocabulary. Questions should be direct and straightforward. Focus on essential vocabulary recognition and basic understanding.';
			break;
		case 'intermediate':
			questionComplexity =
				'Use a mix of simple and complex sentences. Include some inference questions and more nuanced vocabulary usage. Test application of grammar patterns.';
			break;
		case 'advanced':
			questionComplexity =
				'Use more sophisticated language and complex grammar patterns. Include challenging inferential questions and test deeper understanding of language nuances.';
			break;
		default:
			questionComplexity =
				'Adapt questions to an average difficulty level with clear, straightforward language.';
	}

	return `
Create a comprehensive set of assessment questions based on the following Chinese reading passage. The questions should test different levels of comprehension and language skills.

# READING PASSAGE
${story}

# STORY ANALYSIS
${analysis}

# REFERENCE MATERIALS
## Unit Vocabulary (for reference)
${formattedVocabulary}

## Dialogue Patterns and Grammar Structures (for reference)
${formattedDialogues}

# LEARNER PROFILE
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

# QUESTION COMPLEXITY GUIDELINE
${questionComplexity}

# ASSESSMENT DESIGN
Create a focused set of high-quality assessment questions:

## Multiple Choice Questions (3 questions)
- Create 3 multiple-choice questions about the reading passage
- Each question must have exactly 4 options (A, B, C, D) with one correct answer
- Aim for a mix of question types:
  * Literal comprehension (testing basic understanding of facts)
  * Grammar application (testing how grammar structures are used)
  * Inferential (drawing conclusions or making connections)
- Make at least one question connect to the learner's personal context or interests
- For each question, provide:
  * The question in Chinese & English
  * 4 answer options in Chinese & English
  * The correct answer (A, B, C, or D)
  * A brief explanation of why the answer is correct

## Short Answer Questions (2 questions)
- Create 2 thoughtful short answer questions requiring 1-2 sentence responses
- Questions should encourage application of vocabulary or grammar from the unit
- At least one question should relate to the learner's personal context
- For each question, provide:
  * The question in Chinese & English
  * A correct answer in Chinese & English labeled as an example answer, but not the only answer
  * A brief note about what to look for in a good answer

## Reflection Question (1 question)
- Create 1 meaningful reflection question connecting the content to the learner's life
- The question should invite personal application of unit language
- The question should promote using vocabulary AND specific grammar patterns from the unit
- The question should explicitly connect to the user's stated interests or learning goals
- Provide:
  * The question in Chinese & English
  * A brief guidance note (what this question aims to practice)

Format your response as follows:

# MULTIPLE CHOICE QUESTIONS
1. [Question in Chinese & English]
   A. [Option A in Chinese & English]
   B. [Option B in Chinese & English]
   C. [Option C in Chinese & English]
   D. [Option D in Chinese & English]
   Correct: [A/B/C/D]
   Explanation: [Brief explanation in English]

[Continue for all 3 multiple choice questions]

# SHORT ANSWER QUESTIONS
1. [Question in Chinese & English]
   Sample Answer: [Sample answer in Chinese & English]
   Assessment Guide: [Brief note in English about what to look for]

[Continue for all 2 short answer questions]

# REFLECTION QUESTION
[Question in Chinese & English]
Guidance: [Brief guidance note in English, specifying both vocabulary and grammar elements to practice]

QUALITY GUIDELINES:
- Focus on quality over quantity - each question should be pedagogically meaningful
- Connect to the learner's contexts where natural, but don't force connections
- Make questions directly relevant to the user's interests and context wherever possible
- Questions should feel relevant and useful, not academic exercises
- Adapt complexity to the learner's specified level: ${learningLevel}
`;
}
