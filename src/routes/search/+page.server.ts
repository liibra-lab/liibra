import type { PageServerLoad } from './$types';
import { lexmlSruSource } from '$lib/server/legal';
import {
	isSearchSort,
	isDocumentCategory,
	DEFAULT_PAGE,
	type LegalSearchParams
} from '$lib/legal/search-types';

function parsePage(value: string | null): number {
	const n = Number.parseInt(value ?? '', 10);
	return Number.isFinite(n) && n >= 1 ? n : DEFAULT_PAGE;
}

function clean(value: string | null): string | undefined {
	const trimmed = (value ?? '').trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

export const load: PageServerLoad = async ({ url, fetch }) => {
	const sortParam = url.searchParams.get('sort');
	const categoryParam = url.searchParams.get('category');

	const params: LegalSearchParams = {
		q: clean(url.searchParams.get('q')),
		page: parsePage(url.searchParams.get('page')),
		sort: isSearchSort(sortParam) ? sortParam : 'relevance',
		category: isDocumentCategory(categoryParam) ? categoryParam : undefined,
		locality: clean(url.searchParams.get('locality')),
		authority: clean(url.searchParams.get('authority')),
		dateFrom: clean(url.searchParams.get('dateFrom')),
		dateTo: clean(url.searchParams.get('dateTo'))
	};

	// Server-side fetch through the SRU source; never throws to the page.
	const result = await lexmlSruSource.search(params, fetch);

	return { params, result };
};
