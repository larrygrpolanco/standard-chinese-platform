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
	// Debugging
    console.log('FULL USER PROFILE OBJECT:', JSON.stringify(userProfile, null, 2));

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
You are a Mandarin Chinese language education expert creating a personalized reading comprehension exercise.

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
Create a personalized reading comprehension exercise that meets these requirements:

1. Write a SHORT STORY (3-5 paragraphs) that:
   - Uses vocabulary and language patterns from this unit
   - Incorporates the user's personal context (occupation, location, hobbies)
   - ESPECIALLY focuses on themes from the CURRENT MODULE RESPONSES when available
   - Is appropriate for their ${learningLevel} level
   - Feels authentic and engaging

2. Create 5 COMPREHENSION QUESTIONS about the story:
   - 3 multiple-choice questions with 4 options each
   - 2 short-answer questions
   - Include explanations for the correct answers
   - Questions should test understanding, not just recall

3. Identify KEY VOCABULARY used in the story

The content should be personally meaningful by connecting to the user's:
- Professional context (${occupation})
- Location/environment (${location})
- Personal interests (${hobbies})
- Learning motivations (${reasonLearning})
- PRIORITIZE themes from their current module responses when creating the story context

Focus on creating high-quality, engaging content that balances:
- Authentic, natural Chinese
- Appropriate difficulty level
- Personal relevance
- Educational value

Return the complete exercise plan with all elements (title, description, story, questions, and vocabulary).
`;
}

/**
 * Generates a prompt to format a reading comprehension exercise plan into properly
 * structured JSON with both simplified and traditional characters.
 *
 * @param {string} plan - The exercise plan generated by planReadingComprehension
 * @param {Object} userProfile - User's learning profile (for context)
 * @param {string} specificFocus - Optional specific focus for the exercise
 *
 * @returns {string} A prompt for the LLM to format the plan into structured JSON
 */
export function formatReadingComprehension(plan, userProfile, specificFocus = '') {
	// Safely extract user profile data
	const learningLevel = userProfile?.learning_level || 'beginner';
	const personalContext = userProfile?.personal_context || {};
	const occupation = personalContext?.occupation || 'not specified';
	const location = personalContext?.location || 'not specified';

	return `
You are a JSON formatting specialist with expertise in Chinese language. Format this reading comprehension exercise plan into structured JSON that includes both simplified and traditional Chinese characters.

# EXERCISE PLAN TO FORMAT
${plan}

# USER CONTEXT (For reference only)
- Learning Level: ${learningLevel}
- Occupation: ${occupation}
- Location: ${location}
${specificFocus ? `- Specific Focus: ${specificFocus}` : ''}

# YOUR TASK

1. Format the exercise content into valid JSON following exactly this structure:
\`\`\`json
{
  "title": "Story title",
  "description": "Brief description of exercise and learning goals",
  "exercise_type": "reading_comprehension",
  "content": {
    "story": "Chinese text in simplified characters",
    "story_traditional": "Same story in traditional characters", 
    "story_pinyin": "Complete pinyin for the story",
    "story_english": "English translation of the story"
  },
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Question text in simplified Chinese",
      "question_traditional": "Question text in traditional Chinese",
      "question_pinyin": "Pinyin for the question",
      "question_english": "English translation of the question",
      "options": [
        {
          "id": "A", 
          "text": "Option A in simplified Chinese", 
          "text_traditional": "Option A in traditional Chinese", 
          "pinyin": "Pinyin for option A"
        },
        {
          "id": "B", 
          "text": "Option B in simplified Chinese", 
          "text_traditional": "Option B in traditional Chinese", 
          "pinyin": "Pinyin for option B"
        },
        {
          "id": "C", 
          "text": "Option C in simplified Chinese", 
          "text_traditional": "Option C in traditional Chinese", 
          "pinyin": "Pinyin for option C"
        },
        {
          "id": "D", 
          "text": "Option D in simplified Chinese", 
          "text_traditional": "Option D in traditional Chinese", 
          "pinyin": "Pinyin for option D"
        }
      ],
      "answer": "A",
      "explanation": "Explanation of why option A is correct"
    },
    // Two more multiple choice questions with the same structure
    {
      "id": 4,
      "type": "short_answer",
      "question": "Short answer question in simplified Chinese",
      "question_traditional": "Short answer question in traditional Chinese",
      "question_pinyin": "Pinyin for the question",
      "question_english": "English translation of the question",
      "sample_answer": "Example of a good answer for reference",
      "sample_answer_traditional": "Example in traditional Chinese",
      "sample_answer_pinyin": "Pinyin for sample answer"
    }
    // One more short answer question with the same structure
  ],
  "vocabulary_focus": [
    {
      "word": "Word in simplified Chinese",
      "word_traditional": "Word in traditional Chinese",
      "pinyin": "Pinyin for the word",
      "english": "English meaning"
    }
    // More vocabulary words with the same structure
  ]
}
\`\`\`

2. For traditional Chinese versions:
   - Accurately convert all simplified Chinese characters to traditional characters
   - Include traditional versions for ALL Chinese text (story, questions, options, vocabulary)
   - Ensure consistent conversion throughout the document

3. Format Requirements:
   - Return ONLY the JSON object, with no additional text, markdown, or code blocks
   - Ensure the JSON is valid and properly formatted
   - Use the exact field names and structure shown above
   - Include proper Unicode encoding for all Chinese characters

4. Content Guidelines:
   - Maintain the original meaning and educational value from the plan
   - Ensure all questions properly relate to the story
   - Include descriptive explanations for the correct answers
   - Select vocabulary that is actually used in the story
`;
}
