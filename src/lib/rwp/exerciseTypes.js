// src/lib/rwp/exerciseTypes.js
import readingComprehension from './templates/readingComprehension.js';
import ReadingExercise from '../components/rwp/ReadingExercise.svelte';

// Each exercise type defines:
// - template: Function that generates the prompt
// - component: Svelte component that renders this exercise type
// - description: Human-readable description
export const exerciseTypes = {
	reading_comprehension: {
		template: readingComprehension,
		component: ReadingExercise,
		description: 'Reading Comprehension',
		supportedQuestionTypes: ['multiple_choice', 'short_answer']
	}
	// Add more exercise types as you create them
};

// Helper function to get all available exercise types as options
export function getExerciseTypeOptions() {
	return Object.entries(exerciseTypes).map(([id, data]) => ({
		value: id,
		label: data.description
	}));
}
