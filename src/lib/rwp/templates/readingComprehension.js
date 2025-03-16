/**
 * @file readingComprehension.js
 *
 * This module provides functions to generate personalized reading comprehension
 * exercises for Chinese language learning. The process is split into two phases:
 * 1. Planning the content (pedagogy, story, questions)
 * 2. Formatting the content into structured JSON with both simplified and traditional characters
 */

/**
 * Generates a prompt for creating a personalized reading comprehension exercise plan
 * based on unit vocabulary, dialogues, and user profile.
 *
 * @param {Object} unitData - Data for the current unit
 * @param {Array} unitData.vocabulary - Array of vocabulary items for the unit
 * @param {Array} unitData.dialogues - Array of dialogues from the unit
 * @param {number|string} unitData.module_id - ID of the module this unit belongs to
 * @param {string} unitData.title - Title of the unit
 *
 * @param {Object} userProfile - User's learning profile and preferences
 * @param {string} userProfile.learning_level - User's Chinese proficiency level
 * @param {string} userProfile.learning_level - User's Chinese proficiency level
 * @param {Object} userProfile.personal_context - User's personal information
 * @param {Object} userProfile.module_responses - User's responses to module questions
 *
 * @param {string} specificFocus - Optional specific focus for the exercise
 *
 * @returns {string} A prompt for the LLM to generate a reading comprehension exercise
 */

export function planReadingComprehension(unitData, userProfile, specificFocus = '') {
	// Safely extract unit and module information
	const unitId = unitData?.id || 'unknown';
	const unitTitle = unitData?.title || 'unknown';
	const moduleId = unitData?.module?.id || unitData?.module_id || 'unknown';
	const moduleTitle = unitData?.module?.title || 'unknown';

	// Safely extract vocabulary items (from the array)
	const vocabulary = unitData?.vocabulary || [];
	const formattedVocabulary = vocabulary
		.map((v) => `- ${v.chinese_simplified || ''}: ${v.english || ''}`)
		.join('\n');

	// Safely extract dialogue items (from the array)
	const dialogues = unitData?.dialogues || [];
	const formattedDialogues = dialogues
		.map((d) => `- ${d.chinese_simplified || ''}: ${d.english || ''}`)
		.join('\n');

	// Safely extract user profile data
	const fullName = userProfile?.full_name || 'Student';
	const learningLevel = userProfile?.learning_level || 'beginner';
	const learningGoals = userProfile?.learning_goals || 'not specified';
	const personalContext = userProfile?.personal_context || {};
	const occupation = personalContext?.occupation || 'not specified';
	const location = personalContext?.location || 'not specified';
	const hobbies = personalContext?.hobbies || 'not specified';
	const reasonLearning = personalContext?.reason_learning || 'not specified';

	// Process ALL module responses (not just the current module)
	let currentModuleResponses = '';
	let otherModuleResponses = '';

	if (userProfile?.module_responses) {
		// Iterate through all module responses
		Object.entries(userProfile.module_responses).forEach(([modId, responses]) => {
			if (!responses) return;

			// Format the responses for this module
			const formattedResponses = Object.entries(responses)
				.map(([question, answer]) => `${question}: ${answer}`)
				.join('\n');

			// Separate current module responses from other modules
			if (modId === moduleId.toString()) {
				currentModuleResponses = formattedResponses;
			} else {
				// Include module ID with other responses for context
				otherModuleResponses += `\n## Module ${modId} Responses:\n${formattedResponses}\n`;
			}
		});
	}

	return `
You are a Mandarin Chinese language education expert creating a personalized reading comprehension exercise based on FSI course materials.

# UNIT INFORMATION
Unit ID: ${unitId}
Unit Title: ${unitTitle}
Module ID: ${moduleId}
Module Title: ${moduleTitle}

# VOCABULARY FROM THIS UNIT
${formattedVocabulary || 'No vocabulary available for this unit.'}

# DIALOGUES FROM THIS UNIT
${formattedDialogues || 'No dialogues available for this unit.'}

# USER PROFILE
- Name: ${fullName}
- Learning Level: ${learningLevel}
- Learning Goals: ${learningGoals}
- Occupation: ${occupation}
- Location: ${location}
- Hobbies: ${hobbies}
- Reason for Learning: ${reasonLearning}

${currentModuleResponses ? `# CURRENT MODULE RESPONSES (PRIORITIZE THESE)\n${currentModuleResponses}` : ''}

${otherModuleResponses ? `# OTHER MODULE RESPONSES (SECONDARY CONTEXT)\n${otherModuleResponses}` : ''}

${specificFocus ? `# SPECIFIC FOCUS FOR THIS EXERCISE\n${specificFocus}` : ''}

# TASK
Create a highly personalized reading comprehension exercise that connects the unit's language patterns with the user's context.

First, conduct a thorough analysis inside <analysis> tags:
1. Summarize the key grammatical structures and patterns from the dialogues in 2-3 sentences
2. List 5-7 key vocabulary words and 2-3 grammar points that should be featured in the exercise
3. Identify 2-3 main themes that could connect unit content to the user's personal context
4. Plan the progression of questions, noting 3-4 simple questions for beginning, 3-4 moderate for middle, and 3-4 complex for end
5. Brainstorm at least one specific question for each comprehension type (literal, inferential, applied)
6. Identify how you'll incorporate the user's occupation (${occupation}), location (${location}), and interests (${hobbies}) into the story

After completing your analysis, create the following:

1. STORY (3-5 paragraphs) that:
   - Uses vocabulary and grammar patterns from this unit naturally
   - Is deeply personalized to the user's context (work, location, interests)
   - Especially incorporates themes from CURRENT MODULE RESPONSES
   - Uses the appropriate language level (${learningLevel})
   - Feels authentic and engaging
   - Makes natural use of the unit vocabulary and dialogue patterns

2. 10 COMPREHENSION QUESTIONS:
   - Include a mix of question types:
     - Literal comprehension (key details and facts)
     - Inferential comprehension (reading between lines, drawing conclusions)
     - Applied comprehension (relating content to learner's own experiences)
   - Each question must have exactly 4 answer choices (A, B, C, D)
   - Scaffold questions from simple to complex to build confidence
   - Include at least one question about the main ideas/themes
   - Use vocabulary from the provided list in both questions and answer choices
   - Ensure all Chinese text is appropriate for the student's level

3. ANSWER KEY:
   - Provide the correct answer letter for each question
   - Include a brief explanation of why each answer is correct and why others are incorrect
   - Note any key vocabulary or grammar structures used in the question

4. KEY VOCABULARY LIST:
   - Highlight 8-12 important vocabulary items used in the story
   - Include both Chinese characters and English meanings

Format your response as follows:

<analysis>
[Your detailed analysis following the guidelines above]
</analysis>

# PERSONALIZED READING COMPREHENSION EXERCISE

## TITLE
[An engaging, descriptive title for the exercise]

## INTRODUCTION
[Brief introduction to the exercise in English, mentioning how it connects to the unit content and user's context]

## STORY
[Your 3-5 paragraph story in Chinese]

## COMPREHENSION QUESTIONS
1. [First question in Chinese]
   A. [Answer choice in Chinese]
   B. [Answer choice in Chinese]
   C. [Answer choice in Chinese]
   D. [Answer choice in Chinese]

[Continue for all 10 questions]

## ANSWER KEY
1. [Correct answer letter] - [Explanation]
2. [Correct answer letter] - [Explanation]
[Continue for all 10 questions]

## KEY VOCABULARY
- [Chinese term]: [English meaning]
[List 8-12 key vocabulary items used in the story]
`;
}

/**
 * Formats the reading comprehension plan into a structured JSON format
 * with all required translations.
 */
export function formatReadingComprehension(planOutput) {
	return `
You are a Chinese language expert responsible for transforming a reading comprehension exercise plan into a structured JSON format with complete translations and pinyin.

# ORIGINAL READING COMPREHENSION PLAN
${planOutput}

# TASK
Transform the above reading comprehension exercise into a structured JSON object following these requirements:

1. ALL Chinese text must have THREE representations:
   - Simplified Chinese (original)
   - Traditional Chinese (convert if not provided)
   - Pinyin (generate accurate pinyin with tone marks)
   - English translation (translate where missing)

2. Create a JSON object with the following structure:
{
  "meta": {
    "title": "", // Chinese title
    "title_traditional": "", // Traditional version of title
    "title_pinyin": "", // Pinyin of title
    "title_english": "", // English translation of title
    "introduction": "" // From the INTRODUCTION section (keep in English)
  },
  "story": {
    "text": "", // Full story text in simplified Chinese
    "text_traditional": "", // Traditional version of the story
    "text_pinyin": "", // Full pinyin for the story with proper tone marks
    "text_english": "" // Full English translation of the story
  },
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice", 
      "question": "", // Question in simplified Chinese
      "question_traditional": "", // Traditional version of question
      "question_pinyin": "", // Pinyin of question
      "question_english": "", // English translation of question
      "options": [ // VERY IMPORTANT: Each multiple_choice question MUST have these options
        {
          "id": "A", // A, B, C, D
          "text": "", // Option text in simplified Chinese
          "text_traditional": "", // Traditional version of option text
          "pinyin": "" // Pinyin of option text
        },
        {
          "id": "B",
          "text": "",
          "text_traditional": "",
          "pinyin": ""
        },
        {
          "id": "C",
          "text": "",
          "text_traditional": "",
          "pinyin": ""
        },
        {
          "id": "D",
          "text": "",
          "text_traditional": "",
          "pinyin": ""
        }
      ],
      "answer": "A", // Correct option ID for multiple_choice
      "explanation": "" // Explanation in English
    }
    // ...more questions
  ],
  "vocabulary": [
    {
      "word": "", // Word in simplified Chinese
      "word_traditional": "", // Traditional version of word
      "pinyin": "", // Pinyin of word with tone marks
      "english": "" // English meaning
    }
    // ...more vocabulary items
  ]
}

3. IMPORTANT ACCURACY REQUIREMENTS:
   - Extract the Chinese title from the TITLE section
   - Get the introduction text from the INTRODUCTION section
   - Convert the story from the STORY section
   - For each question in COMPREHENSION QUESTIONS, create a question object
   - EACH MULTIPLE CHOICE QUESTION MUST HAVE AN OPTIONS ARRAY with options A, B, C, D
   - Extract options A, B, C, D from the text for each question
   - Use the ANSWER KEY to set the correct answer and explanation for each question
   - Extract vocabulary items from the KEY VOCABULARY section
   - Make sure all Chinese has traditional, pinyin, and English translations

Return ONLY the JSON object without any surrounding text, code blocks, or explanations.
`;
}