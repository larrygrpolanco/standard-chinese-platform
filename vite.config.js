import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		hmr: {
			overlay: {
				errors: true,
				warnings: false // This will hide the warnings
			}
		}
	}
});
