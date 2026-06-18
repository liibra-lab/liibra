// A small, deliberately narrow CQL builder for the LexML SRU endpoint. It only
// emits a fixed set of indexes from whitelisted inputs — it is NOT a CQL parser
// and does not accept raw user-supplied CQL. Every user value is escaped and
// wrapped in a quoted string literal so it cannot break out of its term.
//
// NOTE: the index names below (tipoDocumento, localidade, autoridade, date)
// mirror the LexML portal's own facet parameters. They are our best available
// signal but have NOT been verified here against a live SRU `explain` response.
// If SRU returns diagnostics for an unknown index, surface the diagnostic as a
// warning rather than guessing a different name.

import type { LegalDocumentCategory, LegalSearchParams } from '$lib/legal/search-types';

/** Map a Liibra category to its LexML `tipoDocumento` label. */
export const CATEGORY_CQL: Record<LegalDocumentCategory, string> = {
	legislacao: 'Legislação',
	jurisprudencia: 'Jurisprudência',
	doutrina: 'Doutrina',
	proposicoes: 'Proposições Legislativas',
	outras_manifestacoes: 'Outras Manifestações',
	publicacao_oficial: 'Publicação Oficial',
	processo: 'Processo'
};

/** Escape a value for use inside a double-quoted CQL string literal. */
export function cqlEscape(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/** A year (YYYY) or ISO date (YYYY-MM or YYYY-MM-DD); anything else is rejected. */
function isDateBound(value: string): boolean {
	return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(value);
}

export interface BuiltQuery {
	/** The CQL string, or null when there is nothing safe to search. */
	cql: string | null;
	/** Non-fatal notices, e.g. an ignored malformed date bound. */
	warnings: string[];
}

/**
 * Build a CQL query from whitelisted search params. Returns `cql: null` when no
 * query term and no filters were supplied — the caller decides whether to treat
 * that as "require a query".
 */
export function buildCql(params: LegalSearchParams): BuiltQuery {
	const warnings: string[] = [];
	const terms: string[] = [];

	const q = params.q?.trim();
	if (q) {
		// `all` means every word must be present (AND), the standard CQL relation.
		terms.push(`cql.serverChoice all "${cqlEscape(q)}"`);
	}

	if (params.category) {
		terms.push(`tipoDocumento="${cqlEscape(CATEGORY_CQL[params.category])}"`);
	}

	if (params.locality?.trim()) {
		terms.push(`localidade="${cqlEscape(params.locality.trim())}"`);
	}

	if (params.authority?.trim()) {
		terms.push(`autoridade="${cqlEscape(params.authority.trim())}"`);
	}

	const from = params.dateFrom?.trim();
	if (from) {
		if (isDateBound(from)) terms.push(`date >= "${cqlEscape(from)}"`);
		else warnings.push('invalid_date_from');
	}

	const to = params.dateTo?.trim();
	if (to) {
		if (isDateBound(to)) terms.push(`date <= "${cqlEscape(to)}"`);
		else warnings.push('invalid_date_to');
	}

	return { cql: terms.length > 0 ? terms.join(' and ') : null, warnings };
}

/** SRU is 1-based: page 1 → startRecord 1, page 2 (size 20) → startRecord 21. */
export function toStartRecord(page: number, pageSize: number): number {
	const p = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
	const size = Number.isFinite(pageSize) && pageSize >= 1 ? Math.floor(pageSize) : 20;
	return (p - 1) * size + 1;
}
