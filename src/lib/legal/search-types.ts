// Metadata-search types, modeled on the LexML SRU/portal result shape. These are
// intentionally separate from the rich `LegalDocument` domain model in
// `types.ts`: a search hit is shallow metadata (no article bodies), so callers of
// the existing model are left untouched.

/** LexML document categories (the "Categoria do Documento" facet). */
export type LegalDocumentCategory =
	| 'legislacao'
	| 'jurisprudencia'
	| 'doutrina'
	| 'proposicoes'
	| 'outras_manifestacoes'
	| 'publicacao_oficial'
	| 'processo';

export type SearchSort = 'relevance' | 'title' | 'date_asc' | 'date_desc';

export interface LegalSearchParams {
	q?: string;
	page?: number;
	pageSize?: number;
	sort?: SearchSort;
	category?: LegalDocumentCategory;
	locality?: string;
	authority?: string;
	/** Year or ISO date, lower bound. */
	dateFrom?: string;
	/** Year or ISO date, upper bound. */
	dateTo?: string;
}

export interface LegalSearchResultItem {
	urn: string;
	title: string;
	summary?: string;
	date?: string;
	locality?: string;
	authority?: string;
	category?: LegalDocumentCategory;
	/** Canonical source URL (e.g. the LexML URN resolver page). */
	sourceUrl?: string;
}

export interface LegalFacetValue {
	value: string;
	label: string;
	count?: number;
	selected?: boolean;
}

export interface LegalFacetGroup {
	key: string;
	label: string;
	values: LegalFacetValue[];
}

export interface LegalSearchResponse {
	items: LegalSearchResultItem[];
	total: number;
	page: number;
	pageSize: number;
	facets?: LegalFacetGroup[];
	source: 'lexml-sru' | string;
	/** User-safe notices (e.g. "ordering applied to this page only"). */
	warnings?: string[];
}

export const SEARCH_SORTS: readonly SearchSort[] = [
	'relevance',
	'title',
	'date_asc',
	'date_desc'
];

export const DOCUMENT_CATEGORIES: readonly LegalDocumentCategory[] = [
	'legislacao',
	'jurisprudencia',
	'doutrina',
	'proposicoes',
	'outras_manifestacoes',
	'publicacao_oficial',
	'processo'
];

export function isSearchSort(value: unknown): value is SearchSort {
	return typeof value === 'string' && (SEARCH_SORTS as readonly string[]).includes(value);
}

export function isDocumentCategory(value: unknown): value is LegalDocumentCategory {
	return (
		typeof value === 'string' && (DOCUMENT_CATEGORIES as readonly string[]).includes(value)
	);
}

export const DEFAULT_PAGE = 1;
/** 20 per page mirrors LexML's own browse pagination. */
export const DEFAULT_PAGE_SIZE = 20;
