// Server-only client for the LexML SRU (Search/Retrieve via URL) endpoint. It is
// the only module that talks to LexML over the network. It builds a CQL request,
// fetches XML, and delegates parsing to the pure `parseSruResponse`. Failures are
// turned into user-safe warnings — the page never sees a raw exception.

import type { LegalSearchParams, LegalSearchResponse, SearchSort } from '$lib/legal/search-types';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '$lib/legal/search-types';
import { cachedFetch } from '$lib/server/edge-cache';
import { buildCql, toStartRecord } from './cql';
import { parseSruResponse } from './sru-parse';

/** Official LexML SRU endpoint. */
export const LEXML_SRU_ENDPOINT = 'https://www.lexml.gov.br/busca/SRU';

/** Hard cap so a crafted `pageSize` can't ask LexML for an unbounded page. */
const MAX_PAGE_SIZE = 50;

/** LexML index/search results are near-static; 1 hour in the edge cache. */
export const SEARCH_TTL_SECONDS = 3600;

/**
 * Milliseconds before an SRU request is aborted. An upstream that hangs (accepts
 * the connection but never responds) must degrade into the same
 * `source_unavailable` warning as one that errors — never a stalled render.
 */
export const UPSTREAM_TIMEOUT_MS = 8000;

export type FetchLike = typeof fetch;

function clampPage(page: number | undefined): number {
	if (!Number.isFinite(page) || (page as number) < 1) return DEFAULT_PAGE;
	return Math.floor(page as number);
}

function clampPageSize(pageSize: number | undefined): number {
	if (!Number.isFinite(pageSize) || (pageSize as number) < 1) return DEFAULT_PAGE_SIZE;
	return Math.min(Math.floor(pageSize as number), MAX_PAGE_SIZE);
}

/**
 * SRU ordering support is unverified, so we never ask the server to sort. Instead
 * we sort the records of the *current page* locally and flag it, so the UI can be
 * honest that this is not a corpus-wide ordering.
 */
function applyPageSort(response: LegalSearchResponse, sort: SearchSort): LegalSearchResponse {
	if (sort === 'relevance' || response.items.length === 0) return response;

	const items = [...response.items];
	if (sort === 'title') {
		items.sort((a, b) => a.title.localeCompare(b.title, 'pt'));
	} else {
		const dir = sort === 'date_asc' ? 1 : -1;
		items.sort((a, b) => {
			// Missing dates sort last regardless of direction.
			if (!a.date && !b.date) return 0;
			if (!a.date) return 1;
			if (!b.date) return -1;
			return a.date < b.date ? -dir : a.date > b.date ? dir : 0;
		});
	}

	return { ...response, items, warnings: [...(response.warnings ?? []), 'sort_page_only'] };
}

export class LexmlSruSource {
	// Assigned in the body (not a parameter property) so the module loads under
	// Node's strip-only TypeScript mode, which the test runner and the fixture
	// capture script use.
	private readonly endpoint: string;

	constructor(endpoint: string = LEXML_SRU_ENDPOINT) {
		this.endpoint = endpoint;
	}

	async search(params: LegalSearchParams, fetchImpl: FetchLike): Promise<LegalSearchResponse> {
		const page = clampPage(params.page);
		const pageSize = clampPageSize(params.pageSize);
		const sort: SearchSort = params.sort ?? 'relevance';

		const empty: LegalSearchResponse = {
			items: [],
			total: 0,
			page,
			pageSize,
			source: 'lexml-sru'
		};

		const { cql, warnings: cqlWarnings } = buildCql({ ...params, page, pageSize });
		if (!cql) {
			// Nothing safe to search yet: require a query (browse-all is out of scope).
			return { ...empty, warnings: [...cqlWarnings, 'require_query'] };
		}

		const url = new URL(this.endpoint);
		url.searchParams.set('operation', 'searchRetrieve');
		url.searchParams.set('version', '1.1');
		url.searchParams.set('query', cql);
		url.searchParams.set('maximumRecords', String(pageSize));
		url.searchParams.set('startRecord', String(toStartRecord(page, pageSize)));

		let response: Response;
		try {
			// Served from the Cloudflare edge cache when possible; the `cf` hint is a
			// second layer, ignored on runtimes that don't support it.
			response = await cachedFetch(
				url.toString(),
				{
					headers: { Accept: 'application/xml' },
					signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
					cf: { cacheTtl: SEARCH_TTL_SECONDS, cacheEverything: true }
				} as RequestInit,
				fetchImpl,
				SEARCH_TTL_SECONDS
			);
		} catch (cause) {
			console.error('LexML SRU network error:', cause);
			return { ...empty, warnings: [...cqlWarnings, 'source_unavailable'] };
		}

		if (!response.ok) {
			console.error(`LexML SRU returned HTTP ${response.status}`);
			return { ...empty, warnings: [...cqlWarnings, 'source_unavailable'] };
		}

		let xml: string;
		try {
			xml = await response.text();
		} catch (cause) {
			console.error('LexML SRU body read error:', cause);
			return { ...empty, warnings: [...cqlWarnings, 'source_unavailable'] };
		}

		const parsed = parseSruResponse(xml, { page, pageSize });
		const merged: LegalSearchResponse = {
			...parsed,
			warnings: [...cqlWarnings, ...(parsed.warnings ?? [])]
		};

		return applyPageSort(merged, sort);
	}
}

/** Shared singleton, mirroring the `legalSource` composition-root pattern. */
export const lexmlSruSource = new LexmlSruSource();
