import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		alias: {
			'@/*': './src/lib/*'
		},
		adapter: adapter(),
		prerender: {
			handleEntryGeneratorMismatch: 'ignore',
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404 errors
				if (message.includes('404')) {
					return;
				}
				// Log other errors
				console.warn(`Warning: ${message}. Path: ${path}. Referrer: ${referrer}`);
			}
		}
	}
};

export default config;
