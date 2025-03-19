import { writable } from 'svelte/store';

// Simple store to hold the current answers during the session
export const quizAnswers = writable({
	selectedAnswers: {},
	shortAnswers: {},
	reflectionAnswer: ''
});
