export const locales = ['pt', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt';

export function isLocale(value: unknown): value is Locale {
	return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Pick a locale from a cookie value, falling back to the `Accept-Language`
 * header, then the default. Used by the server hook on every request.
 */
export function resolveLocale(
	cookieValue: string | undefined,
	acceptLanguage: string | null
): Locale {
	if (isLocale(cookieValue)) return cookieValue;

	if (acceptLanguage) {
		for (const part of acceptLanguage.split(',')) {
			const tag = part.trim().split(';')[0].toLowerCase();
			if (tag.startsWith('pt')) return 'pt';
			if (tag.startsWith('en')) return 'en';
		}
	}

	return defaultLocale;
}
