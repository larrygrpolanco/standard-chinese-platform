// src/lib/stores/authStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { page } from '$app/stores';
import { supabase } from '$lib/supabase/client';

function createAuthStore() {
	const { subscribe, set } = writable(null);

	async function initialize() {
		if (!browser) return;

		// Try to get user from session first (for SSR support)
		const pageData = get(page);
		if (pageData.data?.session?.user) {
			set(pageData.data.session.user);
		} else {
			// Fall back to client method
			const user = await getCurrentUser();
			set(user);
		}

		// Continue listening for auth changes
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
