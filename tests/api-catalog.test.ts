import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
	AGENT_DISCOVERY_LINK,
	API_CATALOG_PATH,
	API_DOCS_PATH,
	OPENAPI_PATH,
	buildApiCatalog
} from '$lib/discovery/api-catalog';

const ORIGIN = 'https://liibra.com.br';

test('Link header advertises the catalog, docs, and OpenAPI relations', () => {
	assert.ok(AGENT_DISCOVERY_LINK.includes(`<${API_CATALOG_PATH}>; rel="api-catalog"`));
	assert.ok(AGENT_DISCOVERY_LINK.includes(`<${API_DOCS_PATH}>; rel="service-doc"`));
	assert.ok(AGENT_DISCOVERY_LINK.includes(`<${OPENAPI_PATH}>; rel="service-desc"`));
});

test('catalog entries anchor to the given origin and link the published paths', () => {
	const catalog = buildApiCatalog(ORIGIN);
	assert.ok(Array.isArray(catalog.linkset));
	assert.ok(catalog.linkset.length >= 1);
	for (const entry of catalog.linkset) {
		assert.ok(entry.anchor.startsWith(`${ORIGIN}/`));
		assert.equal(entry['service-desc'][0].href, `${ORIGIN}${OPENAPI_PATH}`);
		assert.equal(entry['service-doc'][0].href, `${ORIGIN}${API_DOCS_PATH}`);
	}
});

// Contract between the catalog and the committed OpenAPI document: the file
// the catalog points at exists, parses, and describes the routes that
// actually exist in src/routes (the URN resolver and the document page).
test('committed OpenAPI document matches the catalog and the real routes', () => {
	const spec = JSON.parse(readFileSync(`static${OPENAPI_PATH}`, 'utf8'));
	assert.equal(spec.openapi, '3.1.0');
	assert.equal(spec.servers[0].url, ORIGIN);
	assert.ok(spec.paths['/urn/{urn}']?.get);
	assert.ok(spec.paths['/urn/{urn}'].get.responses['308']);
	assert.ok(spec.paths['/doc/{urn}']?.get);
});
