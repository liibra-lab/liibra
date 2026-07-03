# Liibra principles

Liibra is an LII-inspired project ([law.cornell.edu](https://www.law.cornell.edu/)):
free, open, primary-source access to Brazilian legal information. This file is
the single owner of the project's standing rules — the principles, invariants,
and non-goals that bind design and code review. [`ROADMAP.md`](../ROADMAP.md)
plans the work; this file states what any plan must satisfy.
[`BRAND.md`](BRAND.md) owns the visual identity.

## Product principles

1. **Primary source or nothing.** Legal text comes from official endpoints;
   every page keeps attribution and a verification link.
2. **URN-addressed.** The LexML URN (`urn:lex:br:...`) is the canonical
   identifier for every document, route, and citation.
3. **Honest presentation.** Partial coverage, per-page sorting, and upstream
   failures are surfaced to the reader, never hidden.
4. **Edge-first.** Cloudflare Workers is the only runtime; storage and
   scheduling use Workers primitives (KV, D1, R2, Cron Triggers). Never add
   code that requires a long-running Node server.

## Language

Legal source text stays in Portuguese, always. Interface chrome is localized
through `src/lib/i18n/` (pt-BR/en).

## Architecture invariants

- **Network access lives only in `src/lib/server/`.** Routes and components
  never fetch upstream sources directly; they depend on interfaces
  (`LegalSource`, `PropositionSource`) wired in the composition roots
  (`src/lib/server/legal/index.ts`, `src/lib/server/camara/index.ts`) and
  pass SvelteKit's injected `fetch` down to them.
- **Parsing is pure and fixture-tested.** Upstream XML/JSON parsing never
  throws to the page; failures become typed warnings the UI renders honestly.
  Tests use Node's built-in runner (`tests/**/*.test.ts`); add fixtures for
  any new upstream response shape you parse.
- **Defensive upstream integration.** Whitelist query fields, escape user
  values, cap page sizes, convert upstream failures into typed errors.

Where an invariant can be checked by machine, the check — not this prose — is
the enforcement; this file explains intent.

## Non-goals

- **No legal advice** or automated legal conclusions.
- **No long-running Node server deployments** — a consequence of edge-first.
- **No scraping where an official API or XML source exists.** The one
  sanctioned exception is `scripts/fetch-constituicao-planalto.ts`: a curated,
  one-off seed generator for the compiled 1988 Constitution, which has no
  official XML endpoint. It runs offline at development time — never in the
  Worker — and is not precedent for scraping other sources.
- **No secrets in the repo** — Cloudflare credentials stay in the environment.

## Visual identity

[`BRAND.md`](BRAND.md) owns all visual rules, including the two normative
color roles (functional blue, decorative brass) and the typography split
(Fraunces for headings, system sans for body and chrome).
