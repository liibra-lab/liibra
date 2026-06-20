# Liibra

Liibra is a SvelteKit application for open access to Brazilian legal information.
It is deployed to Cloudflare Workers and currently integrates public legal data from LexML Brasil and the Brazilian Chamber of Deputies Open Data API.

## Scope

Liibra is an independent civic/legal information project. It is not an official government service and does not provide legal advice.

Current scope:

- Search Brazilian legal documents through LexML SRU.
- Browse legislative propositions from the Chamber of Deputies Open Data API.
- Preserve source attribution and official links for verification.
- Keep legal source text in Portuguese; interface chrome may be localized.

Out of scope for this repository:

- Long-running Node server deployment.
- Private legal advice or automated legal conclusions.
- Storage of Cloudflare credentials or other secrets.

## Stack

- SvelteKit
- Vite
- TypeScript
- Tailwind CSS v4
- Cloudflare Workers
- `@sveltejs/adapter-cloudflare`
- npm with `package-lock.json`

## Requirements

- Node `22` — see `.nvmrc`.
- npm, using the committed `package-lock.json`.
- Cloudflare Wrangler for Workers build and deploy commands.

## Development

```sh
npm install
npm run dev
```

Local development uses the Vite dev server.

## Quality checks

Run the full local gate before opening a pull request or deploying:

```sh
npm run check
npm run lint
npm test
npm run build
```

Script summary:

| Script | Purpose |
| --- | --- |
| `npm run check` | Generate/check Wrangler types, sync SvelteKit, and run `svelte-check`. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run Node's built-in test runner against `tests/**/*.test.ts`. |
| `npm run build` | Build the Cloudflare Worker bundle. |
| `npm run preview` | Serve the built Worker locally through Wrangler. |
| `npm run deploy` | Deploy to Cloudflare Workers after `wrangler whoami`. |

## Data sources

### LexML Brasil

Liibra uses LexML's public SRU endpoint for legal document search.
The server-side LexML client builds a narrow CQL query from whitelisted fields, escapes user values, limits page size, and turns upstream failures into safe UI warnings.

### Câmara dos Deputados

Liibra uses the Câmara dos Deputados Dados Abertos API for propositions.
The server-side client centralizes the API base URL, requests JSON, uses short Cloudflare edge caching, and converts API failures into typed route errors.

## Deployment

Cloudflare Workers is the only deployment target for this repository.
The build emits a Worker bundle at:

```text
.svelte-kit/cloudflare/_worker.js
```

Deploy manually with:

```sh
npm run deploy
```

Deployment requires Cloudflare credentials in the environment:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Never commit these credentials. Keep them in the local shell, CI secrets, or Cloudflare-managed deployment environment only.

Do not connect this repository to platforms that expect a long-running Node server, such as Railway, Render, Fly, or generic Node hosting. They cannot run the Worker bundle correctly.

## Repository hygiene

This repository intentionally keeps generated and sensitive material out of git:

- `.env` and `.env.*` are ignored.
- `.wrangler`, `.svelte-kit`, build output, and dependency directories are ignored.
- `.editorconfig` defines basic editor behavior.
- `.gitattributes` normalizes line endings for cross-platform work.

## Project layout

```text
.github/CODEOWNERS     Code owner rules for sensitive paths
.github/dependabot.yml Dependency update automation
.github/workflows/     CI workflow
SECURITY.md            Private vulnerability reporting policy
src/hooks.server.ts    Request-scoped locale handling and baseline response headers
src/lib/server/        Server-only API clients and legal data parsing
src/lib/components/    Shared Svelte components
src/lib/i18n/          Interface messages and locale helpers
src/routes/            SvelteKit routes
static/                Static files served as-is
tests/                 Node test-runner tests
wrangler.jsonc         Cloudflare Workers configuration
vite.config.ts         Vite, SvelteKit, Tailwind, and Cloudflare adapter config
```

## Current security posture

Already present:

- GitHub Actions uses read-only repository contents permission.
- CI runs install, audit, type/check, lint, tests, and build.
- Worker preview URLs and `workers.dev` exposure are disabled in Wrangler config.
- Baseline headers are applied from `src/hooks.server.ts`.
- External legal data requests are centralized in server-only modules.
- Dependabot tracks npm and GitHub Actions updates.
- `CODEOWNERS` marks repository governance, deployment, package, and server-side files as owner-reviewed paths.
- `SECURITY.md` defines private vulnerability reporting.

Planned next hardening:

- Branch ruleset for `main`.
- Tested CSP and HSTS headers.
- GitHub Actions pinned to full commit SHAs.

## Legal/source disclaimer

Liibra displays public legal information with official source attribution. Always verify the authoritative text through the linked official source before relying on it.
