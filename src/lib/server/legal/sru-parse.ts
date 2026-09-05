// Pure SRU-XML → LegalSearchResponse parsing. No network here, so it is trivially
// unit-testable with fixtures. Parsing is intentionally defensive: LexML's record
// schema is not verified here, so unknown/missing fields are skipped rather than
// throwing, and SRU diagnostics are surfaced as warnings.

import { XMLParser } from 'fast-xml-parser';
import type {
	LegalDocumentCategory,
	LegalSearchResponse,
	LegalSearchResultItem
} from '$lib/legal/search-types';
import { CATEGORY_CQL } from './cql';

/** Public LexML URN resolver — used to build a canonical source link per hit. */
const LEXML_URN_BASE = 'https://www.lexml.gov.br/urn/';

/**
 * Entity-expansion budget for upstream XML. LexML's Dublin Core records have no
 * legitimate reason to declare custom DTD entities at all, so these sit far below
 * the library defaults (1000 entities, 10 KB each, unbounded total expansions).
 * Exceeding any of them throws, which `parseSruResponse` turns into the same
 * `malformed_response` warning as any other structural surprise.
 *
 * Entity processing stays *enabled*: turning it off would leave `&amp;` and
 * `&lt;` literal in document titles, silently corrupting legal text.
 */
const ENTITY_LIMITS = {
	enabled: true,
	maxEntityCount: 8,
	maxEntitySize: 1024,
	maxExpansionDepth: 4,
	maxTotalExpansions: 1000,
	maxExpandedLength: 65536
};

const parser = new XMLParser({
	ignoreAttributes: true,
	removeNSPrefix: true,
	trimValues: true,
	// Keep everything as strings: URNs, dates and counts must not be coerced.
	parseTagValue: false,
	processEntities: ENTITY_LIMITS
});

type Unknown = unknown;

function asArray<T>(value: T | T[] | undefined | null): T[] {
	if (value === undefined || value === null) return [];
	return Array.isArray(value) ? value : [value];
}

/** First usable string from a value that may be a string, array, or text node. */
function firstString(value: Unknown): string | undefined {
	if (value === undefined || value === null) return undefined;
	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}
	if (typeof value === 'number') return String(value);
	if (Array.isArray(value)) {
		for (const entry of value) {
			const found = firstString(entry);
			if (found) return found;
		}
		return undefined;
	}
	if (typeof value === 'object') {
		return firstString((value as Record<string, Unknown>)['#text']);
	}
	return undefined;
}

function isRecord(value: Unknown): value is Record<string, Unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The metadata payload inside a `<recordData>` — unwrap a `dc` container if present. */
function metadataOf(recordData: Unknown): Record<string, Unknown> {
	if (!isRecord(recordData)) return {};
	if (isRecord(recordData.dc)) return recordData.dc;
	return recordData;
}

function findUrn(meta: Record<string, Unknown>): string | undefined {
	const direct = firstString(meta.urn);
	if (direct?.toLowerCase().startsWith('urn:lex')) return direct;

	// Otherwise scan identifier(s) for a urn:lex value.
	for (const candidate of asArray(meta.identifier)) {
		const value = firstString(candidate);
		if (value?.toLowerCase().startsWith('urn:lex')) return value;
	}
	return undefined;
}

function findSourceUrl(meta: Record<string, Unknown>, urn: string): string | undefined {
	for (const candidate of asArray(meta.identifier)) {
		const value = firstString(candidate);
		if (value && /^https?:\/\//i.test(value)) return value;
	}
	return `${LEXML_URN_BASE}${urn}`;
}

const CATEGORY_BY_LABEL: Record<string, LegalDocumentCategory> = Object.fromEntries(
	Object.entries(CATEGORY_CQL).map(([key, label]) => [label, key as LegalDocumentCategory])
);

function findCategory(meta: Record<string, Unknown>): LegalDocumentCategory | undefined {
	const label = firstString(meta.tipoDocumento) ?? firstString(meta.type);
	return label ? CATEGORY_BY_LABEL[label] : undefined;
}

function toItem(record: Unknown): LegalSearchResultItem | null {
	if (!isRecord(record)) return null;
	const meta = metadataOf(record.recordData);
	const urn = findUrn(meta);
	if (!urn) return null; // Liibra is URN-addressed; a hit without one is unusable.

	return {
		urn,
		title: firstString(meta.title) ?? urn,
		summary: firstString(meta.description) ?? firstString(meta.ementa),
		date: firstString(meta.date),
		locality: firstString(meta.localidade) ?? firstString(meta.coverage),
		authority: firstString(meta.autoridade) ?? firstString(meta.publisher),
		category: findCategory(meta),
		sourceUrl: findSourceUrl(meta, urn)
	};
}

function collectDiagnostics(root: Record<string, Unknown>): string[] {
	const container = root.diagnostics;
	if (!isRecord(container)) return [];
	const out: string[] = [];
	for (const diag of asArray(container.diagnostic)) {
		const message =
			firstString(isRecord(diag) ? diag.message : undefined) ??
			firstString(isRecord(diag) ? diag.uri : undefined);
		if (message) out.push(`sru_diagnostic:${message}`);
	}
	return out;
}

export interface ParseContext {
	page: number;
	pageSize: number;
}

/**
 * Parse an SRU searchRetrieveResponse into a `LegalSearchResponse`. On structural
 * surprises it returns an empty result set plus a warning, never throws.
 */
export function parseSruResponse(xml: string, ctx: ParseContext): LegalSearchResponse {
	const base: LegalSearchResponse = {
		items: [],
		total: 0,
		page: ctx.page,
		pageSize: ctx.pageSize,
		source: 'lexml-sru'
	};

	let parsed: Unknown;
	try {
		parsed = parser.parse(xml);
	} catch {
		return { ...base, warnings: ['malformed_response'] };
	}

	const root = isRecord(parsed) ? parsed.searchRetrieveResponse : undefined;
	if (!isRecord(root)) {
		return { ...base, warnings: ['malformed_response'] };
	}

	const warnings = collectDiagnostics(root);

	const totalRaw = firstString(root.numberOfRecords);
	const total = totalRaw ? Number.parseInt(totalRaw, 10) : 0;

	const recordsContainer = isRecord(root.records) ? root.records.record : undefined;
	const items = asArray(recordsContainer)
		.map(toItem)
		.filter((item): item is LegalSearchResultItem => item !== null);

	return {
		...base,
		items,
		total: Number.isFinite(total) ? total : 0,
		...(warnings.length > 0 ? { warnings } : {})
	};
}
