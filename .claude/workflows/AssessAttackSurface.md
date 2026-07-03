# AssessAttackSurface Workflow

Use this workflow to assess one or more records in `attacksurface.md` and `attacksurface.ai` thoroughly, safely, and consistently.

## Inputs

Required:

- Scope: one surface ID, several surface IDs, or a named system.
- Assessment mode: `passive`, `configuration`, `safe-active`, or `full-owned-system`.

Optional:

- Evidence provided by the user: dashboard screenshots, command output, DNS records, CI logs, repo files, vendor settings, firewall rules.
- Cost tolerance: `low`, `medium`, or `high`.
- Desired output: brief finding list, full assessment, or PR-ready remediation plan.

If the scope is ambiguous, make the safest useful assumption and document it. Do not ask for secrets.

## Modes

| Mode | Allowed work | Not allowed |
| --- | --- | --- |
| passive | Repository/config/docs review, supplied outputs, public-safe DNS/header review | Active probing beyond normal page/API fetches |
| configuration | Dashboard/config review from supplied text/screenshots, repo settings, DNS records | Credential disclosure or destructive changes |
| safe-active | Low-rate owned-host checks such as normal HTTP requests, headers, TLS, DNS resolution | DoS, brute force, exploit payloads, credential attacks |
| full-owned-system | Narrow active checks on systems explicitly owned and authorized by the user | Third-party abuse, broad scans, persistence, destructive tests |

## Procedure

### 1. Load the inventory

Read:

- `attacksurface.md`
- `attacksurface.ai`
- Relevant repo files, deployment config, workflows, package manifests, and docs.

Identify the current record status: `Verified`, `Partially verified`, `Needs verification`, `Planned`, or `Decommissioned`.

### 2. Define exact scope

For each target surface, record:

- Surface ID and name.
- Hostnames/routes/endpoints, public-safe only.
- Asset type: web, API, database, DNS, mail, CI/CD, source control, endpoint, self-hosted service, dataset, admin UI.
- Hosting model: third-party SaaS, third-party edge, self-hosted, local-only.
- Runtime audience: public, internal LAN, VPN-only, localhost-only, token-required, OAuth-required, maintainer-only, or decommissioned.
- Authentication boundary: maintainer auth and runtime/user auth.
- Data handled and likely impact.

### 3. Confirm evidence

Use evidence tiers:

| Evidence tier | Examples | Confidence |
| --- | --- | --- |
| Direct repo evidence | `wrangler.jsonc`, workflow YAML, package manifest, source code, committed docs | High for repository state |
| Runtime evidence | DNS, HTTP headers, live route behavior, Worker response, router/firewall command output | High for current exposure |
| Dashboard evidence | Cloudflare/GitHub/Vercel settings shown by user or connector | High for platform config |
| Prior notes | Conversation history or planning notes | Medium/low; mark as needs verification |
| Assumption | Inference without direct evidence | Low; never mark verified |

### 4. Threat model by platform

Check the common failure modes for the platform:

- GitHub: branch protection, Actions permissions, secret scanning, CODEOWNERS coverage, stale secrets, untrusted PR workflows, dependency update cadence.
- Cloudflare Workers: route binding, preview/workers.dev exposure, deploy token scope, CSP/HSTS, cache behavior, WAF/rate limits, logging, env vars/bindings.
- DNS/mail: stale records, takeover-prone records, SPF/DKIM/DMARC, MX routing, wildcard records, registrar/zone admin MFA.
- Public web app: headers, CSP, HSTS, XSS, open redirects, route errors, dependency state, third-party scripts, public write paths, auth/session design if present.
- External APIs/data ingestion: fixed base URL, SSRF risk, injection into query languages, parser limits, caching, attribution/integrity, failure behavior.
- Databases/storage: public exposure, direct bucket access, migrations, backups, least-privilege bindings, data retention, restore tests.
- Self-hosted LAN/VPN services: firewall, IPv6, router port forwards, admin UI exposure, SSH policy, patching, backups, Tailscale ACLs.
- Local AI/tool agents: bind address, auth, prompt/log retention, host mounts, shell/tool permissions, connector access, model API exposure.

### 5. Assess controls

For each surface, explicitly mark:

- Confirmed controls.
- Missing controls.
- Controls present but untested.
- Controls not applicable.

Use this minimum control baseline:

| Surface class | Minimum controls |
| --- | --- |
| GitHub/CI | Read-only default token, branch protection, required checks, CODEOWNERS on sensitive paths, Dependabot, secret scanning/push protection where available |
| Cloudflare/web | HTTPS, route correctness, `workers.dev`/preview policy, CSP, HSTS, secure headers, least-privilege deploy token, WAF/rate limit when appropriate |
| DNS/mail | No stale takeover-prone records, SPF, DKIM where sending exists, DMARC policy with reporting, locked registrar/Cloudflare account |
| API ingestion | Fixed upstream hosts, input escaping, bounded page/body sizes, safe errors, caching, observability |
| Database/storage | Private-by-default, Worker-only access where possible, backups, migrations, restore plan, no direct public writes |
| Self-hosted | No WAN exposure unless intended, UFW/router/Tailscale reviewed, SSH key-only, patching, backups, admin UI behind VPN/LAN |
| Local AI | Bind to localhost unless explicitly needed, auth for UI, no broad host mounts, no secrets in prompts/logs, tool permissions scoped |

### 6. Score risk and frequency

Set criticality:

- `Critical`: domain/deploy/source-control control, secrets, production data, legal-content integrity, admin workstation.
- `High`: public web/API, mail/DNS, self-hosted admin service, external ingestion that affects user-visible content.
- `Medium`: internal/VPN/local service with pivot potential.
- `Low`: offline/static/non-sensitive asset.
- `Decommissioned`: retired but not fully verified removed.

Recommend testing frequency:

- Critical: monthly, plus after every deployment/auth/DNS change.
- High: quarterly, plus after meaningful dependency/config changes.
- Medium: every 6 months, plus after exposure changes.
- Low: annually, or before publishing.
- Decommissioned: quarterly until cleared.

Adjust frequency upward when:

- Public exposure exists.
- Cost of failure is high.
- Secrets or legal-source integrity are involved.
- Controls are unverified.
- Vendor migration recently happened.
- Active development changes the surface often.

Adjust frequency downward only when the surface is offline, static, or fully decommissioned and verified.

### 7. Produce findings

Use this format:

```text
Finding ID:
Surface:
Severity: Critical | High | Medium | Low | Info
Status: Confirmed | Likely | Needs verification
Evidence:
Impact:
Recommendation:
Owner:
Suggested due date:
Retest:
```

Severity guidance:

- Critical: compromise of domain, GitHub admin, Cloudflare admin, deploy path, production data, secrets, or trusted legal text.
- High: public exposure, auth bypass, missing branch protection on active repo, public admin UI, open DNS resolver, mail spoofing posture failure.
- Medium: internal-only misconfiguration, missing hardening header, stale dependency without known exploit, logging/observability gap.
- Low: documentation mismatch, planned item needing design, minor hardening.
- Info: confirmed control or non-issue.

### 8. Update inventory

After assessment:

- Update `attacksurface.md` if facts, controls, gaps, status, criticality, or frequency changed.
- Update `attacksurface.ai` with matching normalized fields.
- Add a `change_log` entry in `attacksurface.ai`.
- Do not move a status to `Verified` unless direct evidence was reviewed.

### 9. Final response template

```text
Assessed: <surfaces>
Changed files: <files>
Confirmed controls: <short list>
Findings: <count by severity>
Highest priority next actions:
1. <action>
2. <action>
3. <action>
Remaining verification gaps: <short list>
Recommended next review: <date/frequency>
```

Keep private details out of the final response when the repository or chat output may be reused publicly.
