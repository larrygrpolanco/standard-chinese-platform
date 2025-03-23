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
	// Extract vocabulary
	const vocabulary = unitData.vocabulary || [];
	const formattedVocabulary = vocabulary
		.map((v) => `- ${v.chinese_simplified || ''}: ${v.english || ''}`)
		.join('\n');

	// Extract dialogues to focus on grammar patterns
	const dialogues = unitData.dialogues || [];
	const formattedDialogues = dialogues
		.map((d) => `- ${d.chinese_simplified || ''}: ${d.english || ''}`)
		.join('\n');

	// Extract user profile information with more detail
	const learningLevel = userProfile?.learning_level || 'beginner';
	const fullName = userProfile?.full_name || 'Student';
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

	// Determine question complexity based on level
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

# STORY PLANNING ANALYSIS
${analysis}

# VOCABULARY FROM THE UNIT
${formattedVocabulary}

# DIALOGUE PATTERNS AND GRAMMAR STRUCTURES
${formattedDialogues}

# USER'S PROFILE
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

# INSTRUCTIONS
Create a total of 10 questions of the following types:

## Multiple Choice Questions (6 questions)
- Create 6 multiple-choice questions about the reading passage
- Each question should have exactly 4 options (A, B, C, D) with only one correct answer
- Include a mix of:
  * 2 literal comprehension questions (facts directly stated in the text)
  * 2 inferential questions (drawing conclusions from the text)
  * 2 questions testing grammar patterns from the unit dialogues (how grammar structures are used)
- IMPORTANT: Make at least 2 questions connect to the user's personal interests or context
- For each question, provide:
  * The question in Chinese & English
  * 4 answer options in Chinese
  * The correct answer (A, B, C, or D)
  * A brief explanation in English of why the answer is correct

## Short Answer Questions (3 questions)
- Create 3 short answer questions that require 1-2 sentence responses
- Questions should explicitly encourage application of grammar patterns from the dialogues
- At least 1 question should relate to the user's personal context or interests
- For each question, provide:
  * The question in Chinese & English
  * A sample correct answer in Chinese & English
  * A brief note in English about what grammar patterns to look for in a good answer

## Open-Ended Reflection Question (1 question)
- Create 1 reflective question that connects the content to the learner's personal experience
- The question should promote using vocabulary AND specific grammar patterns from the unit
- The question should explicitly connect to the user's stated interests or learning goals
- Provide:
  * The question in Chinese & English
  * A brief guidance note in English (what this question aims to practice, specifying both vocabulary and grammar elements)

Format your response as follows:

# MULTIPLE CHOICE QUESTIONS
1. [Question in Chinese & English]
   A. [Option A in Chinese & English]
   B. [Option B in Chinese & English]
   C. [Option C in Chinese & English]
   D. [Option D in Chinese & English]
   Correct: [A/B/C/D]
   Explanation: [Brief explanation in English]

[Continue for all 6 multiple choice questions]

# SHORT ANSWER QUESTIONS
1. [Question in Chinese]
   Sample Answer: [Sample answer in Chinese & English]
   Assessment Guide: [Brief note in English, specifying grammar patterns to look for]

[Continue for all 3 short answer questions]

# REFLECTION QUESTION
[Question in Chinese & English]
Guidance: [Brief guidance note in English, specifying both vocabulary and grammar elements to practice]

IMPORTANT REMINDER:
- Make questions directly relevant to the user's interests and context wherever possible
- Ensure questions test both vocabulary AND grammar patterns from the unit
- Adapt the difficulty to the user's specified level: ${learningLevel}
`;
}
