# Liibra Roadmap

Liibra is inspired by Cornell's Legal Information Institute ([LII](https://www.law.cornell.edu/)):
open, free, primary-source access to the law. For Brazil that means delivering
legal text from primary sources — the LexML network and the federal open-data
platform ([dados.gov.br](https://dados.gov.br/swagger-ui/index.html)) — using the
LexML URN and XML standards as the backbone.

This document records where the repository stands today and the plan to get from
"metadata search + seeded excerpts" to "full primary-source legal text".

How to read it: phase **goals** and their acceptance criteria are binding.
Named **mechanisms** — storage splits (KV/D1/R2), refresh designs, rendering
techniques, even the phase ordering — are the best guess at the time of
writing; decide them at implementation time, preferring the simplest design
that satisfies [`docs/PRINCIPLES.md`](docs/PRINCIPLES.md).

The **current** phase carries explicit **exit criteria** (the observable result
required to leave it) and **validation** (the automated checks and manual tests
that prove it). Later phases get theirs when they become current — writing them
early guesses at criteria that the preceding phase will change. Criteria are
observable outcomes, never "it works": a phase is left when a stated condition
is true, not when the work feels finished.
[`docs/REVIEW.md`](docs/REVIEW.md) owns the procedure that applies them.

## Where the repository stands (review summary, 2026-07)

### What is working well

- **Clean layering.** Network access lives only in `src/lib/server/`
  (`legal/lexml-sru-source.ts`, `camara/client.ts`). Routes depend on interfaces
  (`LegalSource`, `PropositionSource`) wired in composition roots
  (`legal/index.ts`, `camara/index.ts`), so sources can be swapped without
  touching UI.
- **Defensive integration.** The CQL builder whitelists indexes and escapes
  every user value; page size is capped; SRU XML parsing is pure, fixture-tested,
  and never throws to the page; upstream failures become typed warnings the UI
  renders honestly (`source_unavailable`, `sort_page_only`, SRU diagnostics).
- **Sound security baseline.** Read-only CI permissions, `npm audit` in CI,
  Dependabot, CODEOWNERS, SECURITY.md, baseline response headers in
  `hooks.server.ts`, no secrets in the repo, `workers.dev`/preview URLs disabled.
- **Honest data posture.** Seeded articles are faithful excerpts flagged
  `coverage: 'partial'`; every document and proposition carries source
  attribution and official links.

### Main gaps

1. **Two disconnected search worlds.** `/search` queries LexML SRU live, but
   `/doc/[...urn]` resolves URNs only against the 3-document in-memory seed
   (`legal/seed-data.ts`). Any URN found via `/search` that is not seeded 404s
   inside Liibra (the result card links out to lexml.gov.br instead). This is
   the single biggest functional gap.
2. **The core mission is not yet implemented.** There is no retrieval or
   rendering of full legal text from a primary source — no LexML XML
   (norma/articulação schema) parsing, and no dados.gov.br integration at all.
3. **Unverified SRU contract.** The CQL index names (`tipoDocumento`,
   `localidade`, `autoridade`, `date`) mirror the LexML portal facets but have
   not been validated against the endpoint's `explain` response; server-side
   sorting and facet retrieval are unexplored, so sorting is per-page only.
4. **No document persistence.** Every request re-fetches upstream (edge cache
   TTL 300s only). There is no durable store (KV/D1/R2) for retrieved texts,
   which the full-text mission will require.
5. **Repository/product hygiene.** No LICENSE file (critical for an
   LII-inspired open project), no `+error.svelte`, static-only `sitemap.xml`,
   CSP/HSTS still TODO, GitHub Actions not yet SHA-pinned, no e2e/component
   tests (19 unit tests cover the pure helpers only), no CONTRIBUTING guide.

## Guiding principles

The guiding principles matured from review notes into standing rules and now
live in [`docs/PRINCIPLES.md`](docs/PRINCIPLES.md), the single owner of the
project's principles, invariants, and non-goals. The phases below are ordered
by them.

## Phase 0 — Foundation hygiene (short term)

Goal: the repository is safe and legible for outside contributors, and the
gaps that would embarrass an open legal-information project are closed.

- [ ] Add a LICENSE (content and code may need distinct licensing; LII projects
      typically use permissive licenses for code, and Brazilian legal text is
      public domain under Lei 9.610/98 art. 8º, I).
- [ ] Add `src/routes/+error.svelte` with a localized, branded error page.
- [ ] Ship the planned hardening: tested CSP + HSTS in `hooks.server.ts`,
      SHA-pinned GitHub Actions, branch ruleset for `main`.
- [ ] Add CONTRIBUTING.md and issue templates.
- [x] Add Playwright smoke tests (home, `/search`, `/doc`, `/proposicoes`)
      running against `wrangler dev` in CI (`e2e/smoke.spec.ts`).

**Exit criteria.** A LICENSE file exists and README states which licence covers
code and which covers content. An unknown route renders the branded error page
in both locales rather than the framework default. Every response carries CSP
and HSTS headers; every GitHub Actions step is pinned to a commit SHA; the
`main` ruleset is enabled with PR required, status checks required, and
force-push and deletion disabled, which clears the "Branch protection/ruleset
for main" item from AS-001's `verify_next` in `attacksurface.md` and closes its
P0. A first-time contributor can go from clone to passing gate using
CONTRIBUTING.md alone.

**Validation.** `npm run gate` and `npm run test:e2e`; a header assertion in
`tests/` covering CSP and HSTS; a smoke test asserting the error page; manual
check of the `main` ruleset in the GitHub UI, recorded in the PR.

## Phase 1 — Unify search and document resolution

Goal: any URN discoverable in `/search` renders inside Liibra.

- [ ] Verify the SRU contract: capture `explain` output, confirm index names,
      probe `sortKeys` support (SRU 1.2) to replace page-only sorting.
- [ ] Add fixtures from live SRU responses to the parse test suite.
      The apparatus for both items is in place: `npm run gen:sru-fixtures`
      captures and validates `explain` plus searchRetrieve samples into
      `tests/fixtures/sru/`, and `tests/sru-fixtures.test.ts` asserts the
      contract against whatever is committed there. Run the capture from a
      network that can reach lexml.gov.br (sandboxed sessions are blocked).
- [ ] Implement URN → document metadata resolution via SRU
      (`urn="..."` query) so `/doc/[...urn]` works for any LexML record:
      metadata header + official links first, full text later (Phase 2).
- [ ] Retire the seed as the `/doc` source of truth; keep it as a curated
      "featured documents" list for the home page and as offline test fixtures.
- [ ] Surface SRU facets (category, locality, authority counts) in
      `SearchFilters` — the `LegalFacetGroup` types already exist.

**Exit criteria.** A URN taken from any `/search` result page resolves at
`/doc/<urn>` to a metadata header with attribution and official links, instead
of 404ing — the gap named above as the single biggest functional one is closed.
Resolution reports its match level explicitly (exact, parent, or fuzzy) and
never falls back silently ([`Principles.md`](Principles.md) #5). The committed
`explain` fixture confirms the CQL index names actually served by the endpoint,
and sorting is either server-side or still honestly labelled `sort_page_only`.
`legal/seed-data.ts` is no longer the `/doc` source of truth.

**Validation.** `npm run gen:sru-fixtures` captured against a network that can
reach lexml.gov.br, with the results committed under `tests/fixtures/sru/`;
`tests/sru-fixtures.test.ts` and `tests/parse-contract.test.ts` green over
them; a smoke test that resolves a non-seeded URN end to end; manual check of
several URNs spanning document types, recorded in the PR.

## Phase 2 — Full text via LexML XML (the core deliverable)

Goal: render the actual law, structured, from primary source.

- [ ] Fetch LexML XML for norms where available (LexML network / Senado's
      LexEdit-published XML) and parse the LexML schema:
      `Norma → Articulacao → Artigo / Paragrafo / Inciso / Alinea / Item`.
- [ ] Extend the `LegalDocument` model to a structured body (hierarchy, rubrics,
      epigraph, ementa, preamble, signature block) instead of flat article
      strings; keep `coverage: 'full' | 'partial'` honest.
- [ ] Deep links: anchor every article/paragraph (`/doc/<urn>#art5`,
      LexML fragment IDs) so citations can point at a specific device.
- [ ] Versioning: LexML URNs encode events (`;retificacao`, compilations);
      model "texto original vs. texto compilado" and label which version is
      shown, with links to the other.
- [ ] Fallback pipeline for norms without XML: link out prominently
      (planalto.gov.br) rather than scraping HTML in v1.
- [ ] Persist retrieved/parsed documents in Cloudflare (R2 for raw XML, D1 or
      KV for parsed JSON) with a Cron Trigger worker to refresh; serve reads
      from the store, not the upstream, for latency and resilience.

## Phase 3 — dados.gov.br integration

Goal: use the federal open-data platform as a catalog and bulk source.

- [ ] Add a server-only `dadosgov` client (CKAN-style API per the Swagger spec)
      following the `camara/client.ts` pattern: typed errors, edge caching,
      injected fetch.
- [ ] Use it to discover and ingest legal datasets (Diário Oficial, legislação
      compilada, jurisprudência datasets) into the Phase-2 store via scheduled
      Workers.
- [ ] Publish a "Sources" page documenting every dataset consumed, its license,
      refresh cadence, and last sync time — LII-style transparency.

## Phase 4 — Discovery, citation, and cross-referencing

Goal: the features that made LII indispensable.

- [ ] Automatic cross-reference linking: detect citations in legal text
      ("art. 5º, XXXII, da Constituição Federal", "Lei nº 8.078, de 1990") and
      link them to their URN routes.
- [ ] Citation helper on every document/article: ABNT-formatted citation,
      canonical Liibra URL, and the LexML URN, with copy buttons.
- [ ] Dynamic sitemap + `schema.org/Legislation` JSON-LD for indexed documents;
      per-document OpenGraph metadata.
- [ ] Table of contents navigation for large codes (the `TOCsidebar` component
      is the seed of this) with virtualized rendering for 2000+ article codes.
- [ ] Portuguese-aware search UX: accent-insensitive suggestions, "did you
      mean", and common-name aliases (e.g. "CDC" → Lei 8.078/1990).

## Phase 5 — Broader coverage

- [ ] Senado Federal open data (matérias, normas) alongside Câmara propositions;
      unified "tramitação" timeline view for a proposition across houses.
- [ ] Link propositions to the norms they became (Câmara/LexML both expose
      this), closing the loop between `/proposicoes` and `/doc`.
- [ ] State and municipal jurisdictions (widen the `Jurisdiction` type as real
      coverage lands, not before).
- [ ] Jurisprudência category: start with links/metadata via SRU; full-text
      court decisions are a separate, later effort.

## Phase 6 — Quality, operations, and community

- [ ] Observability: Workers analytics/logpush for upstream failure rates and
      cache hit ratios; alert when a source degrades.
- [ ] Rate limiting / abuse protection on search routes (Cloudflare WAF rules
      or Worker-level throttling).
- [ ] Accessibility audit to WCAG 2.2 AA — a legal-information site must be
      readable by everyone, including screen-reader users.
- [ ] Complete pt-BR/en interface parity and document the i18n contribution
      workflow (legal text always stays in Portuguese).
- [ ] Public roadmap issues + good-first-issue labels to grow contributors.

## Non-goals

Non-goals — including the one sanctioned scraping exception
(`scripts/fetch-constituicao-planalto.ts`) — live in
[`docs/PRINCIPLES.md`](docs/PRINCIPLES.md).
