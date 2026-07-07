// Smoke tests: the executable form of the docs/PRINCIPLES.md principle
// "honest presentation". Seeded pages must render their content offline;
// pages backed by live upstreams must render either results or a typed
// warning — never a crash — because upstream availability is not ours to
// assume (in this suite the upstreams may or may not be reachable, and both
// outcomes are correct).

import { test, expect } from '@playwright/test';

const CONSTITUICAO_URN = 'urn:lex:br:federal:constituicao:1988-10-05;1988';

test('home renders the seeded featured documents', async ({ page }) => {
	const response = await page.goto('/');
	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle(/Liibra/);
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	// The featured list is seeded, so it renders without any upstream.
	await expect(page.locator('main a[href*="/doc/"]').first()).toBeVisible();
});

test('seeded document renders full text with source attribution, offline', async ({ page }) => {
	const response = await page.goto(`/doc/${CONSTITUICAO_URN}`);
	expect(response?.status()).toBe(200);
	// Interface chrome localizes with the browser locale, so match both titles…
	await expect(page.getByRole('heading', { level: 1 })).toContainText(/Constitu(ição|tion)/i);
	// …but the legal text itself stays in Portuguese, whatever the locale.
	await expect(page.locator('main')).toContainText('Estado Democrático de Direito');
	// Principle 1: every page keeps attribution and a verification link.
	await expect(
		page.locator('a[href*="lexml.gov.br"], a[href*="planalto.gov.br"]').first()
	).toBeVisible();
});

test('unknown URN is a 404, not a crash', async ({ page }) => {
	const response = await page.goto('/doc/urn:lex:br:federal:lei:1900-01-01;0');
	expect(response?.status()).toBe(404);
});

test('search page renders the form and results heading', async ({ page }) => {
	const response = await page.goto('/search');
	expect(response?.status()).toBe(200);
	await expect(page.locator('input[name="q"]').first()).toBeVisible();
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('search with a query renders results or an honest warning', async ({ page }) => {
	const response = await page.goto('/search?q=lei');
	expect(response?.status()).toBe(200);
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	// Either result cards (upstream reachable) or a rendered warning
	// (upstream down) — both honest; a blank or error page is a failure.
	await expect(page.locator('main')).not.toHaveText('');
});

test('proposicoes renders a list or an honest warning', async ({ page }) => {
	const response = await page.goto('/proposicoes');
	expect(response?.status()).toBe(200);
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.locator('main')).not.toHaveText('');
});

// Agent discovery (docs/AGENT-DISCOVERY.md): the Link header, the RFC 9727
// catalog, and everything the catalog points at must all resolve on the
// built Worker — these are offline, seeded surfaces, so 200s are guaranteed.
test('agent discovery: Link header points at a resolvable api-catalog', async ({ request }) => {
	const home = await request.get('/');
	expect(home.headers()['link']).toContain('rel="api-catalog"');

	const catalog = await request.get('/.well-known/api-catalog');
	expect(catalog.status()).toBe(200);
	expect(catalog.headers()['content-type']).toContain('application/linkset+json');

	const body = await catalog.json();
	for (const entry of body.linkset) {
		for (const rel of ['service-desc', 'service-doc'] as const) {
			for (const target of entry[rel]) {
				const linked = await request.get(target.href);
				expect(linked.status(), `${rel} → ${target.href}`).toBe(200);
			}
		}
	}
});

test('docs/api page renders the machine-access documentation', async ({ page }) => {
	const response = await page.goto('/docs/api');
	expect(response?.status()).toBe(200);
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.locator('main a[href="/.well-known/api-catalog"]')).toBeVisible();
});
