// src/routes/api/generate-rwp/+server.js
import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

// In src/routes/api/generate-rwp/+server.js
export async function POST({ request }) {
	try {
		const { prompt, debug = false } = await request.json();

		if (!prompt) {
			return json({ error: 'No prompt provided' }, { status: 400 });
		}

		// Log the prompt in debug mode
		if (debug) {
			console.log('Server received prompt:', prompt);
		}

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini-2024-07-18', // or your preferred model
				messages: [
					{
						role: 'system',
						content:
							'You create Chinese language exercises in valid JSON format. Do not use markdown code blocks.'
					},
					{
						role: 'user',
						content: prompt
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

		if (debug) {
			const parsedResult = tryParseJson(content);
			return json({
				raw: content,
				parsed: parsedResult
			});
		}

		// For non-debug, try to parse and return the result directly
		const parsedContent = tryParseJson(content);

		if (parsedContent.error) {
			return json({ error: parsedContent.message }, { status: 400 });
		}

		return json(parsedContent);
	} catch (error) {
		console.error('Error calling OpenAI:', error);
		return json({ error: 'Failed to generate content' }, { status: 500 });
	}
}

// Helper function to safely try parsing JSON
function tryParseJson(str) {
	try {
		// Remove markdown code block formatting if present
		let jsonStr = str.trim();

		// Check if response is wrapped in markdown code blocks
		const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
		const match = jsonStr.match(codeBlockRegex);

		if (match && match[1]) {
			jsonStr = match[1].trim(); // Extract just the JSON part
		}

		return JSON.parse(jsonStr);
	} catch (e) {
		console.error('Raw string causing parsing error:', str);
		return {
			error: 'JSON parsing failed',
			message: e.message,
			raw: str.substring(0, 500) // Include part of the raw string for debugging
		};
	}
}
