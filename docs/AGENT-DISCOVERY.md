# Agent discovery

This file owns the standing rules for Liibra's machine/agent discovery
surface: what is published, what lives outside the repository, and what is
deliberately absent. When this surface changes, update this file, the
attack-surface inventory (`attacksurface.md`, `attacksurface.ai`), and the
tests that pin the published contract.

## Published (in this repository)

| Resource | Where | Contract |
| --- | --- | --- |
| `Link` response header (RFC 8288) | `src/hooks.server.ts`, value in `src/lib/discovery/api-catalog.ts` | Advertises `api-catalog`, `service-doc`, and `service-desc` relations on every SvelteKit-handled response. |
| `/.well-known/api-catalog` (RFC 9727) | `src/routes/.well-known/api-catalog/+server.ts` | `application/linkset+json`; one linkset entry per API, anchored at the API base, linking its OpenAPI description and human docs. |
| `/docs/api/openapi.json` | `static/docs/api/openapi.json` | OpenAPI 3.1 description of the URN resolver (`/urn/{urn}` → 308) and the document page (`/doc/{urn}`). |
| `/docs/api` | `src/routes/docs/api/+page.svelte` | Human-readable machine-access documentation (localized pt-BR/en). |

Contracts are pinned by `tests/api-catalog.test.ts` (catalog shape, OpenAPI
file consistency) and the agent-discovery smoke tests in `e2e/smoke.spec.ts`
(header present, catalog resolvable end-to-end on the built Worker).

Everything published is public and read-only; there is no authenticated or
write-capable machine surface.

## Requires Cloudflare dashboard / DNS work (not deployable from this repo)

- **Markdown for Agents** — Cloudflare zone-level feature that serves a
  markdown rendition of HTML pages to clients sending `Accept: text/markdown`.
  Enable it in the Cloudflare dashboard for `liibra.com.br`; no Worker code is
  involved. (docs: developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
- **DNS-AID** (draft-mozleywilliams-dnsop-dnsaid) — DNS-based agent discovery
  via ServiceMode SVCB/HTTPS records under `_index._agents.liibra.com.br`
  (and protocol-specific labels such as `_a2a._agents`), plus DNSSEC signing
  of the zone. Publish these only when there is an actual agent endpoint to
  advertise; today Liibra has none, so no records exist yet. DNSSEC signing
  is worth enabling regardless.

Both are maintainer actions tracked against surface AS-004 (Cloudflare zone)
in the attack-surface inventory.

## Deliberately absent

Discovery metadata must describe capabilities that actually exist. These are
intentionally not published, and none of them should be added without the
capability itself landing first:

- **OAuth/OIDC discovery** (`/.well-known/openid-configuration`,
  `/.well-known/oauth-authorization-server`), **OAuth Protected Resource
  Metadata** (`/.well-known/oauth-protected-resource`), and **auth.md** —
  Liibra has no protected APIs, no user accounts, and no issuer. Publishing
  issuer/token metadata for a site with nothing to authenticate against
  would be false advertising to agents.
- **MCP Server Card** (`/.well-known/mcp/server-card.json`) — there is no MCP
  server. If one is ever added it must run on Workers (edge-first invariant)
  and the card lands in the same change.
- **Agent Skills index** (`/.well-known/agent-skills/index.json`) — no
  published skills yet. The `.claude/skills/` directory holds repo-internal
  maintenance skills, not site capabilities for third-party agents.
- **WebMCP** (`navigator.modelContext`) — draft browser API still in origin
  trial; Liibra's pages are server-rendered and the machine surface is
  URL-addressed, so there are no in-page tools to expose yet. Revisit when
  the API stabilizes.

## robots.txt policy — training crawlers vs. interactive agents

Decided 2026-07-07: `static/robots.txt` distinguishes the two classes.

- **Allowed** — user-triggered agent fetchers and AI search indexers from
  OpenAI and Anthropic (`ChatGPT-User`, `OAI-SearchBot`, `Claude-User`,
  `Claude-Web`, `Claude-SearchBot`). They act on behalf of a user asking
  about Brazilian law, which is exactly what the agent-discovery surface
  above exists for.
- **Disallowed** — training/scraping crawlers (`GPTBot`, `ClaudeBot`,
  `anthropic-ai`, `CCBot`, `Google-Extended`, `PerplexityBot`,
  `Applebot-Extended`, `Bytespider`, `Amazonbot`, `Meta-ExternalAgent`).

Security posture is unchanged: robots.txt is advisory, and the whole site
is public and read-only regardless — it was never an access control. The
operational consideration is upstream load (agent-driven hits on `/search`
fan out to LexML/Câmara), which is already tracked as the WAF/rate-limit
gap under AS-002/AS-003 in the attack-surface inventory. The policy is
pinned by `tests/robots.test.ts`; change that test and this file together.
