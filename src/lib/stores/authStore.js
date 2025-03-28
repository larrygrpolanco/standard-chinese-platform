// src/lib/stores/authStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase, getCurrentUser, setupUserIfNeeded } from '$lib/supabase/client';

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

					// Set up new user if needed
					if (user) {
						await setupUserIfNeeded();
					}

					// Set up auth listener
					supabase.auth.onAuthStateChange(async (event, session) => {
						if (event === 'SIGNED_IN') {
							set(session?.user || null);

							// Handle user initialization for OAuth sign-ins
							if (session?.user) {
								await setupUserIfNeeded();
							}
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
