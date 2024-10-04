import { asText } from '@prismicio/client';

import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, params }) {
	const client = createClient({
		cookies: cookies as unknown as Record<string, unknown>,
		fetch: fetch as typeof globalThis.fetch
	} as never);

	try {
		const page = await client.getByUID('page', params.uid);
		return {
			page,
			title: asText(page.data.title),
			meta_description: page.data.meta_description,
			meta_title: page.data.meta_title,
			meta_image: page.data.meta_image.url
		};
	} catch (error) {
		console.error('Error fetching page:', error);
		return {
			status: 404,
			error: 'Page not found'
		};
	}
}

export async function entries() {
	const client = createClient();

	const pages = await client.getAllByType('page', { lang: '*' });

	return pages.map((page) => {
		return {
			lang: page.lang,
			uid: page.uid
		};
	});
}
