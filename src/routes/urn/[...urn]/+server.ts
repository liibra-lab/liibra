import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { RequestHandler } from './$types';

// LexML-style compatibility entry point: `/urn/urn:lex:...` redirects to Liibra's
// own URN-addressed document route. We decode the rest-param exactly as the /doc
// route does, then re-encode through `resolve` so the path matches in-app links.
export const GET: RequestHandler = ({ params }) => {
	const urn = decodeURIComponent(params.urn);
	redirect(308, resolve('/doc/[...urn]', { urn }));
};
