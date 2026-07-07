import type { RequestHandler } from './$types';
import { buildApiCatalog, LINKSET_MEDIA_TYPE } from '$lib/discovery/api-catalog';

// RFC 9727 API catalog. Built per-request from `url.origin` so the same
// handler is correct on production, preview, and local dev origins.
export const GET: RequestHandler = ({ url, setHeaders }) => {
	setHeaders({
		'content-type': LINKSET_MEDIA_TYPE,
		'cache-control': 'public, max-age=3600'
	});
	return new Response(JSON.stringify(buildApiCatalog(url.origin), null, '\t'));
};
