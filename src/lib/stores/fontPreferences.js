// src/lib/stores/fontPreferences.js
import { writable } from 'svelte/store';

// Initialize from localStorage if available
function getInitialPreferences() {
	if (typeof localStorage !== 'undefined') {
		const savedPrefs = localStorage.getItem('fontPreferences');
		if (savedPrefs) {
			try {
				return JSON.parse(savedPrefs);
			} catch (e) {
				console.error('Failed to parse stored font preferences');
			}
		}
	}

	// Default preferences
	return {
		useTraditional: false, // Default to simplified
		showPinyin: false // Default to hiding pinyin
	};
}

// Create store with initial values
const preferences = writable(getInitialPreferences());

// Save to localStorage when store changes
if (typeof window !== 'undefined') {
	preferences.subscribe((prefs) => {
		localStorage.setItem('fontPreferences', JSON.stringify(prefs));
	});
}

// Export store with toggle methods
export const fontPreferences = {
	...preferences,
	toggleCharacterSet: () => {
		preferences.update((prefs) => ({
			...prefs,
			useTraditional: !prefs.useTraditional
		}));
	},
	togglePinyin: () => {
		preferences.update((prefs) => ({
			...prefs,
			showPinyin: !prefs.showPinyin
		}));
	}
};
