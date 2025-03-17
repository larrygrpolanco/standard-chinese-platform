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

export function planTemplate(unitData, userProfile, specificFocus = '') {
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
You are a Mandarin Chinese language education expert tasked with creating a personalized reading comprehension exercise based on FSI (Foreign Service Institute) course materials. Your goal is to make the language practice more relevant, engaging, and connected to the learner's real-life context.

First, review the following information:

1. Vocabulary and Dialogues:
<vocabulary>
${formattedVocabulary}
</vocabulary>

<dialogues>
${formattedDialogues}
</dialogues>

2. Module Responses:
<current_module_responses>
${currentModuleResponses}
</current_module_responses>

<other_module_responses>
${otherModuleResponses}
</other_module_responses>

3. Unit Information:
<unit_id>${unitId}</unit_id>
<unit_title>${unitTitle}</unit_title>
<module_id>${moduleId}</module_id>
<module_title>${moduleTitle}</module_title>

4. User Profile:
<full_name>${fullName}</full_name>
<learning_level>${learningLevel}</learning_level>
<learning_goals>${learningGoals}</learning_goals>
<occupation>${occupation}</occupation>
<location>${location}</location>
<hobbies>${hobbies}</hobbies>
<reason_learning>${reasonLearning}</reason_learning>

5. Specific Focus:
<specific_focus>${specificFocus}</specific_focus>

Now, conduct a thorough analysis of the provided information. Conduct this analysis inside <exercise_planning> tags:

1. Key grammatical structures and patterns from the dialogues (2-3 sentences)
2. 5-7 key vocabulary words and 2-3 grammar points to feature in the exercise
3. 2-3 main themes connecting unit content to the user's personal context
4. Progression plan for questions (3-4 simple, 3-4 moderate, 3-4 complex)
5. At least one specific question for each comprehension type (literal, inferential, applied)
6. How you'll incorporate the user's occupation, location, and interests into the story
7. Ideas for making the practice feel more "real" and personally connected to the learner
8. List of 5-7 vocabulary words and 2-3 grammar points explicitly connected to the user's context
9. Brainstorm 3-5 story ideas that incorporate the user's personal information, occupation, and interests
10. Plan for integrating themes from current module responses into the story and questions

Based on your analysis, create the following components for the reading comprehension exercise:

1. STORY (3-5 paragraphs):
   - Use vocabulary and grammar patterns from this unit naturally
   - Deeply personalize to the user's context (work, location, interests)
   - Incorporate themes from CURRENT MODULE RESPONSES
   - Use appropriate language level (${learningLevel})
   - Create an authentic and engaging narrative
   - Make natural use of the unit vocabulary and dialogue patterns

2. COMPREHENSION QUESTIONS (10 total):
   - Include a mix of question types:
     - Literal comprehension (key details and facts)
     - Inferential comprehension (reading between lines, drawing conclusions)
     - Applied comprehension (relating content to learner's own experiences)
   - Provide exactly 4 answer choices (A, B, C, D) for each question
   - Scaffold questions from simple to complex
   - Include at least one question about main ideas/themes
   - Use vocabulary from the provided list in questions and answer choices
   - Ensure all Chinese text is appropriate for the student's level

3. ANSWER KEY:
   - Provide the correct answer letter for each question
   - Include a brief explanation of why each answer is correct and why others are incorrect
   - Note key vocabulary or grammar structures used in the question

4. KEY VOCABULARY LIST:
   - Highlight 8-12 important vocabulary items used in the story
   - Include both Chinese characters and English meanings

Format your response as follows:

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

Remember to make the exercise feel authentic and personally relevant to the learner, connecting the language practice to real-life situations as much as possible.
`;
}

/**
 * Formats the reading comprehension plan into a structured JSON format
 * with all required translations.
 */
export function formatTemplate(planOutput) {
	return `
You are a Chinese language expert responsible for transforming a reading comprehension exercise plan into a structured JSON format with complete translations and pinyin.

# ORIGINAL READING COMPREHENSION PLAN
${planOutput}

# TASK
Transform the above reading comprehension exercise into a well-structured JSON object following these requirements:

1. ALL Chinese text must have these representations:
   - Simplified Chinese 
   - Traditional Chinese 
   - Pinyin (with tone marks)
   - English translation 

2. Create a JSON object with the following structure:
{
  "meta": {
    "title": "", // Chinese title in simplified characters
    "title_traditional": "", // Traditional version of title
    "title_pinyin": "", // Pinyin of title with tone marks
    "title_english": "", // English translation of title
    "introduction": "" // Brief introduction in English (from INTRODUCTION section)
  },
  "story": {
    "text": "", // Story in simplified Chinese with paragraph breaks as \\n\\n
    "text_traditional": "", // Traditional version with paragraph breaks
    "text_pinyin": "", // Pinyin with tone marks and paragraph breaks
    "text_english": "" // English translation with paragraph breaks
  },
  "questions": [
    // IMPORTANT: LIMIT TO 5-6 QUESTIONS MAXIMUM FOR BETTER QUALITY
    {
      "id": 1,
      "type": "multiple_choice", 
      "question": "", // Question in simplified Chinese
      "question_traditional": "", // Traditional version
      "question_pinyin": "", // Pinyin with tone marks
      "question_english": "", // English translation
      "options": [
        {
          "id": "A",
          "text": "", // Option in simplified Chinese
          "text_traditional": "", // Traditional version
          "pinyin": "" // Pinyin with tone marks
        },
        // Options B, C, D with same structure
      ],
      "answer": "", // Correct option ID (A, B, C, or D)
      "explanation": "" // Brief explanation in English
    }
    // More questions (5-6 total)
  ],
  "vocabulary": [
    {
      "word": "", // Word in simplified Chinese
      "word_traditional": "", // Traditional version
      "pinyin": "", // Pinyin with tone marks
      "english": "" // English meaning
    }
    // 8-12 vocabulary items from the unit
  ]
}

3. IMPORTANT REQUIREMENTS:
   - USE ONLY VOCABULARY FROM THE UNIT (avoid introducing new words)
   - MAINTAIN PARAGRAPH STRUCTURE with \\n\\n between paragraphs
   - LIMIT TO 5-6 QUESTIONS MAXIMUM (for better quality)
   - EACH MULTIPLE CHOICE QUESTION MUST HAVE EXACTLY 4 OPTIONS (A, B, C, D)
   - ENSURE all Chinese text has matching traditional, pinyin and English translations
   - USE APPROPRIATE DIFFICULTY LEVEL for the learner

Return ONLY the valid JSON object without surrounding text, code blocks, or explanations.
`;
}
