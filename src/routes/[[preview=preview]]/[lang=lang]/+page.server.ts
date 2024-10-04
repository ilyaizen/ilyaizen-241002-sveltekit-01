import { asText } from '@prismicio/client';

import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, params }) {
	const client = createClient({
		cookies: cookies as unknown as Record<string, unknown>,
		fetch: fetch as typeof globalThis.fetch
	} as never);

	try {
		// Fetch the 'home' page with the specified language
		const page = await client.getByUID('page', 'home', {
			lang: params.lang
		});

		return {
			page,
			title: asText(page.data.title),
			meta_description: page.data.meta_description,
			meta_title: page.data.meta_title,
			meta_image: page.data.meta_image.url
		};
	} catch (error) {
		console.error('Error fetching home page:', error);
		return {
			status: 404,
			error: 'Home page not found'
		};
	}
}

export function entries() {
	return [{ lang: 'he' }]; // Only generate the Hebrew route
}
