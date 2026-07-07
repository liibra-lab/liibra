// Agent-discovery surface: the RFC 8288 Link relations advertised on every
// server-rendered response, and the RFC 9727 /.well-known/api-catalog linkset
// they point at. Pure module — no network, no runtime state — so the catalog
// shape is unit-tested (tests/api-catalog.test.ts) and shared between
// src/hooks.server.ts and the route handler. docs/AGENT-DISCOVERY.md owns the
// standing rules for what is (and deliberately is not) published here.

export const API_CATALOG_PATH = '/.well-known/api-catalog';
export const API_DOCS_PATH = '/docs/api';
export const OPENAPI_PATH = '/docs/api/openapi.json';

/** Media type required by RFC 9264/9727 for the api-catalog document. */
export const LINKSET_MEDIA_TYPE = 'application/linkset+json';

// RFC 8288 Link header value. Relative URI references are resolved against
// the request URI, so one constant serves every origin (prod, preview, dev).
export const AGENT_DISCOVERY_LINK = [
	`<${API_CATALOG_PATH}>; rel="api-catalog"`,
	`<${API_DOCS_PATH}>; rel="service-doc"`,
	`<${OPENAPI_PATH}>; rel="service-desc"`
].join(', ');

export interface LinkTarget {
	href: string;
	type?: string;
}

export interface LinksetEntry {
	anchor: string;
	'service-desc': LinkTarget[];
	'service-doc': LinkTarget[];
}

export interface ApiCatalog {
	linkset: LinksetEntry[];
}

// RFC 9727 linkset: one entry per API, anchored at the API's base URL.
// Liibra's only machine endpoint today is the URN resolver; everything is
// public and read-only, so there are no auth-related relations.
export function buildApiCatalog(origin: string): ApiCatalog {
	return {
		linkset: [
			{
				anchor: `${origin}/urn/`,
				'service-desc': [{ href: `${origin}${OPENAPI_PATH}`, type: 'application/json' }],
				'service-doc': [{ href: `${origin}${API_DOCS_PATH}`, type: 'text/html' }]
			}
		]
	};
}
