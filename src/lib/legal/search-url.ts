// Pure helper to serialize search params back into a /search query string. Kept
// free of `$app/paths` so it is unit-testable and reusable for pagination, sort,
// and filter links. Defaults (relevance sort, page 1, empty fields) are omitted
// to keep URLs clean and canonical.

import type { LegalSearchParams } from './search-types';

export function searchQueryString(
	params: LegalSearchParams,
	overrides: Partial<LegalSearchParams> = {}
): string {
	const merged = { ...params, ...overrides };
	const sp = new URLSearchParams();
	if (merged.q) sp.set('q', merged.q);
	if (merged.category) sp.set('category', merged.category);
	if (merged.locality) sp.set('locality', merged.locality);
	if (merged.authority) sp.set('authority', merged.authority);
	if (merged.dateFrom) sp.set('dateFrom', merged.dateFrom);
	if (merged.dateTo) sp.set('dateTo', merged.dateTo);
	if (merged.sort && merged.sort !== 'relevance') sp.set('sort', merged.sort);
	if (merged.page && merged.page > 1) sp.set('page', String(merged.page));
	return sp.toString();
}
