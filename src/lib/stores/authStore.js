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
			// console.log('Starting auth store initialization');
			initializationPromise = (async () => {
				try {
					// Use Promise.race with a timeout for user fetch
					const userPromise = getCurrentUser();
					const timeoutPromise = new Promise((_, reject) =>
						setTimeout(() => reject(new Error('Auth initialization timeout')), 10000)
					);

					const user = await Promise.race([userPromise, timeoutPromise]);
					set(user);
					// console.log('Auth store: User state set initially', !!user);

					// Set up auth listener with error handling
					// before running the potentially slow setupUserIfNeeded
					if (!authStateChangeSetup) {
						try {
							// Set up auth listener with error handling
							const {
								data: { subscription }
							} = supabase.auth.onAuthStateChange((event, session) => {
								// console.log('Auth state change:', event);
								if (event === 'SIGNED_IN') {
									set(session?.user || null);

									// Handle user initialization without awaiting
									// This prevents blocking if setupUserIfNeeded is slow
									if (session?.user) {
										setupUserIfNeeded().catch((err) =>
											console.error('User setup error (non-blocking):', err)
										);
									}
								} else if (event === 'SIGNED_OUT') {
									set(null);
								}
							});

							authStateChangeSetup = true;
						} catch (listenerError) {
							console.error('Error setting up auth listener:', listenerError);
							// Continue even if listener setup fails
						}
					}

					// Set initialized before the potentially slow setupUserIfNeeded
					initialized = true;

					// Handle user setup separately after initialization
					if (user) {
						try {
							// Set a timeout for setupUserIfNeeded
							const setupPromise = setupUserIfNeeded();
							const setupTimeoutPromise = new Promise((_, reject) =>
								setTimeout(() => reject(new Error('User setup timeout')), 10000)
							);

							await Promise.race([setupPromise, setupTimeoutPromise]);
						} catch (setupError) {
							console.error('User setup error:', setupError);
							// Continue even if setup fails - user is already authenticated
						}
					}

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
		try {
			// Add timeout to signOut
			const signOutPromise = supabase.auth.signOut();
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Sign out timeout')), 5000)
			);

			const { error } = await Promise.race([signOutPromise, timeoutPromise]);
			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Sign out error:', error);
			// Force set to null even if signOut fails
			set(null);
			throw error;
		}
	}

	return {
		subscribe,
		initialize,
		signOut
	};
}

export const authStore = createAuthStore();
