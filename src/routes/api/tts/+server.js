// src/routes/api/tts/+server.js
import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export async function POST({ request }) {
	try {
		// Get request data
		const { text, voice, language = 'zh', instructions = '' } = await request.json();

		if (!text) {
			return json({ error: 'Text is required' }, { status: 400 });
		}

		console.log(
			`Generating TTS: ${voice} voice, ${language} language, text length: ${text.length} chars`
		);

		// Generate audio with OpenAI API - UPDATED TO USE gpt-4o-mini-tts
		const response = await fetch('https://api.openai.com/v1/audio/speech', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini-tts',
				voice: voice,
				input: text,
				response_format: 'mp3',
				instructions: instructions // Added support for instructions
			})
		});

		if (!response.ok) {
			console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
			let errorMessage = 'Failed to generate speech';

			try {
				const errorData = await response.json();
				errorMessage = errorData.error?.message || errorMessage;
			} catch (e) {
				// If parsing fails, use the raw text
				const errorText = await response.text();
				errorMessage = errorText || errorMessage;
			}

			return json({ error: errorMessage }, { status: response.status });
		}

		// Get audio data as ArrayBuffer and convert to data URL
		const audioData = await response.arrayBuffer();
		const base64Audio = Buffer.from(audioData).toString('base64');
		const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;

		return json({ audioUrl: dataUrl });
	} catch (error) {
		console.error('TTS API error:', error);
		return json({ error: error.message || 'Failed to generate speech' }, { status: 500 });
	}
}
