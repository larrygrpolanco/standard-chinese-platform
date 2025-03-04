// src/lib/stores/fontPreferences.js
import { writable } from 'svelte/store';

export const fontPreferences = writable({
  script: 'simplified', // 'simplified' or 'traditional'
  showPinyin: true
});