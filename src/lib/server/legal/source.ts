// The data-access seam. Routes depend on `LegalSource`, never on a concrete
// implementation, so the in-memory seed can later be swapped for a live LexML
// SRU client (a network source) without touching the UI. All methods are async
// for exactly that reason.

import type { LegalDocument } from './types';
import type { Locale } from '$lib/i18n/locales';

export interface SearchOptions {
	/** Maximum number of hits to return. */
	limit?: number;
	/** Active UI locale — reserved for future locale-aware ranking. */
	locale?: Locale;
}

export interface MatchedArticle {
	number: string;
	/** A short text window around the first match, for result previews. */
	snippet: string;
}

export interface SearchHit {
	document: LegalDocument;
	score: number;
	matchedArticles: MatchedArticle[];
}

export interface LegalSource {
	search(query: string, opts?: SearchOptions): Promise<SearchHit[]>;
	getByUrn(urn: string): Promise<LegalDocument | null>;
	/** All documents, for the curated browse list on the home page. */
	list(): Promise<LegalDocument[]>;
}
