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
