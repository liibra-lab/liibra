# AttackSurface Skill

Use this skill when a task touches Liibra infrastructure, deployment, hosting, DNS, mail, CI/CD, external APIs, databases, storage, self-hosted services, local AI tooling, or security posture.

## Purpose

Maintain a current, public-safe attack-surface inventory for Liibra and related systems.

Primary files:

- `attacksurface.md` — human-readable running inventory.
- `attacksurface.ai` — normalized machine-maintained state.
- `.claude/workflows/AssessAttackSurface.md` — repeatable assessment workflow.

## Trigger conditions

Invoke this skill when any request includes or implies:

- New deployment target, host, subdomain, route, Worker, function, API, database, bucket, queue, cron job, mail route, DNS record, or analytics integration.
- New vendor or retired vendor: Cloudflare, GitHub, Vercel, Kaggle, Google, home server, Tailscale, or similar.
- Authentication or authorization changes: OAuth app, API token, SSH key, deploy key, CI secret, service account, MFA, admin UI, user login, or access policy.
- Exposure change: public, internal LAN, VPN-only, localhost, token-required, OAuth-required, admin-only, or decommissioned.
- External data source or ingestion change: LexML, Câmara, Senado, dados.gov.br, Kaggle, or future corpus storage.
- Security control change: CSP, HSTS, WAF, rate limit, firewall, secret scanning, branch protection, Dependabot, CODEOWNERS, logging, backups, or monitoring.
- User asks to assess, review, harden, enumerate, map, audit, or test an attack surface.

## Public-safety rule

This repository is public. Never add these details to `attacksurface.md`, `attacksurface.ai`, commits, PR descriptions, or issue bodies:

- Secrets, tokens, keys, passwords, recovery codes, cookies, session values, private key material, or masked variants that reveal structure.
- Private IP addresses, exact LAN hostnames, router serials, physical addresses, personal mailbox forwarding destinations, or account recovery methods.
- Vendor account IDs unless already public and required for non-sensitive documentation.
- Screenshots or logs containing secrets, personal account details, or private infrastructure coordinates.

Use placeholders such as `private LAN server`, `private mailbox forwarding target`, or `Cloudflare account/API token`.

## Inventory update procedure

1. Read `attacksurface.md` and `attacksurface.ai` before making changes.
2. Identify the affected surface ID. If none exists, create the next `AS-###` record.
3. Update both files in the same change:
   - `attacksurface.md` gets the readable narrative and tables.
   - `attacksurface.ai` gets the normalized record.
4. Preserve status terms exactly:
   - `Verified`
   - `Partially verified`
   - `Needs verification`
   - `Planned`
   - `Decommissioned`
5. Preserve exposure vocabulary exactly:
   - `Public`
   - `Public, no write path`
   - `Public, token required`
   - `OAuth required`
   - `Internal LAN`
   - `VPN-only`
   - `Localhost only`
   - `Maintainer-only`
   - `Decommissioned`
6. Record what changed in `attacksurface.ai` under `change_log`.
7. Do not mark anything `Verified` unless evidence was reviewed during this task.
8. If a fact is known from prior discussion but not directly verified, use `Needs verification` or `Partially verified`.

## Required fields for every surface

Every surface must answer:

- What is deployed there?
- What technology does it use?
- Is it self-hosted, third-party SaaS, third-party edge, or local-only?
- How do maintainers authenticate into it?
- How do users or clients authenticate at runtime, if at all?
- Is it a web property, API, database, DNS, mail, CI/CD, source control, endpoint, dataset, self-hosted service, or admin UI?
- Who can reach it: public, internal, VPN-only, localhost-only, token-required, OAuth-required, maintainer-only, or decommissioned?
- What defenses are already in place?
- What common platform misconfigurations apply?
- What needs verification?
- What criticality and testing frequency apply?

## Assessment rules

When assessing a surface:

- Start passive: repo files, configuration, docs, dashboard-export text, DNS records supplied by the user, command output supplied by the user.
- Do not run destructive tests.
- Do not run denial-of-service, brute force, credential stuffing, social engineering, exploit attempts against third parties, or tests outside owned systems.
- For public endpoints, prefer safe HTTP header/DNS/config review over invasive scans.
- For self-hosted services, require explicit user authorization before suggesting active network scans. Keep scan scope narrow.
- Separate confirmed findings from hypotheses.
- Include remediation priority, owner, and retest frequency.

## Criticality rules

Use `Critical` when compromise could affect domain control, deploy control, GitHub admin, Cloudflare admin, production data, secrets, or trusted legal-content integrity.

Use `High` when the surface is public, routable, handles mail/DNS, handles external data ingestion, or exposes admin functionality internally.

Use `Medium` when exposure is internal/VPN/local but compromise could pivot to secrets, admin tools, or service disruption.

Use `Low` when the asset is offline, static, non-sensitive, and has no privileged credentials or runtime exposure.

Use `Decommissioned` for retired vendors/routes until their DNS, secrets, webhooks, OAuth grants, and docs are confirmed removed.

## Frequency rules

- Critical: monthly, plus after every deployment/auth/DNS change.
- High: quarterly, plus after meaningful dependency/config changes.
- Medium: every 6 months, plus after exposure changes.
- Low: annually, or before publishing.
- Decommissioned: confirm removal once per quarter until fully cleared.

## Output expectations

When completing a task that changes the attack surface, summarize:

- Surfaces added/changed.
- Status changes.
- New or retired exposure.
- Controls added or removed.
- Verification gaps that remain.
- Recommended next assessment date.

Keep the final response short unless the user asks for the full assessment text.
