// src/lib/rwp/templates/multipleChoice.js
export default function (unitData, userProfile, specificFocus = '') {
	return `
You are creating a personalized Chinese language multiple-choice quiz.

USER PROFILE:
${JSON.stringify(userProfile.personal_context || {}, null, 2)}

MODULE SPECIFIC CONTEXT:
${JSON.stringify(userProfile.module_responses[unitData.module_id] || {}, null, 2)}

UNIT VOCABULARY:
${unitData.vocabulary.map((v) => `${v.chinese_simplified}: ${v.english}`).join('\n')}

${specificFocus ? `SPECIFIC FOCUS: ${specificFocus}` : ''}

Create a multiple-choice quiz with 10 questions that:
1. Uses vocabulary from this unit
2. Relates to the user's personal context
3. Includes a mix of difficulty levels

Return in this JSON format only:
{
  "title": "Quiz title",
  "description": "Brief description",
  "questions": [
    {
      "id": 1,
      "question": "Chinese question text",
      "question_pinyin": "Pinyin for question",
      "question_english": "English translation",
      "options": [
        {"id": "A", "text": "Option A", "pinyin": "Pinyin A"},
        {"id": "B", "text": "Option B", "pinyin": "Pinyin B"},
        {"id": "C", "text": "Option C", "pinyin": "Pinyin C"},
        {"id": "D", "text": "Option D", "pinyin": "Pinyin D"}
      ],
      "answer": "A",
      "explanation": "Why A is correct"
    }
    // More questions
  ]
}
`;
}
