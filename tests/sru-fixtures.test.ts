// Contract tests driven by live LexML SRU captures (ROADMAP Phase 1). They
// activate when `npm run gen:sru-fixtures` has written real responses into
// tests/fixtures/sru/; until then the suite reports a single skipped test.
// The capture script validates every fixture before writing it, so the
// assertions here can be firm.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCql } from '$lib/server/legal/cql';
import { parseSruResponse } from '$lib/server/legal/sru-parse';

const FIXTURES_DIR = fileURLToPath(new URL('./fixtures/sru/', import.meta.url));

/** The index names buildCql actually emits, extracted from a fully-populated
 * query so this list can never drift from the builder. */
function emittedIndexes(): string[] {
	const { cql } = buildCql({
		q: 'x',
		category: 'legislacao',
		locality: 'Brasil',
		authority: 'federal',
		dateFrom: '2000',
		dateTo: '2001'
	});
	const names = [...(cql ?? '').matchAll(/([\w.]+)\s*(?:>=|<=|=)/g)].map((m) => m[1]);
	return [...new Set(names)].filter((name) => name !== 'cql.serverChoice');
}

const files = existsSync(FIXTURES_DIR) ? readdirSync(FIXTURES_DIR) : [];

if (files.length === 0) {
	test('live SRU fixtures — none captured yet', (t) => {
		t.skip('run `npm run gen:sru-fixtures` from a network that can reach lexml.gov.br');
	});
} else {
	if (files.includes('explain.xml')) {
		const explain = readFileSync(path.join(FIXTURES_DIR, 'explain.xml'), 'utf8');
		for (const index of emittedIndexes()) {
			test(`SRU explain lists the "${index}" index that buildCql emits`, () => {
				assert.ok(
					explain.includes(index),
					`"${index}" is missing from the captured explain response — the CQL whitelist in cql.ts no longer matches the SRU contract`
				);
			});
		}
	}

	for (const file of files.filter((f) => f.startsWith('search-') && f.endsWith('.xml'))) {
		test(`live capture ${file} parses into usable results`, () => {
			const xml = readFileSync(path.join(FIXTURES_DIR, file), 'utf8');
			const res = parseSruResponse(xml, { page: 1, pageSize: 20 });
			assert.ok(!res.warnings?.includes('malformed_response'), 'fixture no longer parses');
			assert.ok(res.items.length > 0, 'fixture yields no items');
			for (const item of res.items) {
				assert.match(item.urn, /^urn:lex/i);
			}
			assert.ok(res.total >= res.items.length);
		});
	}
}
