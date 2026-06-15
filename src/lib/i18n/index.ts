import type { DocumentType } from '$lib/server/legal/types';
import type { Locale } from './locales';
import { messages, type Messages } from './messages';

/** Typed accessor for the message dictionary of a given locale. */
export function t(locale: Locale): Messages {
	return messages[locale];
}

/** "3 resultados" / "1 resultado" — pluralized count label. */
export function resultsCount(locale: Locale, count: number): string {
	const m = messages[locale];
	const noun = count === 1 ? m.results_count_one : m.results_count_other;
	return `${count} ${noun}`;
}

/** Localized human label for a document type. */
export function documentTypeLabel(locale: Locale, type: DocumentType): string {
	const m = messages[locale];
	switch (type) {
		case 'constituicao':
			return m.type_constituicao;
		case 'lei':
			return m.type_lei;
		case 'decreto':
			return m.type_decreto;
		case 'codigo':
			return m.type_codigo;
	}
}

/** Format an ISO date for display in the active locale. */
export function formatDate(locale: Locale, iso: string): string {
	const date = new Date(`${iso}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return iso;
	return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	}).format(date);
}

export type { Messages };
