// Fetch-through cache backed by the Cloudflare edge cache. Upstream sources
// (LexML SRU, Câmara API) are slow and send no caching headers, so without
// this every page view pays a full upstream round trip. The `cf` fetch hint
// alone is not reliably applied through SvelteKit's fetch wrapper, hence the
// explicit Cache API layer.

/** Seconds an upstream response stays in the edge cache before being re-fetched. */
export const EDGE_CACHE_TTL_SECONDS = 300;

/**
 * The Workers runtime exposes the edge cache as `caches.default`; other
 * runtimes (Vite dev, Node tests) don't have it, and caching is skipped there.
 */
function edgeCache(): Cache | undefined {
	return (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default;
}

/**
 * Fetch `url` through the edge cache. Cached entries are stored with an
 * explicit TTL (overriding whatever the upstream sends); only `ok` responses
 * are cached. Cache failures never block or fail the request — the worst case
 * is an uncached fetch. Network errors from `fetchImpl` propagate unchanged.
 */
export async function cachedFetch(
	url: string,
	init: RequestInit,
	fetchImpl: typeof fetch,
	ttlSeconds: number = EDGE_CACHE_TTL_SECONDS
): Promise<Response> {
	const cache = edgeCache();

	if (cache) {
		try {
			const hit = await cache.match(url);
			if (hit) return hit;
		} catch {
			// A broken cache must never block the request; fall through to the network.
		}
	}

	const response = await fetchImpl(url, init);

	if (cache && response.ok) {
		const copy = new Response(response.clone().body, response);
		copy.headers.set('Cache-Control', `public, max-age=${ttlSeconds}`);
		try {
			await cache.put(url, copy);
		} catch {
			// e.g. a response the cache refuses to store
		}
	}

	return response;
}
