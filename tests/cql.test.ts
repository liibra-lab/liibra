import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCql, cqlEscape, toStartRecord, CATEGORY_CQL } from '$lib/server/legal/cql';

test('cqlEscape escapes backslashes and quotes', () => {
	assert.equal(cqlEscape('a"b'), 'a\\"b');
	assert.equal(cqlEscape('a\\b'), 'a\\\\b');
	assert.equal(cqlEscape('plain'), 'plain');
});

test('buildCql quotes free text with the `all` relation', () => {
	const { cql } = buildCql({ q: 'improbidade administrativa' });
	assert.equal(cql, 'cql.serverChoice all "improbidade administrativa"');
});

test('buildCql neutralizes an injection attempt by escaping the quote', () => {
	const { cql } = buildCql({ q: '" or tipoDocumento="x' });
	// The user quote is escaped, so it cannot close the literal or add a term.
	assert.equal(cql, 'cql.serverChoice all "\\" or tipoDocumento=\\"x"');
});

test('buildCql maps category, locality, authority and date bounds', () => {
	const { cql } = buildCql({
		q: 'lei',
		category: 'legislacao',
		locality: 'Brasil',
		authority: 'Federal',
		dateFrom: '2000',
		dateTo: '2020'
	});
	assert.equal(
		cql,
		'cql.serverChoice all "lei" and tipoDocumento="Legislação" and localidade="Brasil" ' +
			'and autoridade="Federal" and date >= "2000" and date <= "2020"'
	);
});

test('buildCql rejects malformed date bounds with a warning, not a term', () => {
	const { cql, warnings } = buildCql({ q: 'x', dateFrom: '20xx', dateTo: '2020-13-40zz' });
	assert.equal(cql, 'cql.serverChoice all "x"');
	assert.deepEqual(warnings, ['invalid_date_from', 'invalid_date_to']);
});

test('buildCql returns null when there is nothing to search', () => {
	assert.equal(buildCql({}).cql, null);
	assert.equal(buildCql({ q: '   ' }).cql, null);
});

test('buildCql can search by filters alone (no free text)', () => {
	const { cql } = buildCql({ category: 'jurisprudencia' });
	assert.equal(cql, 'tipoDocumento="Jurisprudência"');
});

test('CATEGORY_CQL covers all seven categories', () => {
	assert.equal(Object.keys(CATEGORY_CQL).length, 7);
});

test('toStartRecord maps 1-based pages to SRU start records', () => {
	assert.equal(toStartRecord(1, 20), 1);
	assert.equal(toStartRecord(2, 20), 21);
	assert.equal(toStartRecord(3, 20), 41);
	// Defensive defaults for bad input.
	assert.equal(toStartRecord(0, 20), 1);
	assert.equal(toStartRecord(NaN, 20), 1);
});
