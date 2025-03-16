// src/lib/rwp/exerciseTypes.js
import { planReadingComprehension, formatReadingComprehension } from './templates/readingComprehension.js';
import ReadingExercise from '../components/rwp/ReadingExercise.svelte';

// Each exercise type defines planning and formatting templates
// - template: Function that generates the prompt
// - component: Svelte component that renders this exercise type
// - description: Human-readable description
export const exerciseTypes = {
  reading_comprehension: {
    plannerTemplate: planReadingComprehension,  // Plans content
    formatterTemplate: formatReadingComprehension, // Creates JSON
    component: ReadingExercise,
    description: 'Reading Comprehension',
    supportedQuestionTypes: ['multiple_choice', 'short_answer']
  }
  // Add more exercise types as you create them
};

// Helper function remains the same
export function getExerciseTypeOptions() {
  return Object.entries(exerciseTypes).map(([id, data]) => ({
    value: id,
    label: data.description
  }));
}