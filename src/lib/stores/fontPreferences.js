// lib/stores/fontPreferences.js
import { writable } from 'svelte/store';

// Initialize from localStorage if available
const storedPrefs =
	typeof localStorage !== 'undefined'
		? JSON.parse(localStorage.getItem('fontPreferences') || '{}')
		: {};

// Create store with defaults, overridden by stored values
const defaultPreferences = {
	displayMode: storedPrefs.displayMode || 'simplified', // 'simplified', 'traditional', or 'pinyin'
	showPinyin: storedPrefs.showPinyin !== undefined ? storedPrefs.showPinyin : true,
    showEnglish: storedPrefs.showEnglish !== undefined ? storedPrefs.showEnglish : true 
};

// Create the store
