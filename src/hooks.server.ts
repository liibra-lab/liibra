import type { Handle } from '@sveltejs/kit';
import { resolveLocale } from '$lib/i18n/locales';

// Resolve the UI locale once per request (cookie → Accept-Language → default)
// and keep it request-scoped on `event.locals` — never in module-global state,
// which would bleed between concurrent requests on Cloudflare Workers.
export const handle: Handle = async ({ event, resolve }) => {
	const locale = resolveLocale(
		event.cookies.get('locale'),
		event.request.headers.get('accept-language')
	);
	event.locals.locale = locale;

	return resolve(event, {
		// Rewrite the static `lang="en"` in app.html to the resolved locale.
		transformPageChunk: ({ html }) => html.replace('lang="en"', `lang="${locale}"`)
	});
};
