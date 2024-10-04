import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/svelte/kit';
import sm from '../../slicemachine.config.json';

/**
 * The project's Prismic repository name.
 */

export const repositoryName = import.meta.env.VITE_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 *
 * @type {prismic.ClientConfig["routes"]}
 */
// Update the routes array to handle both language-specific and default routes
const routes = [
	{ type: 'page', path: '/he/:uid' },
	{ type: 'page', path: '/:uid' }
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param {import('@prismicio/svelte/kit').CreateClientConfig} config - Configuration for the Prismic client.
 */

export const createClient = ({ cookies = undefined, ...config } = {}) => {
	const client = prismic.createClient(sm.apiEndpoint || repositoryName, {
		routes,
		...config
	});
	enableAutoPreviews({ client, cookies });
	return client;
};

// Add a helper function to get supported languages
export const getSupportedLanguages = () => {
	// Replace with your actual supported languages
	return ['he', 'en-us'];
};

// Add a helper function to check if a language is supported
export const isSupportedLanguage = (lang: string) => {
	return lang === 'he' || lang === undefined || lang === '';
};
