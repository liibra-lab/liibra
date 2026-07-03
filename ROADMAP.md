# Liibra Roadmap

Liibra is inspired by Cornell's Legal Information Institute ([LII](https://www.law.cornell.edu/)):
open, free, primary-source access to the law. For Brazil that means delivering
legal text from primary sources — the LexML network and the federal open-data
platform ([dados.gov.br](https://dados.gov.br/swagger-ui/index.html)) — using the
LexML URN and XML standards as the backbone.

This document records where the repository stands today and the plan to get from
"metadata search + seeded excerpts" to "full primary-source legal text".

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

1. **Primary source or nothing.** Text comes from official endpoints; every
   page keeps attribution and a verification link.
2. **URN-addressed.** The LexML URN (`urn:lex:br:...`) is the canonical
   identifier for every document, route, and citation.
3. **Honest presentation.** Partial coverage, per-page sorting, and upstream
   failures are surfaced to the reader, never hidden.
4. **Edge-first.** Cloudflare Workers is the only runtime; storage and
   scheduling use Workers primitives (KV, D1, R2, Cron Triggers).

## Phase 0 — Foundation hygiene (short term)

- [ ] Add a LICENSE (content and code may need distinct licensing; LII projects
      typically use permissive licenses for code, and Brazilian legal text is
      public domain under Lei 9.610/98 art. 8º, I).
- [ ] Add `src/routes/+error.svelte` with a localized, branded error page.
- [ ] Ship the planned hardening: tested CSP + HSTS in `hooks.server.ts`,
      SHA-pinned GitHub Actions, branch ruleset for `main`.
- [ ] Add CONTRIBUTING.md and issue templates.
- [ ] Add Playwright smoke tests (home, `/search`, `/doc`, `/proposicoes`)
      running against `wrangler dev` in CI.

## Phase 1 — Unify search and document resolution

Goal: any URN discoverable in `/search` renders inside Liibra.

- [ ] Verify the SRU contract: capture `explain` output, confirm index names,
      probe `sortKeys` support (SRU 1.2) to replace page-only sorting.
- [ ] Add fixtures from live SRU responses to the parse test suite.
- [ ] Implement URN → document metadata resolution via SRU
      (`urn="..."` query) so `/doc/[...urn]` works for any LexML record:
      metadata header + official links first, full text later (Phase 2).
- [ ] Retire the seed as the `/doc` source of truth; keep it as a curated
      "featured documents" list for the home page and as offline test fixtures.
- [ ] Surface SRU facets (category, locality, authority counts) in
      `SearchFilters` — the `LegalFacetGroup` types already exist.

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

## Non-goals (unchanged)

- Legal advice or automated legal conclusions.
- Long-running Node server deployments.
- Scraping where an official API or XML source exists. The one sanctioned
  exception is `scripts/fetch-constituicao-planalto.ts`: a curated, one-off
  seed generator for the compiled 1988 Constitution, which has no official
  XML endpoint. It runs offline at development time — never in the Worker —
  and is not precedent for scraping other sources.
