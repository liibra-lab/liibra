// Captures live LexML SRU responses as committed test fixtures.
//
//   npm run gen:sru-fixtures
//
// ROADMAP Phase 1: verify the SRU contract (explain output, index names) and
// feed the parse test suite with real responses. Run it from a network that
// can reach lexml.gov.br — Claude Code web sandboxes block that host.
//
// Every capture is validated with the app's real query builder and parser
// before it is written: a response that yields zero items, SRU diagnostics,
// or unparseable XML fails the run loudly instead of becoming a trusted
// fixture. Commit tests/fixtures/sru/ afterwards — tests/sru-fixtures.test.ts
// activates automatically once the fixtures exist.

import { mkdir, writeFile } from 'node:fs/promises';
import { LEXML_SRU_ENDPOINT } from '../src/lib/server/legal/lexml-sru-source.ts';
import { buildCql } from '../src/lib/server/legal/cql.ts';
import { parseSruResponse } from '../src/lib/server/legal/sru-parse.ts';

const OUT_DIR = new URL('../tests/fixtures/sru/', import.meta.url);

/** Index names to report on from the explain response: the four buildCql
 * emits, plus `urn`, which Phase 1 plans to use for /doc resolution. */
const REPORTED_INDEXES = ['tipoDocumento', 'localidade', 'autoridade', 'date', 'urn'];

function sruUrl(params: Record<string, string>): string {
	const url = new URL(LEXML_SRU_ENDPOINT);
	for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
	return url.toString();
}

async function fetchXml(url: string): Promise<string> {
	const response = await fetch(url, { headers: { Accept: 'application/xml' } });
	if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
	return await response.text();
}

interface SearchSample {
	file: string;
	cql: string;
}

function searchSamples(): SearchSample[] {
	const keyword = buildCql({ q: 'constituição federal' });
	const filtered = buildCql({ q: 'lei', category: 'legislacao' });
	if (!keyword.cql || !filtered.cql) {
		throw new Error('buildCql unexpectedly produced no query for a sample');
	}
	return [
		{ file: 'search-keyword.xml', cql: keyword.cql },
		{ file: 'search-filtered.xml', cql: filtered.cql },
		// Probes the URN index Phase 1 plans to use for /doc resolution. If SRU
		// rejects the index, the diagnostic reported below IS the contract
		// evidence — record it in the ROADMAP instead of committing a fixture.
		{ file: 'search-urn.xml', cql: 'urn="urn:lex:br:federal:lei:2002-01-10;10406"' }
	];
}

await mkdir(OUT_DIR, { recursive: true });
const capturedQueries: Record<string, string> = {};

{
	const url = sruUrl({ operation: 'explain', version: '1.1' });
	const xml = await fetchXml(url);
	if (!/explain/i.test(xml)) {
		throw new Error(`explain response does not look like an SRU explain document (${url})`);
	}
	await writeFile(new URL('explain.xml', OUT_DIR), xml);
	capturedQueries['explain.xml'] = url;
	for (const index of REPORTED_INDEXES) {
		console.log(`explain ${xml.includes(index) ? 'lists' : 'DOES NOT list'} index "${index}"`);
	}
}

for (const sample of searchSamples()) {
	const url = sruUrl({
		operation: 'searchRetrieve',
		version: '1.1',
		query: sample.cql,
		maximumRecords: '20',
		startRecord: '1'
	});
	const xml = await fetchXml(url);
	const parsed = parseSruResponse(xml, { page: 1, pageSize: 20 });
	const diagnostics = (parsed.warnings ?? []).filter((w) => w.startsWith('sru_diagnostic'));
	if (parsed.warnings?.includes('malformed_response')) {
		throw new Error(`${sample.file}: response did not parse (${url})`);
	}
	if (diagnostics.length > 0) {
		throw new Error(
			`${sample.file}: SRU diagnostics — contract evidence, not a fixture: ${diagnostics.join('; ')}`
		);
	}
	if (parsed.items.length === 0) {
		throw new Error(`${sample.file}: query matched no records; pick a different sample (${url})`);
	}
	await writeFile(new URL(sample.file, OUT_DIR), xml);
	capturedQueries[sample.file] = sample.cql;
	console.log(`${sample.file}: ${parsed.items.length} items of ${parsed.total} total`);
}

await writeFile(
	new URL('meta.json', OUT_DIR),
	JSON.stringify(
		{
			endpoint: LEXML_SRU_ENDPOINT,
			capturedAt: new Date().toISOString().slice(0, 10),
			queries: capturedQueries
		},
		null,
		'\t'
	) + '\n'
);
console.log('Fixtures written to tests/fixtures/sru/ — commit them; the parse suite picks them up.');
