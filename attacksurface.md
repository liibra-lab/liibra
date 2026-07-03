# Attack Surface Inventory

Last reviewed: 2026-07-03

This file is the running human-readable inventory of Liibra-related attack surface. It is intentionally public-safe because this repository is public. Do not record secrets, private IP addresses, recovery codes, exact home-network topology, personal forwarding targets, or unpublished vendor account details here.

Machine-maintenance rules and normalized records live in [`attacksurface.ai`](attacksurface.ai). The reusable agent instructions live in [`.claude/skills/AttackSurface/SKILL.md`](.claude/skills/AttackSurface/SKILL.md), and the repeatable assessment workflow lives in [`.claude/workflows/AssessAttackSurface.md`](.claude/workflows/AssessAttackSurface.md).

## Maintenance rules

Update this file whenever any of these change:

- A public hostname, route, Worker, repository, API, database, storage bucket, DNS/mail setting, CI workflow, scheduled job, self-hosted service, or vendor account is added, removed, renamed, exposed, or decommissioned.
- Authentication changes: token, OAuth, SSH, API key, service account, password, SSO, MFA, deploy secret, or GitHub permission model.
- A service changes audience: public, internal LAN, VPN-only, token-required, OAuth-required, admin-only, or decommissioned.
- A new external data source or API dependency is added.
- A control is added or removed: CSP, HSTS, WAF/rate limit, firewall, branch rules, CODEOWNERS, Dependabot, secret scanning, logging, backups, Tailscale, or monitoring.

Use the status terms exactly:

| Status | Meaning |
| --- | --- |
| Verified | Confirmed from repository files, deployed config, dashboard, or direct command output. |
| Partially verified | Some facts are confirmed, but important config still needs dashboard or runtime verification. |
| Needs verification | Known from planning or prior operator notes, not confirmed in the current audit pass. |
| Planned | Not deployed yet. Keep it out of threat models for production until it exists. |
| Decommissioned | Previously used or referenced; confirm tokens, routes, DNS, webhooks, and env vars are removed. |

## Audience and exposure vocabulary

| Audience | Definition |
| --- | --- |
| Public | Internet-reachable without authentication. |
| Public, no write path | Internet-reachable, but intended to serve only static/rendered/public data. |
| Public, token required | Internet-reachable API or admin surface requiring a bearer token, API key, signed request, or equivalent. |
| OAuth required | Access delegated through a third-party OAuth identity flow. |
| Internal LAN | Reachable only from the local network. Must still be treated as exposed to every device on that LAN. |
| VPN-only | Reachable only through Tailscale or equivalent private overlay. |
| Localhost only | Bound only to loopback on one machine. |
| Maintainer-only | Accessible only to repository or vendor administrators. |
| Decommissioned | Should not be reachable. Any live route is a finding. |

## Assessment cadence policy

| Criticality | Examples | Recommended testing frequency |
| --- | --- | --- |
| Critical | Domain/DNS, Cloudflare account, GitHub org/repo admin, deploy secrets, public auth/session systems, production databases | Monthly, plus after every deployment/auth/DNS change |
| High | Public website, public API routes, CI workflows, external API ingestion, email authentication, self-hosted admin UIs | Quarterly, plus after meaningful dependency/config changes |
| Medium | Internal LAN services, VPN-only tools, local model APIs, analytics, content ingestion scripts | Every 6 months, plus after exposure changes |
| Low | Offline datasets, local-only dev tooling, static prototypes with no secrets or persistence | Annually, or before publishing |
| Decommissioned | Former vendors, old deploy targets, stale routes, disabled apps | Confirm removal once per quarter until fully cleared from DNS, secrets, webhooks, and docs |

## Current inventory summary

| ID | Surface | Things deployed / in scope | Type | Hosting model | Auth into platform | Audience / exposure | Status | Criticality | Test frequency |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AS-001 | GitHub organization and repositories | `liibra-lab/liibra`, `liibra-lab/dark-liibra`, GitHub Actions, Dependabot, CODEOWNERS, PR review process | Source control, CI, supply chain | Third-party SaaS | GitHub account/OAuth; admin/write permissions; repository tokens for Actions | Public repositories; maintainer-only write/admin | Partially verified | Critical | Monthly + every workflow/permission change |
| AS-002 | Liibra public website | `liibra.com.br` Worker-backed SvelteKit app, static assets, server-rendered routes | Web property | Third-party edge compute | Cloudflare account and Wrangler API token/account binding | Public, no write path | Partially verified | High | Quarterly + every deploy/routing change |
| AS-003 | Liibra server-side API integrations | LexML SRU client, Câmara Dados Abertos client, server-only external fetch boundary | API dependency / ingestion | Third-party public APIs consumed by Cloudflare Worker | No app auth to upstream APIs; deploy/auth via Cloudflare only | Public website triggers server-side egress; upstream APIs public | Verified from repo, runtime still needs verification | High | Quarterly + every data-source change |
| AS-004 | Cloudflare zone and edge controls | DNS for `liibra.com.br`, Worker route bindings, HTTPS redirects, Email Routing, Web Analytics/RUM, future WAF/rate limits | DNS, CDN, edge security, mail routing | Third-party SaaS | Cloudflare account; API tokens for deploy | Public DNS/web; maintainer-only admin | Needs verification | Critical | Monthly + every DNS/mail/route change |
| AS-005 | `dark-liibra` browser game | Browser RPG prototype using Next.js, React, Phaser, Vercel Analytics/Speed Insights dependency, intended `/dark` or `dark.liibra.com.br` surface | Web property / game client | Third-party or static host; current host not verified | Hosting vendor account; GitHub repo write access | Unknown until deployment is verified | Partially verified from repo only | Medium until public, High once public | Every 6 months; quarterly once public |
| AS-006 | Legacy / stale Vercel surface | Previous Vercel deployment target, analytics references, possible stale project/env vars/webhooks | Web hosting / analytics | Third-party SaaS | Vercel account/OAuth/GitHub integration | Should be decommissioned unless intentionally retained | Needs verification | Medium | Quarterly until removed/confirmed clean |
| AS-007 | Domain email forwarding | Cloudflare Email Routing for `@liibra.com.br`, SPF/DKIM/DMARC policy, forwarding to private mailbox | Mail routing / anti-spoofing | Third-party SaaS | Cloudflare account; destination mailbox account | Public mail receiving surface; maintainer-only admin | Needs verification | High | Quarterly + every DNS/mail change |
| AS-008 | Personal LAN server | Ubuntu server used for Pi-hole/DNS and planned local services; exact host/IP omitted from public repo | Self-hosted infrastructure | Self-hosted on private LAN | SSH keys, local sudo, service admin passwords | Internal LAN; VPN-only if exposed through Tailscale | Needs verification | High | Quarterly; monthly if any public/VPN exposure exists |
| AS-009 | Pi-hole / local DNS resolver | Pi-hole FTL/admin UI, DNS service, optional Unbound recursive resolver | DNS infrastructure / admin UI | Self-hosted | Pi-hole admin password; SSH/local sudo | Internal LAN only; never public | Needs verification | High | Quarterly + every firewall/router change |
| AS-010 | Local AI stack | Ollama container, Open WebUI planned, model APIs, local tool agents | API / admin UI / local compute | Self-hosted on workstation/server | Local OS account, container access, WebUI auth if enabled | Localhost/Internal LAN/VPN-only depending binding | Needs verification | Medium | Every 6 months + every exposure/tooling change |
| AS-011 | Developer workstation | Fedora workstation, SSH keys, Git credentials, Cloudflare/GitHub/Vercel CLIs, local env files | Endpoint / secret storage | Self-managed endpoint | OS login, SSH agent, browser sessions, CLI tokens | Local physical/user boundary | Needs verification | Critical because it holds deploy credentials | Monthly checklist; after compromise suspicion |
| AS-012 | External data/storage sources | Kaggle LexML dataset, future dados.gov.br/Senado ingestion, downloaded legal corpora | Data ingestion / offline dataset | Third-party source + local/cloud storage | Vendor account for downloads; none for public APIs unless introduced | Offline/internal until published | Planned/needs verification | Medium | Every 6 months + before publication/ingestion automation |
| AS-013 | Future Cloudflare data plane | Planned D1/KV/R2/Cron/Queues for cached legal text and refresh jobs | Database/object storage/API jobs | Third-party edge data services | Cloudflare account/API token; Worker bindings | Public reads through Worker; maintainer-only writes/jobs | Planned | Critical once deployed | Monthly once production data exists |

## Detailed records

### AS-001 — GitHub organization and repositories

**What it uses**

- GitHub public repositories: `liibra-lab/liibra` and `liibra-lab/dark-liibra`.
- GitHub Actions CI for `liibra`.
- Dependabot for npm and GitHub Actions in `liibra`.
- CODEOWNERS for governance, deployment, package, workflow, and server-side paths.
- `SECURITY.md` for private vulnerability reports.

**Everything deployed or represented here**

- `liibra-lab/liibra`: main legal-information application and Cloudflare Workers deployment source.
- `liibra-lab/dark-liibra`: browser RPG prototype source.
- Actions workflows and dependency lockfiles that influence supply-chain integrity.

**Authentication and authorization**

- Maintainer access is through GitHub account/OAuth.
- GitHub Actions uses the repository token at workflow runtime.
- Any Cloudflare/Vercel/Kaggle/vendor tokens stored in GitHub secrets would be in scope, but their existence must be verified in GitHub settings.

**Current defenses**

- `liibra` CI sets `permissions: contents: read`.
- Dependabot is configured weekly for npm and GitHub Actions.
- CODEOWNERS protects `.github/`, workflows, `wrangler.jsonc`, package files, `src/hooks.server.ts`, and `src/lib/server/`.
- `SECURITY.md` requests private reporting.

**Common issues / misconfigurations**

- GitHub Actions token left with write permissions.
- PR workflows running untrusted code with write-capable secrets.
- Stale deploy secrets after vendor migration.
- Missing branch protection/ruleset on `main`.
- Unpinned third-party Actions or unreviewed workflow changes.
- Public repo leaking `.env`, keys, service account JSON, private URLs, or personal infrastructure details.

**Open verification tasks**

- Confirm `main` branch ruleset: PR required, status checks required, signed commits if desired, force-push disabled, deletion disabled.
- Confirm GitHub secret scanning and push protection availability/settings.
- Confirm Actions secrets list and remove any stale Vercel or broad Cloudflare tokens.
- Confirm organization/account MFA.

### AS-002 — Liibra public website

**What it uses**

- SvelteKit, Vite, TypeScript, Tailwind CSS v4.
- `@sveltejs/adapter-cloudflare`.
- Cloudflare Workers serving `.svelte-kit/cloudflare/_worker.js` plus assets.
- `fast-xml-parser` for XML parsing of legal data responses.

**Everything deployed or represented here**

- Public website for open Brazilian legal information.
- Search and proposition-browsing pages.
- SvelteKit routes and server-side load functions.
- Static brand assets and self-hosted font assets.

**Authentication and authorization**

- No public user login or write path is currently documented.
- Deploy requires Cloudflare credentials in the environment.
- Repository states `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are required for deploy; do not store them in git.

**Current defenses**

- `workers_dev` is disabled.
- Worker preview URLs are disabled.
- Baseline headers set by `src/hooks.server.ts`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.
- External data requests are centralized in server-only modules.
- Build/test/lint/check gate exists.

**Common issues / misconfigurations**

- Missing or broken route binding in Cloudflare causing unexpected exposure or downtime.
- Missing CSP/HSTS.
- Hydration or analytics scripts requiring CSP exceptions that are too broad.
- Accidentally enabling `workers.dev` or preview URLs.
- Logging raw legal API payloads, private headers, or user queries in excessive detail.
- Cache poisoning if request URL normalization is loose.
- Unbounded user-driven upstream calls.

**Open verification tasks**

- Confirm live Cloudflare routes for apex and `www`.
- Confirm HTTPS redirect, HSTS status, and whether preload is appropriate.
- Add and test CSP.
- Confirm Cloudflare Web Analytics configuration and whether RUM script is automatically injected.
- Add WAF/rate limiting for search routes when traffic grows.

### AS-003 — Liibra server-side API integrations

**What it uses**

- LexML SRU endpoint: `https://www.lexml.gov.br/busca/SRU`.
- Câmara Dados Abertos API base: `https://dadosabertos.camara.leg.br/api/v2`.
- Cloudflare edge cache and `cf.cacheTtl` hints.
- Server-only client modules.

**Everything deployed or represented here**

- Legal document search through LexML SRU.
- Legislative proposition browsing through Câmara Dados Abertos.
- XML/JSON parsing and typed error handling.

**Authentication and authorization**

- Upstream APIs are public and do not require Liibra-owned credentials.
- The public website triggers server-side requests. Users do not receive upstream credentials.

**Current defenses**

- LexML CQL builder emits only whitelisted indexes and escapes every user value.
- Search page size is capped.
- Empty/unsafe LexML queries return safe warnings.
- Upstream failures become warnings or typed errors instead of raw exceptions to the page.
- Câmara URL construction is centralized on a fixed base URL.
- Only successful upstream responses are cached.

**Common issues / misconfigurations**

- SSRF introduced by accepting arbitrary upstream URLs.
- CQL injection or unescaped query fragments.
- XML parser abuse, oversized payloads, or entity-expansion hazards.
- Upstream API outages causing public route failure.
- Cache storing attacker-influenced or error responses.
- Missing attribution/integrity guarantees for legal text.

**Open verification tasks**

- Verify SRU `explain` contract and supported indexes.
- Add fixture tests from live SRU responses.
- Add maximum XML/JSON body-size assumptions if runtime allows.
- Track upstream failure/cache-hit metrics once observability is added.

### AS-004 — Cloudflare zone and edge controls

**What it uses**

- Cloudflare DNS for `liibra.com.br`.
- Cloudflare Workers route bindings.
- Cloudflare SSL/TLS, redirect rules, Web Analytics, Email Routing, and possible future WAF/rate limits.

**Everything deployed or represented here**

- Apex/root public web property.
- `www` redirect behavior.
- Email routing for the domain.
- Possible `dark.liibra.com.br` game route once deployed.

**Authentication and authorization**

- Cloudflare dashboard account.
- Wrangler/API token for deploy.
- DNS and mail changes are maintainer-only.

**Current defenses**

- Worker config disables `workers.dev` and preview URLs.
- HTTPS and `www` redirect rules were previously planned/created; verify dashboard state.
- No long-running origin server is required for `liibra`.

**Common issues / misconfigurations**

- Broad API tokens with full-account permissions.
- Stale DNS records pointing to old vendors.
- `www`/apex mismatch causing duplicate properties or stale deployments.
- Email records allowing spoofing due to weak SPF/DKIM/DMARC.
- Over-broad WAF bypass rules.
- RUM/analytics script interacting badly with CSP/SRI.

**Open verification tasks**

- Confirm DNS records: apex, `www`, mail routing, TXT records.
- Confirm SSL/TLS mode, Always Use HTTPS, HSTS, minimum TLS, and redirect rules.
- Confirm no stale Vercel/Page routes remain active.
- Create narrow deploy token scoped only to the needed Worker/account resources.

### AS-005 — `dark-liibra` browser game

**What it uses**

- Next.js, React, Phaser 3.
- Vercel Analytics and Speed Insights dependencies are present in the repo.
- README describes a browser RPG prototype and a build output intended for `/dark`.

**Everything deployed or represented here**

- Browser game client.
- Game scene, entities, particles, HUD, projectiles, and constants.
- No database or authenticated backend verified yet.

**Authentication and authorization**

- End users should not authenticate for the prototype unless a future account system is added.
- Deploy/admin authentication depends on the hosting vendor, which is not verified.

**Current defenses**

- No production controls verified from repository files.
- No CI workflow verified.

**Common issues / misconfigurations**

- Public prototype deployed from stale dependencies or without CI.
- Analytics scripts added without CSP/privacy review.
- Asset pipeline serving untrusted third-party files.
- Future leaderboard/account features introducing auth, database, or API risks.
- Mismatch between README deployment model and actual package scripts.

**Open verification tasks**

- Confirm whether the game is currently deployed, and where.
- Decide final host: `dark.liibra.com.br`, `/dark`, or separate Workers project.
- Add CI and dependency audit.
- Add basic security headers/CSP if served through Next/Worker.
- Remove Vercel dependencies if Vercel is not the chosen vendor.

### AS-006 — Legacy / stale Vercel surface

**What it uses**

- Previous Vercel deployment target and possible GitHub integration.
- Vercel analytics packages still exist in `dark-liibra`.

**Everything deployed or represented here**

- Any old Vercel project connected to Liibra or Dark Liibra.
- Any old preview/production deployment URLs.
- Any Vercel environment variables, GitHub webhooks, and OAuth app grants.

**Authentication and authorization**

- Vercel account/OAuth/GitHub integration.

**Current defenses**

- None verified in the current repository audit pass.

**Common issues / misconfigurations**

- Stale deploy still reachable through an old vendor URL.
- Stale environment variables containing Cloudflare, GitHub, or API tokens.
- GitHub still granting deployment hooks to a retired vendor.
- DNS still pointing to old deployment.

**Open verification tasks**

- Confirm whether any Vercel projects remain.
- Remove stale env vars and GitHub app access.
- Remove or document any intentionally retained Vercel analytics dependency.

### AS-007 — Domain email forwarding

**What it uses**

- Cloudflare Email Routing.
- MX/TXT records for receiving and anti-spoofing.
- Private destination mailbox; do not record the destination address in this public file.

**Everything deployed or represented here**

- `@liibra.com.br` inbound routing.
- SPF/DKIM/DMARC DNS posture.

**Authentication and authorization**

- Cloudflare account controls routing.
- Destination mailbox account controls final receipt.

**Current defenses**

- Email Routing exists/planned from prior setup notes, but current DNS state needs verification.

**Common issues / misconfigurations**

- Missing MX means mail is not received.
- Weak SPF or missing DKIM/DMARC means spoofing is easier.
- DMARC policy stuck at `p=none` indefinitely.
- Forwarding target leaks in public docs.
- Destination mailbox compromise exposes project mail.

**Open verification tasks**

- Confirm MX records required by Cloudflare Email Routing.
- Confirm SPF includes the right sender policy for actual senders.
- Confirm DKIM for any outbound sender used for `liibra.com.br`.
- Start DMARC with reporting, then move toward quarantine/reject when confident.

### AS-008 — Personal LAN server

**What it uses**

- Ubuntu server on private LAN.
- SSH administration.
- Pi-hole/DNS role currently in scope; file/media server, backup server, Tailscale, OpenMediaVault, Git server, and local dashboards have been discussed as possible roles.

**Everything deployed or represented here**

- Internal infrastructure supporting home network and development.
- Do not record exact IP, router identifiers, physical address, or private hostnames in this public repo.

**Authentication and authorization**

- SSH keys and local sudo.
- Service-specific admin passwords where applicable.
- Tailscale identity if VPN access is enabled.

**Current defenses**

- Intended posture: no public WAN exposure, no DMZ, firewall restricted to LAN/VPN.
- Exact firewall and router state must be verified from the host/router.

**Common issues / misconfigurations**

- SSH reachable from the WAN.
- Password login enabled unexpectedly.
- UFW allowing DNS/admin ports from everywhere, including IPv6.
- Tailscale exit/node sharing wider than intended.
- Unpatched Ubuntu or containers.
- NAS/file shares writable by untrusted LAN devices.

**Open verification tasks**

- Confirm SSH: key-only, no root login, limited users.
- Confirm UFW IPv4 and IPv6 rules.
- Confirm router has no port forwards or DMZ to this host.
- Confirm updates, unattended security upgrades, backups, and monitoring.

### AS-009 — Pi-hole / local DNS resolver

**What it uses**

- Pi-hole FTL and web/admin interface.
- Optional Unbound recursive resolver.
- Router DHCP/DNS distribution to LAN clients.

**Everything deployed or represented here**

- LAN DNS resolution and filtering.
- Potential admin UI on HTTP/HTTPS.

**Authentication and authorization**

- Pi-hole admin password.
- SSH/local sudo for host-level changes.

**Current defenses**

- Intended LAN-only exposure.
- Router/static IP and firewall work were previously discussed; current state must be verified.

**Common issues / misconfigurations**

- Open resolver exposed to the Internet.
- Admin UI exposed without VPN.
- DNS rebinding protection conflicting with legitimate internal names.
- IPv6 DNS path bypassing Pi-hole.
- Upstream resolver failures causing outage.

**Open verification tasks**

- Verify DNS ports are LAN-only on IPv4 and IPv6.
- Verify admin UI is LAN-only or VPN-only.
- Verify router advertises Pi-hole for IPv4 and IPv6 DNS.
- Verify NTP/system time health because DNSSEC and logs depend on time.

### AS-010 — Local AI stack

**What it uses**

- Ollama in a container.
- Local models and OpenAI-compatible API endpoints.
- Open WebUI and agent tooling planned/partially deployed.

**Everything deployed or represented here**

- Local model-serving API.
- Browser/admin UI if Open WebUI is enabled.
- Possible tool agents with access to local files, shell, GitHub, or web.

**Authentication and authorization**

- Ollama itself should be treated as unauthenticated unless fronted by an authenticated UI/proxy.
- Open WebUI should enforce user auth if exposed beyond localhost.
- Container host access remains controlled by OS login and group membership.

**Current defenses**

- Intended local/LAN-only posture.
- No public exposure should exist.

**Common issues / misconfigurations**

- Model API bound to all interfaces and reachable by the LAN or WAN.
- Open WebUI exposed without strong auth.
- Agents given shell/GitHub/API access without per-tool boundaries.
- Prompt logs containing secrets or project data.
- Containers running with excessive privileges or mounted host paths.

**Open verification tasks**

- Confirm bind addresses for model APIs and UIs.
- Confirm firewall blocks public access.
- Confirm Open WebUI auth and registration settings.
- Confirm container mounts and GPU access are minimal.

### AS-011 — Developer workstation

**What it uses**

- Fedora workstation used for development and administration.
- Git, SSH keys, GitHub session, Cloudflare Wrangler, local env files, package managers, containers, and browser sessions.

**Everything deployed or represented here**

- Not a public service, but it is a critical control point for deploy credentials.

**Authentication and authorization**

- OS login, SSH agent, browser sessions, CLI tokens.

**Current defenses**

- Not verified in this repository pass.

**Common issues / misconfigurations**

- Long-lived broad API tokens in shell history or dotfiles.
- Private keys without passphrases.
- Secrets committed through local git.
- Browser session compromise giving access to GitHub/Cloudflare.
- Containers or local AI agents reading sensitive directories.

**Open verification tasks**

- Inventory `~/.ssh`, CLI tokens, and env files locally without publishing secrets.
- Confirm disk encryption and screen lock.
- Rotate broad tokens into least-privilege scoped tokens.
- Keep separate profiles for personal/admin browsing if practical.

### AS-012 — External data/storage sources

**What it uses**

- Kaggle LexML dataset and public legal-data sources under consideration.
- Future dados.gov.br and Senado integrations.
- Possible local or cloud storage for bulk corpora.

**Everything deployed or represented here**

- Not production-deployed unless ingestion/storage is wired into the Worker or a database.

**Authentication and authorization**

- Kaggle account/token if using Kaggle CLI.
- Public APIs generally do not require credentials unless rate-limited endpoints are introduced.

**Current defenses**

- Not yet production-ingested.

**Common issues / misconfigurations**

- Treating third-party dataset copies as authoritative without source attribution.
- Publishing stale or corrupted legal text.
- Storing large corpora in public buckets by mistake.
- Leaking Kaggle credentials in scripts or env files.

**Open verification tasks**

- Decide storage location and access policy before downloading large datasets.
- Record dataset license/source/update cadence.
- Add checksum or provenance tracking for ingested files.

### AS-013 — Future Cloudflare data plane

**What it uses**

- Planned D1/KV/R2/Cron/Queues for parsed legal text and refresh jobs.

**Everything deployed or represented here**

- Nothing verified as deployed yet.

**Authentication and authorization**

- Cloudflare account and Worker bindings.
- Public reads should go through Worker routes; direct storage writes should be maintainer/job-only.

**Current defenses**

- Planned architecture only.

**Common issues / misconfigurations**

- Public bucket/object exposure.
- Cron jobs writing corrupt data without validation.
- No backup/restore path for D1.
- No separation between raw upstream data, parsed canonical data, and rendered public data.
- Missing migration discipline.

**Open verification tasks**

- Add data classification before first production store.
- Define backup/export/restore procedure.
- Define read/write bindings and least-privilege deployment roles.

## Immediate prioritized gaps

| Priority | Gap | Surface | Why it matters |
| --- | --- | --- | --- |
| P0 | Verify Cloudflare DNS/routes/email and remove stale Vercel routes/tokens | AS-004, AS-006, AS-007 | Domain and deploy control are critical. Stale vendors are common takeover paths. |
| P0 | Confirm GitHub `main` branch protection/ruleset and secret scanning/push protection | AS-001 | Prevents accidental or malicious changes to deploy/supply-chain paths. |
| P1 | Add tested CSP and HSTS | AS-002 | Current headers are useful but not complete for a public web property. |
| P1 | Verify local server firewall, IPv6, router port forwards, and SSH auth | AS-008, AS-009 | Internal services become high-risk if accidentally reachable from WAN or broad IPv6. |
| P1 | Decide and document `dark-liibra` hosting model | AS-005 | Current repo/deployment story is ambiguous. Security posture depends on host. |
| P2 | Add WAF/rate limit/abuse protection for search routes when traffic grows | AS-002, AS-003 | Protects upstream APIs and Worker costs. |
| P2 | Define backup/restore and access model before D1/KV/R2 adoption | AS-013 | Easier to design safely before data exists. |

## Assessment templates

### New surface intake

```text
Surface ID:
Name:
Owner:
Status: Verified | Partially verified | Needs verification | Planned | Decommissioned
Asset type: Web property | API | Database | DNS | Mail | CI/CD | Endpoint | Self-hosted service | Dataset
Hosting model: Third-party SaaS | Third-party edge | Self-hosted | Local-only
Public hostnames/routes:
Internal hostnames/routes: Do not commit private details to a public repo.
Authentication into platform:
Runtime authentication for users/clients:
Data handled:
Secrets involved:
Current defenses:
Known gaps:
Common platform misconfigurations:
Criticality:
Testing frequency:
Last assessed:
Next assessment due:
Evidence links:
```

### Assessment result

```text
Scope:
Date:
Assessor:
Evidence reviewed:
Exposure confirmed:
Controls confirmed:
Findings:
  - ID:
    Severity:
    Surface:
    Evidence:
    Impact:
    Recommendation:
    Owner:
    Due:
Residual risk:
Next assessment date:
```
