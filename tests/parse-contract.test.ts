// Executable form of the docs/PRINCIPLES.md invariant "parsing is pure and
// never throws to the page": every pure upstream parser must map arbitrary
// hostile input to a well-formed response. Register new parsers here as new
// upstream formats are added.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSruResponse } from '$lib/server/legal/sru-parse';

const HOSTILE_INPUTS: Array<[name: string, input: string]> = [
	['empty string', ''],
	['plain text', 'not xml at all'],
	['truncated xml', '<srw:searchRetrieveResponse><srw:records><srw:rec'],
	['wrong root element', '<html><body>upstream error page</body></html>'],
	['json instead of xml', '{"searchRetrieveResponse":{"numberOfRecords":3}}'],
	['null bytes', 'a\u0000b\u0000c'],
	['deep nesting', `<a>${'<b>'.repeat(50)}${'</b>'.repeat(50)}</a>`],
	[
		'records with garbage shapes',
		`<searchRetrieveResponse>
			<numberOfRecords>not-a-number</numberOfRecords>
			<records>
				<record>plain text record</record>
				<record><recordData>text where dc expected</recordData></record>
			</records>
		</searchRetrieveResponse>`
	]
];

for (const [name, input] of HOSTILE_INPUTS) {
	test(`parseSruResponse never throws and stays well-formed: ${name}`, () => {
		const res = parseSruResponse(input, { page: 2, pageSize: 10 });
		assert.equal(res.source, 'lexml-sru');
		assert.equal(res.page, 2);
		assert.equal(res.pageSize, 10);
		assert.ok(Array.isArray(res.items));
		assert.ok(Number.isFinite(res.total));
	});
}

test('parseSruResponse surfaces structural surprises as a warning, not silence', () => {
	const res = parseSruResponse('<html><body>upstream error page</body></html>', {
		page: 1,
		pageSize: 20
	});
	assert.deepEqual(res.items, []);
	assert.ok(res.warnings?.includes('malformed_response'));
});
