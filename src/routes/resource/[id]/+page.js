// src/routes/resource/[id]/+page.js
import { error } from '@sveltejs/kit';

// This prevents the page from failing if loading on the server
export const ssr = false;

export async function load({ params }) {
	// Validate the resource ID
	const validResourceIds = [
		'pronunciation-romanization',
		'numbers',
		'time-dates',
		'classroom-expressions'
	];

	if (!validResourceIds.includes(params.id)) {
		throw error(404, {
			message: 'Resource not found'
		});
	}

	return {
		resourceId: params.id
	};
}
