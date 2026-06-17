// The only module that knows how to talk to the Câmara API. It builds request
// URLs, asks for JSON, parses the `{ dados, links }` envelope, and turns failures
// into a typed error the routes can render gracefully.

export const API_BASE = 'https://dadosabertos.camara.leg.br/api/v2';

/** Fetch implementation injected by the caller (use the load event's `fetch`). */
export type FetchLike = typeof fetch;

export class CamaraApiError extends Error {
	constructor(
		message: string,
		readonly status?: number
	) {
		super(message);
		this.name = 'CamaraApiError';
	}
}

/** Standard envelope returned by every Câmara collection/resource endpoint. */
interface Envelope<T> {
	dados: T;
	links?: { rel: string; href: string }[];
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
 * Fetch a Câmara endpoint and return its `dados` payload.
 *
 * Light edge caching is requested via Cloudflare's `cf` fetch option; on
 * runtimes that don't understand it (e.g. Vite dev) the option is simply
 * ignored and a normal request is made.
 */
export async function camaraFetch<T>(
	path: string,
	params: Record<string, QueryValue> | undefined,
	fetchImpl: FetchLike
): Promise<T> {
	const url = buildUrl(path, params);

	let response: Response;
	try {
		response = await fetchImpl(url, {
			headers: { Accept: 'application/json' },
			// `cf` is a Cloudflare Workers extension to RequestInit; ignored elsewhere.
			cf: { cacheTtl: 300, cacheEverything: true }
		});
	} catch (cause) {
		throw new CamaraApiError(`Network error contacting Câmara API: ${String(cause)}`);
	}

	if (response.status === 404) {
		throw new CamaraApiError('Resource not found', 404);
	}
	if (!response.ok) {
		throw new CamaraApiError(`Câmara API returned ${response.status}`, response.status);
	}

	const body = (await response.json()) as Envelope<T>;
	return body.dados;
}
