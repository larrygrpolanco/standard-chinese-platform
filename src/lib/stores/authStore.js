// src/lib/stores/authStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase, getCurrentUser } from '$lib/supabase/client';

function createAuthStore() {
	const { subscribe, set } = writable(null);
	let initializationPromise = null;

	async function initialize() {
		if (!browser) return null;

		// Only initialize once
		if (!initializationPromise) {
			initializationPromise = (async () => {
				try {
					// Set initial state
					const user = await getCurrentUser();
					set(user);

					// Set up auth listener
					supabase.auth.onAuthStateChange((event, session) => {
						if (event === 'SIGNED_IN') {
							set(session?.user || null);
						} else if (event === 'SIGNED_OUT') {
							set(null);
						}
					});

					return user;
				} catch (error) {
					console.error('Auth initialization error:', error);
					set(null);
					return null;
				}
			})();
		}

		return initializationPromise;
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
