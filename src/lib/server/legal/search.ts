// Pure search helpers: accent-insensitive normalization, tokenization, and
// ranking over a dataset. Kept free of any storage concern so they are trivial
// to unit-test and reusable by a future network-backed source.

import type { LegalDocument } from './types';
import type { MatchedArticle, SearchHit } from './source';

/**
 * Fold accents and case so "codigo" matches "Código". NFD splits a letter from
 * its combining diacritic, then the diacritic range is stripped.
 */
export function normalize(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase();
}

export function tokenize(query: string): string[] {
	return normalize(query)
		.split(/\s+/)
		.map((token) => token.trim())
		.filter((token) => token.length > 0);
}

const TITLE_WEIGHT = 3;
const ARTICLE_WEIGHT = 1;
const SNIPPET_RADIUS = 60;
const MAX_SNIPPETS = 3;

function buildSnippet(text: string, normalizedText: string, token: string): string {
	const at = normalizedText.indexOf(token);
	if (at === -1) return '';
	const start = Math.max(0, at - SNIPPET_RADIUS);
	const end = Math.min(text.length, at + token.length + SNIPPET_RADIUS);
	const prefix = start > 0 ? '…' : '';
	const suffix = end < text.length ? '…' : '';
	return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

/**
 * Score documents against a free-text query. Title matches outweigh body
 * matches. Returns hits sorted by descending score, capped at `limit`.
 */
export function searchDocuments(
	documents: LegalDocument[],
	query: string,
	limit = 20
): SearchHit[] {
	const tokens = tokenize(query);
	if (tokens.length === 0) return [];

	const hits: SearchHit[] = [];

	for (const document of documents) {
		const haystackTitle = normalize(
			[document.title.pt, document.title.en, document.shortTitle?.pt, document.shortTitle?.en]
				.filter(Boolean)
				.join(' ')
		);

		let score = 0;
		const matchedArticles: MatchedArticle[] = [];
		const seenArticles = new Set<string>();

		for (const token of tokens) {
			if (haystackTitle.includes(token)) score += TITLE_WEIGHT;

			for (const article of document.articles) {
				const normalizedArticle = normalize(article.text);
				if (normalizedArticle.includes(token)) {
					score += ARTICLE_WEIGHT;
					if (!seenArticles.has(article.number) && matchedArticles.length < MAX_SNIPPETS) {
						seenArticles.add(article.number);
						matchedArticles.push({
							number: article.number,
							snippet: buildSnippet(article.text, normalizedArticle, token)
						});
					}
				}
			}
		}

		if (score > 0) hits.push({ document, score, matchedArticles });
	}

	return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
