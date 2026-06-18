import type { DocumentType } from '$lib/server/legal/types';
import type { LegalDocumentCategory } from '$lib/legal/search-types';
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

/** Localized human label for a LexML document category. */
export function documentCategoryLabel(locale: Locale, category: LegalDocumentCategory): string {
	const m = messages[locale];
	switch (category) {
		case 'legislacao':
			return m.cat_legislacao;
		case 'jurisprudencia':
			return m.cat_jurisprudencia;
		case 'doutrina':
			return m.cat_doutrina;
		case 'proposicoes':
			return m.cat_proposicoes;
		case 'outras_manifestacoes':
			return m.cat_outras_manifestacoes;
		case 'publicacao_oficial':
			return m.cat_publicacao_oficial;
		case 'processo':
			return m.cat_processo;
	}
}

/**
 * Map a source warning code to a user-safe message. Unknown codes (including
 * `sru_diagnostic:*`) collapse to a generic notice so raw server text is never
 * shown. Returns null for codes the UI handles elsewhere (e.g. `require_query`).
 */
export function searchWarningLabel(locale: Locale, code: string): string | null {
	const m = messages[locale];
	if (code === 'require_query') return null;
	if (code === 'source_unavailable') return m.warning_source_unavailable;
	if (code === 'malformed_response') return m.warning_malformed;
	if (code === 'sort_page_only') return m.warning_sort_page_only;
	if (code === 'invalid_date_from' || code === 'invalid_date_to') return m.warning_invalid_date;
	if (code.startsWith('sru_diagnostic:')) return m.warning_sru_diagnostic;
	return null;
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

/**
 * Format a date or date-time string from the Câmara API (e.g. "2024-03-01" or
 * "2024-03-01T14:00") for display in the active locale. Returns the raw input
 * if it cannot be parsed, so we never show a fabricated value.
 */
export function formatDateTime(locale: Locale, value: string | null | undefined): string {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	const hasTime = value.includes('T');
	return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		...(hasTime ? { hour: '2-digit', minute: '2-digit' } : {})
	}).format(date);
}

export type { Messages };
