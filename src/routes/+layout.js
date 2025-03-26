import { createBrowserClient } from '@supabase/ssr';
import { browser } from '$app/environment';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function load({ fetch, data, depends }) {
	depends('supabase:auth');

	const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
		global: { fetch },
		cookies: {
			get: (key) => {
				if (browser) {
					const cookieString = document.cookie.split('; ').find((row) => row.startsWith(`${key}=`));
					return cookieString ? cookieString.split('=')[1] : null;
				}
				return null;
			},
			set: (key, value, options) => {
				if (browser) {
					document.cookie = `${key}=${value}; path=/; max-age=${options?.maxAge || 3600}`;
				}
			},
			remove: (key, options) => {
				if (browser) {
					document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
				}
			}
		}
	});

	return {
		supabase,
		session: data.session
	};
}
