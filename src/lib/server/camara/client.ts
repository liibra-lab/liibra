// The only module that knows how to talk to the Câmara API. It builds request
// URLs, asks for JSON, parses the `{ dados, links }` envelope, and turns failures
// into a typed error the routes can render gracefully.

export const API_BASE = 'https://dadosabertos.camara.leg.br/api/v2';

/** Seconds a Câmara response stays in the edge cache before being re-fetched. */
export const CACHE_TTL_SECONDS = 300;

/** Fetch implementation injected by the caller (use the load event's `fetch`). */
export type FetchLike = typeof fetch;

export class CamaraApiError extends Error {
	// Assigned in the body (not a parameter property) so the module loads under
	// Node's strip-only TypeScript mode, which the test runner uses.
	readonly status?: number;

	constructor(message: string, status?: number) {
		super(message);
		this.name = 'CamaraApiError';
		this.status = status;
	}
}

/** HATEOAS pagination link (`self`, `first`, `next`, `last`) on the envelope. */
export interface CamaraLink {
	rel: string;
	href: string;
}

/** Standard envelope returned by every Câmara collection/resource endpoint. */
export interface CamaraEnvelope<T> {
	dados: T;
	links: CamaraLink[];
}

interface RawEnvelope<T> {
	dados: T;
	links?: CamaraLink[];
}

export type QueryValue = string | number | undefined | null;

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
	const url = new URL(`${API_BASE}${path}`);
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value === undefined || value === null || value === '') continue;
			url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

/**
 * The Workers runtime exposes the edge cache as `caches.default`; other
 * runtimes (Vite dev, Node tests) don't have it, and caching is skipped there.
 */
function edgeCache(): Cache | undefined {
	return (globalThis.caches as CacheStorage & { default?: Cache } | undefined)?.default;
}

/**
 * Fetch a Câmara endpoint and return its full `{ dados, links }` envelope.
 *
 * Responses are cached in the Cloudflare edge cache for `CACHE_TTL_SECONDS`.
 * The upstream API is slow (often over a second) and sends no caching headers,
 * so without this every page view pays the full round trip. A `cf` fetch hint
 * is kept as a second layer; runtimes that don't understand either simply make
 * a normal request.
 */
export async function camaraFetchEnvelope<T>(
	path: string,
	params: Record<string, QueryValue> | undefined,
	fetchImpl: FetchLike
): Promise<CamaraEnvelope<T>> {
	const url = buildUrl(path, params);
	const cache = edgeCache();

	let response: Response | undefined;
	if (cache) {
		try {
			response = await cache.match(url);
		} catch {
			// A broken cache must never block the request; fall through to the network.
		}
	}

	if (!response) {
		try {
			response = await fetchImpl(url, {
				headers: { Accept: 'application/json' },
				// `cf` is a Cloudflare Workers extension to RequestInit; ignored elsewhere.
				cf: { cacheTtl: CACHE_TTL_SECONDS, cacheEverything: true }
			});
		} catch (cause) {
			throw new CamaraApiError(`Network error contacting Câmara API: ${String(cause)}`);
		}

		if (cache && response.ok) {
			// Store a copy with an explicit TTL, since the API sends no caching
			// headers. A failed put only costs the cache entry, never the response.
			const copy = new Response(response.clone().body, response);
			copy.headers.set('Cache-Control', `public, max-age=${CACHE_TTL_SECONDS}`);
			try {
				await cache.put(url, copy);
			} catch {
				// e.g. a response the cache refuses to store
			}
		}
	}

	if (response.status === 404) {
		throw new CamaraApiError('Resource not found', 404);
	}
	if (!response.ok) {
		throw new CamaraApiError(`Câmara API returned ${response.status}`, response.status);
	}

	const body = (await response.json()) as RawEnvelope<T>;
	return { dados: body.dados, links: body.links ?? [] };
}

/** Fetch a Câmara endpoint and return only its `dados` payload. */
export async function camaraFetch<T>(
	path: string,
	params: Record<string, QueryValue> | undefined,
	fetchImpl: FetchLike
): Promise<T> {
	return (await camaraFetchEnvelope<T>(path, params, fetchImpl)).dados;
}
