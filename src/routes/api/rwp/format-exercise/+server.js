import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { story, questions, unitData, debug = false } = await request.json();

		if (!story || !questions) {
			return json({ error: 'Story and questions must be provided' }, { status: 400 });
		}

		if (debug) {
			console.log('Formatter received:', {
				story: story.substring(0, 100) + '...',
				questions: questions.substring(0, 100) + '...'
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
							'You are a Chinese language education expert specializing in preparing well-structured educational materials. Your task is to format content into a precise JSON structure with all required translations and annotations.'
					},
					{
						role: 'user',
						content: createFormatPrompt(story, questions, unitData)
					}
				],
				temperature: 0.3 // Lower temperature for more precise formatting
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

		// Try to parse JSON from the response
		try {
			// Remove markdown code block formatting if present
			let jsonStr = content.trim();
			const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
			const match = jsonStr.match(codeBlockRegex);

			if (match && match[1]) {
				jsonStr = match[1].trim();
			}

			// If it still doesn't look like JSON, look for the first { and last }
			if (!jsonStr.startsWith('{')) {
				const firstBrace = jsonStr.indexOf('{');
				const lastBrace = jsonStr.lastIndexOf('}');
				if (firstBrace !== -1 && lastBrace !== -1) {
					jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
				}
			}

			const parsedContent = JSON.parse(jsonStr);

			if (debug) {
				return json({
					raw: content,
					parsed: parsedContent
				});
			}

			return json(parsedContent);
		} catch (e) {
			console.error('JSON parsing error:', e, 'Content:', content);
			return json(
				{
					error: 'Failed to parse formatted content',
					raw: content.substring(0, 500) // Include part of the raw content for debugging
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Error formatting exercise:', error);
		return json({ error: 'Failed to format exercise' }, { status: 500 });
	}
}

function createFormatPrompt(story, questions, unitData) {
	// Extract unit information for metadata
	const unitTitle = unitData?.title || 'Chinese Practice';
	const moduleTitle = unitData?.module?.title || '';

	return `
Transform the following Chinese story and questions into a well-structured JSON object with full translations and annotations.

# STORY
${story}

# QUESTIONS
${questions}

# INSTRUCTIONS
Create a JSON object with the following structure that includes simplified Chinese, traditional Chinese, pinyin with tone marks, and English translations for all content.

The JSON must follow this exact structure:

\`\`\`json
{
  "meta": {
    "title": "", // Title in simplified Chinese
    "title_traditional": "", // Title in traditional Chinese
    "title_pinyin": "", // Pinyin with tone marks
    "title_english": "", // English translation of title
    "introduction": "", // Brief English introduction
    "unit": "${unitTitle}",
    "module": "${moduleTitle}"
  },
  "story": {
    "text": "", // Story in simplified Chinese (paragraphs separated by \\n\\n)
    "text_traditional": "", // Story in traditional Chinese
    "text_pinyin": "", // Pinyin with tone marks
    "text_english": "" // English translation
  },
  "questions": {
    "multiple_choice": [
      {
        "id": 1,
        "question": "", // Question in simplified Chinese
        "question_traditional": "", // Question in traditional Chinese
        "question_pinyin": "", // Pinyin with tone marks
        "question_english": "", // English translation
        "options": [
          {
            "id": "A",
            "text": "", // Option in simplified Chinese
            "text_traditional": "", // Option in traditional Chinese
            "pinyin": "", // Pinyin with tone marks
            "english": "" // English translation
          },
          // Options B, C, D with same structure
        ],
        "answer": "", // Correct option ID (A, B, C, or D)
        "explanation": "" // Brief explanation in English
      }
      // Other multiple choice questions
    ],
    "short_answer": [
      {
        "id": 1,
        "question": "", // Question in simplified Chinese
        "question_traditional": "", // Question in traditional Chinese
        "question_pinyin": "", // Pinyin with tone marks
        "question_english": "", // English translation
        "sample_answer": "", // Sample answer in simplified Chinese
        "sample_answer_traditional": "", // Sample answer in traditional Chinese
        "sample_answer_pinyin": "", // Pinyin with tone marks
        "sample_answer_english": "", // English translation
        "assessment_guide": "" // Brief note in English
      }
      // Other short answer questions
    ],
    "reflection": {
      "question": "", // Question in simplified Chinese
      "question_traditional": "", // Question in traditional Chinese
      "question_pinyin": "", // Pinyin with tone marks
      "question_english": "", // English translation
      "guidance": "" // Brief guidance note in English
    }
  },
  "vocabulary": [
    {
      "word": "", // Word in simplified Chinese
      "word_traditional": "", // Word in traditional Chinese
      "pinyin": "", // Pinyin with tone marks
      "english": "" // English meaning
    }
    // 8-12 vocabulary items
  ]
}
\`\`\`

Return ONLY the valid JSON object without any surrounding text or explanations. Ensure the JSON is properly formatted and can be parsed.
`;
}
