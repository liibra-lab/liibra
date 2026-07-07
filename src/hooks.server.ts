import type { Handle } from '@sveltejs/kit';
import { resolveLocale } from '$lib/i18n/locales';
import { AGENT_DISCOVERY_LINK } from '$lib/discovery/api-catalog';

// Resolve the UI locale once per request (cookie → Accept-Language → default)
// and keep it request-scoped on `event.locals` — never in module-global state,
// which would bleed between concurrent requests on Cloudflare Workers.
export const handle: Handle = async ({ event, resolve }) => {
	const locale = resolveLocale(
		event.cookies.get('locale'),
		event.request.headers.get('accept-language')
	);
	event.locals.locale = locale;

	const response = await resolve(event, {
		// Rewrite the static `lang="en"` in app.html to the resolved locale.
		transformPageChunk: ({ html }) => html.replace('lang="en"', `lang="${locale}"`)
	});

	// Baseline security headers (applied to all SvelteKit-handled responses).
	// TODO: Add a tested Content-Security-Policy after validating SvelteKit hydration and Cloudflare Web Analytics.
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()'
	);
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

	// RFC 8288 agent-discovery relations (docs/AGENT-DISCOVERY.md). Appended,
	// not set, so any Link header SvelteKit emits (e.g. preload) survives.
	response.headers.append('Link', AGENT_DISCOVERY_LINK);

	return response;
};
