import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { story, unitData, userProfile, specificFocus, debug = false } = await request.json();

		if (!story) {
			return json({ error: 'No story provided' }, { status: 400 });
		}

		if (debug) {
			console.log('Question generator received:', {
				story: story.substring(0, 100) + '...',
				unitData,
				userProfile
			});
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
							'You are a Chinese language education expert specializing in creating effective assessment questions. Your task is to create various types of questions based on a provided reading passage.'
					},
					{
						role: 'user',
						content: createQuestionsPrompt(story, unitData, userProfile, specificFocus)
					}
				],
				temperature: 0.7
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

		return json({ questions: content });
	} catch (error) {
		console.error('Error generating questions:', error);
		return json({ error: 'Failed to generate questions' }, { status: 500 });
	}
}

function createQuestionsPrompt(story, unitData, userProfile, specificFocus) {
	// Extract vocabulary
	const vocabulary = unitData.vocabulary || [];
	const formattedVocabulary = vocabulary
		.map((v) => `- ${v.chinese_simplified || ''}: ${v.english || ''}`)
		.join('\n');

	// Extract user profile information
	const learningLevel = userProfile?.learning_level || 'beginner';

	return `
Create a comprehensive set of assessment questions based on the following Chinese reading passage. The questions should test different levels of comprehension and language skills.

# READING PASSAGE
${story}

# VOCABULARY FROM THE UNIT
${formattedVocabulary}

# USER'S LEVEL
${learningLevel}

# SPECIFIC FOCUS (if any)
${specificFocus || 'None specified'}

# INSTRUCTIONS
Create a total of 10 questions of the following types:

## Multiple Choice Questions (6 questions)
- Create 6 multiple-choice questions about the reading passage
- Each question should have exactly 4 options (A, B, C, D) with only one correct answer
- Include a mix of:
  * 2 literal comprehension questions (facts directly stated in the text)
  * 2 inferential questions (drawing conclusions from the text)
  * 2 vocabulary usage questions (how words are used in context)
- For each question, provide:
  * The question in Chinese
  * 4 answer options in Chinese
  * The correct answer (A, B, C, or D)
  * A brief explanation in English of why the answer is correct

## Short Answer Questions (3 questions)
- Create 3 short answer questions that require 1-2 sentence responses
- Questions should encourage application of grammar and vocabulary from the unit
- For each question, provide:
  * The question in Chinese
  * A sample correct answer in Chinese
  * A brief note in English about what to look for in a good answer

## Open-Ended Reflection Question (1 question)
- Create 1 reflective question that connects the content to the learner's personal experience
- The question should promote using vocabulary and grammar from the unit
- Provide:
  * The question in Chinese
  * A brief guidance note in English (what this question aims to practice)

Format your response as follows:

# MULTIPLE CHOICE QUESTIONS
1. [Question in Chinese]
   A. [Option A in Chinese]
   B. [Option B in Chinese]
   C. [Option C in Chinese]
   D. [Option D in Chinese]
   Correct: [A/B/C/D]
   Explanation: [Brief explanation in English]

[Continue for all 6 multiple choice questions]

# SHORT ANSWER QUESTIONS
1. [Question in Chinese]
   Sample Answer: [Sample answer in Chinese]
   Assessment Guide: [Brief note in English]

[Continue for all 3 short answer questions]

# REFLECTION QUESTION
[Question in Chinese]
Guidance: [Brief guidance note in English]

Return ONLY the formatted questions without any additional text or explanations.
`;
}
