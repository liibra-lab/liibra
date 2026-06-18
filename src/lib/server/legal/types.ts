// Domain types for Brazilian legal documents, modeled on LexML
// (https://www.lexml.gov.br). A document is uniquely identified by its LexML
// URN, e.g. `urn:lex:br:federal:lei:2002-01-10;10406` (Código Civil).

export type DocumentType = 'constituicao' | 'lei' | 'decreto' | 'codigo';

// Only federal jurisdiction is seeded today; widen as coverage grows.
export type Jurisdiction = 'br:federal';

/** Whether the stored `articles` are the complete text or partial excerpts. */
export type LegalCoverage = 'full' | 'partial';

export interface Article {
	/** Brazilian article numbering kept as a string: "1", "1.012", "5". */
	number: string;
	/** Optional rubric / heading for the article, e.g. "Da Personalidade". */
	label?: string;
	/**
	 * Full Portuguese text of the article. Incisos and parágrafos are kept in a
	 * single string, separated by newlines, so the reading view can render them
	 * with whitespace preserved.
	 */
	text: string;
}

/** A localized string: Portuguese is always present, English is an optional summary. */
export interface LocalizedTitle {
	pt: string;
	en?: string;
}

export interface LegalDocument {
	/** LexML URN — the canonical identifier. */
	urn: string;
	type: DocumentType;
	jurisdiction: Jurisdiction;
	/** Enactment date, ISO `YYYY-MM-DD`. */
	date: string;
	/** Official number as published, e.g. "10.406". */
	number: string;
	title: LocalizedTitle;
	/** Common short name, e.g. "Código Civil". */
	shortTitle?: LocalizedTitle;
	summary?: { pt?: string; en?: string };
	articles: Article[];
	/** Whether `articles` is the full document text or partial excerpts. */
	coverage: LegalCoverage;
	/** Provenance — always attributes the canonical LexML record. */
	source: {
		name: 'LexML';
		url: string;
	};
}
