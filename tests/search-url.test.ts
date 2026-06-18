import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchQueryString } from '$lib/legal/search-url';

test('preserves query, filters and non-default sort', () => {
	const qs = searchQueryString({
		q: 'improbidade administrativa',
		category: 'legislacao',
		locality: 'Brasil',
		authority: 'Federal',
		dateFrom: '2000',
		dateTo: '2020',
		sort: 'date_desc',
		page: 1
	});
	const sp = new URLSearchParams(qs);
	assert.equal(sp.get('q'), 'improbidade administrativa');
	assert.equal(sp.get('category'), 'legislacao');
	assert.equal(sp.get('locality'), 'Brasil');
	assert.equal(sp.get('authority'), 'Federal');
	assert.equal(sp.get('dateFrom'), '2000');
	assert.equal(sp.get('dateTo'), '2020');
	assert.equal(sp.get('sort'), 'date_desc');
	// page 1 is the default and is omitted.
	assert.equal(sp.has('page'), false);
});

test('omits default sort and page', () => {
	const qs = searchQueryString({ q: 'lei', sort: 'relevance', page: 1 });
	assert.equal(qs, 'q=lei');
});

test('overrides take precedence (pagination)', () => {
	const qs = searchQueryString({ q: 'lei', page: 1 }, { page: 3 });
	const sp = new URLSearchParams(qs);
	assert.equal(sp.get('page'), '3');
	assert.equal(sp.get('q'), 'lei');
});

test('empty params produce an empty string', () => {
	assert.equal(searchQueryString({}), '');
});
