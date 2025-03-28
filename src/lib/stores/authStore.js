// src/lib/stores/authStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase, getCurrentUser, setupUserIfNeeded } from '$lib/supabase/client';

function createAuthStore() {
	const { subscribe, set } = writable(null);
	let initializationPromise = null;
	let initialized = false;
	let authStateChangeSetup = false;

	async function initialize() {
		if (!browser) return null;

		// If already initialized, just return the promise
		if (initialized) {
			return initializationPromise;
		}

		// Only initialize once
		if (!initializationPromise) {
			console.log("Starting auth store initialization");
			initializationPromise = (async () => {
				try {
					// Set initial state
					const user = await getCurrentUser();
					set(user);
					console.log("Auth store: User state set initially", !!user);

					// Set up new user if needed
					if (user) {
						await setupUserIfNeeded();
					}

					// Only set up the auth listener once
					if (!authStateChangeSetup) {
						// Set up auth listener
						const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
							console.log("Auth state change:", event);
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
						
						authStateChangeSetup = true;
					}

					initialized = true;
					return user;
				} catch (error) {
					console.error('Auth initialization error:', error);
					set(null);
					// Reset the promise and initialized state on error to allow retry
					initializationPromise = null;
					initialized = false;
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
