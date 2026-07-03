# CLAUDE.md

Liibra is an LII-inspired project ([law.cornell.edu](https://www.law.cornell.edu/)):
free, open, primary-source access to Brazilian legal information, deployed
exclusively to Cloudflare Workers. `ROADMAP.md` is the plan of record —
read it before starting substantive work. `docs/BRAND.md` owns the visual
identity.

## Quality gate — run before every push

```sh
npm run check && npm run lint && npm test && npm run build
```

No exceptions: a session must not end with pushed commits that have not
passed this gate. CI runs the same steps, but catching failures locally
saves a review round trip. Dependencies install from the committed
`package-lock.json` (`npm ci`); never mutate the lockfile casually. Node 22.

## Architecture invariants

- **Network access lives only in `src/lib/server/`.** Routes and components
  never fetch upstream sources directly; they depend on interfaces
  (`LegalSource`, `PropositionSource`) wired in the composition roots
  (`src/lib/server/legal/index.ts`, `src/lib/server/camara/index.ts`).
- **Parsing is pure and fixture-tested.** Upstream XML/JSON parsing never
  throws to the page; failures become typed warnings the UI renders honestly.
- **Defensive upstream integration.** Whitelist query fields, escape user
  values, cap page sizes, convert upstream failures into typed errors.
- **Edge-first.** Cloudflare Workers is the only runtime. Storage and
  scheduling use Workers primitives (KV, D1, R2, Cron Triggers). Never add
  code that requires a long-running Node server.

## Product principles (from ROADMAP.md — they bind code review)

1. **Primary source or nothing.** Legal text comes from official endpoints;
   every page keeps attribution and a verification link.
2. **URN-addressed.** The LexML URN (`urn:lex:br:...`) is the canonical
   identifier for documents, routes, and citations.
3. **Honest presentation.** Partial coverage, per-page sorting, and upstream
   failures are surfaced to the reader, never hidden.

## Non-goals

- No legal advice or automated legal conclusions.
- No scraping where an official API or XML source exists. The one sanctioned
  exception is `scripts/fetch-constituicao-planalto.ts` (see its header);
  it is not precedent for more scraping.
- No secrets in the repo — Cloudflare credentials stay in the environment.

## Language and brand

- Legal source text stays in Portuguese, always. Interface chrome is
  localized through `src/lib/i18n/` (pt-BR/en).
- Blue (`liibra-link`) is functional — it means "clickable" — never
  decorative. Brass (`liibra-accent`) is decorative, never functional, at
  most one moment per view. Headings use Fraunces (`font-serif`); body and
  UI chrome use the system sans stack. Details in `docs/BRAND.md`.

## Repository conventions

- `.github/CODEOWNERS` marks governance, deployment, and `src/lib/server/`
  paths as owner-reviewed; expect PR review on changes there.
- Tests use Node's built-in runner (`tests/**/*.test.ts`); add fixtures for
  any new upstream response shape you parse.
