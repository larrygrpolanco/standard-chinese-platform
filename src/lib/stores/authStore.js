// src/lib/stores/authStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase, getCurrentUser } from '$lib/supabase/client';

function createAuthStore() {
	const { subscribe, set } = writable(null);

	async function initialize() {
		if (!browser) return;

		// Set initial state
		const user = await getCurrentUser();
		set(user);

		// Listen for auth changes
		supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN') {
				set(session?.user || null);
			} else if (event === 'SIGNED_OUT') {
				set(null);
			}
		});
	}

	async function signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		return true;
	}

	return {
		subscribe,
		initialize,
		signOut 
	};
}

export const authStore = createAuthStore();
