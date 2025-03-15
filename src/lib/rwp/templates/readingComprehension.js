// readingComprehension.js
export default function createTemplate(unitData, userProfile, specificFocus = '') {
	return `
You are creating a personalized Chinese reading comprehension exercise.

<unit_vocabulary>
${unitData.vocabulary.map((v) => `${v.chinese_simplified}: ${v.english}`).join('\n')}
</unit_vocabulary>

<unit_dialogues>
${unitData.dialogues.map((d) => `${d.chinese_simplified}: ${d.english}`).join('\n')}
</unit_dialogues>

<user_profile>
Level: ${userProfile.learning_level || 'beginner'}
Occupation: ${userProfile.personal_context?.occupation || 'not specified'}
Location: ${userProfile.personal_context?.location || 'not specified'}
</user_profile>

<module_specific_responses>
${Object.entries(userProfile.module_responses[unitData.module_id] || {})
	.map(([q, a]) => `${q}: ${a}`)
	.join('\n')}
</module_specific_responses>

${specificFocus ? `<specific_focus>${specificFocus}</specific_focus>` : ''}

Create a reading comprehension exercise with:
1. A short story (3-5 paragraphs) using vocabulary from this unit
2. The story should incorporate the user's context
3. Include 5 questions (3 multiple-choice, 2 short-answer)

Return in this JSON format:
\`\`\`json
{
  "title": "Story title",
  "description": "Brief description",
  "exercise_type": "reading_comprehension",
  "content": {
    "story": "Chinese text",
    "story_pinyin": "Pinyin",
    "story_english": "English translation"
  },
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Question text",
      "question_pinyin": "Pinyin",
      "question_english": "English",
      "options": [
        {"id": "A", "text": "Option A", "pinyin": "Pinyin A"},
        {"id": "B", "text": "Option B", "pinyin": "Pinyin B"},
        {"id": "C", "text": "Option C", "pinyin": "Pinyin C"},
        {"id": "D", "text": "Option D", "pinyin": "Pinyin D"}
      ],
      "answer": "A",
      "explanation": "Why A is correct"
    },
    {
      "id": 2,
      "type": "short_answer",
      "question": "Question text",
      "question_pinyin": "Pinyin",
      "question_english": "English",
      "answer": "Answer text",
      "answer_pinyin": "Pinyin",
      "answer_english": "English"
    }
  ],
  "vocabulary_focus": [
    {
      "word": "Word",
      "pinyin": "Pinyin",
      "english": "English"
    }
  ]
}
\`\`\``;
}
