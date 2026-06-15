import type { PageServerLoad } from './$types';
import { legalSource } from '$lib/server/legal';

export const load: PageServerLoad = async ({ url, locals }) => {
	const query = (url.searchParams.get('q') ?? '').trim();
	const hits = query ? await legalSource.search(query, { locale: locals.locale }) : [];
	return { query, hits };
};
