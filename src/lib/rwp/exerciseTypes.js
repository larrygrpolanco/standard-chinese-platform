// src/lib/rwp/exerciseTypes.js
import ReadingExercise from '../components/rwp/ReadingExercise.svelte';
import {
	planTemplate as readingPlanTemplate,
	formatTemplate as readingFormatTemplate
} from './templates/readingComprehension.js';

export const exerciseTypes = {
	reading_comprehension: {
		component: ReadingExercise,
		description: 'Reading Comprehension',
		planTemplate: readingPlanTemplate,
		formatTemplate: readingFormatTemplate
	}
	// Add more as needed
};

// Helper functions remain the same
export function getExerciseTypeOptions() {
	return Object.entries(exerciseTypes).map(([id, data]) => ({
		value: id,
		label: data.description
	}));
}

export function getComponentForExerciseType(typeId) {
	return exerciseTypes[typeId]?.component || null;
}
