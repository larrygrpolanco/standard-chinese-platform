// src/routes/api/generate-rwp/+server.js
import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { prompt, debug = false } = await request.json();

		if (!prompt) {
			return json({ error: 'No prompt provided' }, { status: 400 });
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
						content: 'You create Chinese language exercises in JSON format.'
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
			return json({
				raw: content,
				parsed: tryParseJson(content)
			});
		}

		return json(content);
	} catch (error) {
		console.error('Error calling OpenAI:', error);
		return json({ error: 'Failed to generate content' }, { status: 500 });
	}
}

// Helper function to safely try parsing JSON
function tryParseJson(str) {
	try {
		return JSON.parse(str);
	} catch (e) {
		return { error: 'JSON parsing failed', message: e.message };
	}
}
