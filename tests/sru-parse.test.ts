import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSruResponse } from '$lib/server/legal/sru-parse';

const ctx = { page: 1, pageSize: 20 };

// A small, hand-written SRU response (NOT a live dump): one Dublin Core record
// with a URN identifier and a separate http identifier.
const OK_XML = `<?xml version="1.0"?>
<srw:searchRetrieveResponse xmlns:srw="http://www.loc.gov/zing/srw/">
  <srw:version>1.1</srw:version>
  <srw:numberOfRecords>1234</srw:numberOfRecords>
  <srw:records>
    <srw:record>
      <srw:recordData>
        <srw_dc:dc xmlns:srw_dc="info:srw/schema/1/dc-schema"
                   xmlns:dc="http://purl.org/dc/elements/1.1/">
          <dc:identifier>urn:lex:br:federal:lei:2002-01-10;10406</dc:identifier>
          <dc:identifier>https://www.lexml.gov.br/urn/urn:lex:br:federal:lei:2002-01-10;10406</dc:identifier>
          <dc:title>Lei nº 10.406, de 10 de Janeiro de 2002</dc:title>
          <dc:date>2002-01-10</dc:date>
          <dc:description>Institui o Código Civil.</dc:description>
          <dc:type>Legislação</dc:type>
        </srw_dc:dc>
      </srw:recordData>
    </srw:record>
  </srw:records>
</srw:searchRetrieveResponse>`;

test('extracts numberOfRecords as total', () => {
	const res = parseSruResponse(OK_XML, ctx);
	assert.equal(res.total, 1234);
	assert.equal(res.source, 'lexml-sru');
	assert.equal(res.page, 1);
	assert.equal(res.pageSize, 20);
});

test('extracts URN, title, date, summary, category and source URL', () => {
	const { items } = parseSruResponse(OK_XML, ctx);
	assert.equal(items.length, 1);
	const item = items[0];
	assert.equal(item.urn, 'urn:lex:br:federal:lei:2002-01-10;10406');
	assert.equal(item.title, 'Lei nº 10.406, de 10 de Janeiro de 2002');
	assert.equal(item.date, '2002-01-10');
	assert.equal(item.summary, 'Institui o Código Civil.');
	assert.equal(item.category, 'legislacao');
	assert.equal(
		item.sourceUrl,
		'https://www.lexml.gov.br/urn/urn:lex:br:federal:lei:2002-01-10;10406'
	);
});

test('drops records without a urn:lex identifier', () => {
	const xml = `<srw:searchRetrieveResponse xmlns:srw="http://www.loc.gov/zing/srw/">
    <srw:numberOfRecords>1</srw:numberOfRecords>
    <srw:records><srw:record><srw:recordData>
      <dc xmlns="http://purl.org/dc/elements/1.1/"><title>No URN here</title></dc>
    </srw:recordData></srw:record></srw:records>
  </srw:searchRetrieveResponse>`;
	const res = parseSruResponse(xml, ctx);
	assert.equal(res.total, 1);
	assert.equal(res.items.length, 0);
});

test('handles an empty result set without throwing', () => {
	const xml = `<srw:searchRetrieveResponse xmlns:srw="http://www.loc.gov/zing/srw/">
    <srw:numberOfRecords>0</srw:numberOfRecords>
  </srw:searchRetrieveResponse>`;
	const res = parseSruResponse(xml, ctx);
	assert.equal(res.total, 0);
	assert.deepEqual(res.items, []);
});

test('surfaces SRU diagnostics as warnings', () => {
	const xml = `<srw:searchRetrieveResponse xmlns:srw="http://www.loc.gov/zing/srw/"
      xmlns:diag="http://www.loc.gov/zing/srw/diagnostic/">
    <srw:numberOfRecords>0</srw:numberOfRecords>
    <srw:diagnostics><diag:diagnostic>
      <diag:uri>info:srw/diagnostic/1/16</diag:uri>
      <diag:message>Unsupported index</diag:message>
    </diag:diagnostic></srw:diagnostics>
  </srw:searchRetrieveResponse>`;
	const res = parseSruResponse(xml, ctx);
	assert.ok(res.warnings?.includes('sru_diagnostic:Unsupported index'));
});

test('malformed and empty XML degrade gracefully with a warning', () => {
	for (const bad of ['', 'not xml at all <<<', '<other></other>']) {
		const res = parseSruResponse(bad, ctx);
		assert.deepEqual(res.items, []);
		assert.equal(res.total, 0);
		assert.ok(res.warnings?.includes('malformed_response'), `expected warning for: ${bad}`);
	}
});

// --- Entity-expansion hardening (GHSA-8r6m-32jq-jx6q) -----------------------
//
// The next three tests pin two different things and must stay separate.
//
// The repeated-DOCTYPE test pins the fast-xml-parser *version floor*: on 5.10.0
// this input parses successfully and exhibits the advisory — the second DOCTYPE
// resets the entity table, so `&first;` is silently dropped and the document is
// misread. Tightened entity limits do NOT protect against it; only >=5.10.1
// does. Both declarations are deliberately minimal: an oversized-entity payload
// would trip `maxEntitySize` before the parser ever reaches the second DOCTYPE,
// so it would pass without proving anything about the upstream fix.
//
// The entity-count test pins the *configuration* instead: it parses fine under
// library defaults on any version, and only rejects because ENTITY_LIMITS in
// sru-parse.ts caps the count.

test('repeated DOCTYPE declarations are refused, not silently re-read', () => {
	const xml = `<!DOCTYPE srw:searchRetrieveResponse [<!ENTITY first "a">]>
<!DOCTYPE srw:searchRetrieveResponse [<!ENTITY second "b">]>
<srw:searchRetrieveResponse xmlns:srw="http://www.loc.gov/zing/srw/">
  <srw:numberOfRecords>&first;&second;</srw:numberOfRecords>
</srw:searchRetrieveResponse>`;
	const res = parseSruResponse(xml, ctx);
	assert.deepEqual(res.items, []);
	assert.equal(res.total, 0);
	assert.ok(res.warnings?.includes('malformed_response'));
});

test('an entity count above the configured budget is refused', () => {
	const entities = Array.from({ length: 9 }, (_, i) => `<!ENTITY e${i} "v">`).join('');
	const xml = `<!DOCTYPE srw:searchRetrieveResponse [${entities}]>
<srw:searchRetrieveResponse xmlns:srw="http://www.loc.gov/zing/srw/">
  <srw:numberOfRecords>0</srw:numberOfRecords>
</srw:searchRetrieveResponse>`;
	const res = parseSruResponse(xml, ctx);
	assert.deepEqual(res.items, []);
	assert.equal(res.total, 0);
	assert.ok(res.warnings?.includes('malformed_response'));
});

// Guards the hardening against being "tightened" into `processEntities: false`,
// which would leave these escapes literal and corrupt legal document titles.
test('standard XML entities still decode in record fields', () => {
	const xml = `<srw:searchRetrieveResponse xmlns:srw="http://www.loc.gov/zing/srw/">
  <srw:numberOfRecords>1</srw:numberOfRecords>
  <srw:records><srw:record><srw:recordData>
    <srw_dc:dc xmlns:srw_dc="info:srw/schema/1/dc-schema"
               xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:identifier>urn:lex:br:federal:lei:2002-01-10;10406</dc:identifier>
      <dc:title>Reforma &amp; Revisão &lt;anexo&gt;</dc:title>
    </srw_dc:dc>
  </srw:recordData></srw:record></srw:records>
</srw:searchRetrieveResponse>`;
	const { items } = parseSruResponse(xml, ctx);
	assert.equal(items.length, 1);
	assert.equal(items[0].title, 'Reforma & Revisão <anexo>');
	// Named entities only. Numeric character references (`&#227;`) are gated by
	// the `htmlEntities` option, which this parser leaves at its default `false`
	// — unchanged by the entity budget above, and untested here on purpose.
});
