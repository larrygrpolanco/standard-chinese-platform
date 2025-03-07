// src/lib/stores/fontPreferences.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Get saved preferences from localStorage if available
const savedPrefs = browser ? JSON.parse(localStorage.getItem('fontPreferences')) : null;

// Initialize with defaults or saved preferences
export const fontPreferences = writable(
	savedPrefs || {
		script: 'simplified', // 'simplified' or 'traditional'
		showPinyin: true
	}
);

// Save preferences to localStorage when they change
if (browser) {
	fontPreferences.subscribe((value) => {
		localStorage.setItem('fontPreferences', JSON.stringify(value));
	});
}
