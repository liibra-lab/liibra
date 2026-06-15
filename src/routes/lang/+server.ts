import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { isLocale } from '$lib/i18n/locales';

const ONE_YEAR = 60 * 60 * 24 * 365;

// Sets the `locale` cookie from a posted form and returns the user to where they
// were. Cookie is written via the SvelteKit API so adapter-cloudflare emits the
// correct Set-Cookie header on Workers.
export const POST: RequestHandler = async ({ request, cookies }) => {
	const form = await request.formData();
	const locale = form.get('locale');
	const redirectTo = form.get('redirectTo');

	if (isLocale(locale)) {
		cookies.set('locale', locale, {
			path: '/',
			sameSite: 'lax',
			httpOnly: false,
			secure: !dev,
			maxAge: ONE_YEAR
		});
	}

	const target = typeof redirectTo === 'string' && redirectTo.startsWith('/') ? redirectTo : '/';
	redirect(303, target);
};
