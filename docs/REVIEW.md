# Review and delivery workflow

This file is the single owner of how work moves through this repository: how a
change is framed before it is written, how its diff is reviewed against the
standing rules, when it may be called done, and what evidence it carries into a
pull request.

It owns the *procedure*. It owns no rules of its own — every check below cites
the document that owns it, so the checklist cannot drift away from the rule.
[`PRINCIPLES.md`](PRINCIPLES.md) and [`../Principles.md`](../Principles.md) say
what must be true; [`../ROADMAP.md`](../ROADMAP.md) says what to build next;
this file says how to get a change from those documents to `main` without
losing anything on the way.

**This is support work.** By [`PRINCIPLES.md`](PRINCIPLES.md) #5 it makes no
Brazilian law more resolvable, and it earns its place only as a multiplier on
the phases that do. Keep it short. Prefer deleting a step to adding one.

## The five stages

### 1. Frame — before any code

- **Read the owners.** [`../CLAUDE.md`](../CLAUDE.md) routes to them; read the
  owning document, never a summary of it.
- **Answer the coverage question** ([`PRINCIPLES.md`](PRINCIPLES.md) #5) out
  loud: does this increase the amount of Brazilian law a person or an AI system
  can reliably find, resolve, verify, or evaluate through Liibra? If the answer
  is no, name the change as support work and say why it interrupts the phase
  goals now.
- **Map it to a phase item** in [`../ROADMAP.md`](../ROADMAP.md), or state that
  it is off-roadmap.
- **Write the acceptance criteria as observable outcomes**, and name the
  automated *and* manual validation, *before* implementing. "It works" is not an
  acceptance criterion; "`/doc/<urn>` renders a metadata header for any URN the
  SRU returns, and 404s honestly for one it does not" is.
- **Stop for approval** when the scope is non-trivial. A checkpoint the user
  set is a hard limit, not a suggestion.

### 2. Build — one reviewable phase at a time

One phase, one reviewable diff. Unrelated work goes in its own change, however
tempting the drive-by fix. Never cross a stated approval checkpoint.

### 3. Review the diff — four layers

#### Layer A — mechanical

```sh
npm run gate
```

Re-run it against the **final** diff, after the last edit — not before. When the
change touches routes, rendered UI, or response headers, add the smoke suite —
which runs the *built* Worker under `wrangler dev`, so it needs a fresh build
first or it will pass against a stale one:

```sh
npm run build && npm run test:e2e
```

#### Layer B — the invariants

Each row cites its owner. Where a check is machine-enforced, the machine is the
enforcement and this table is only the reminder.

| # | Invariant | Owner / enforcement |
| --- | --- | --- |
| 1 | Network access lives only in `src/lib/server/`. Routes and components depend on `LegalSource`/`PropositionSource`, wired in `src/lib/server/legal/index.ts` and `src/lib/server/camara/index.ts`, and pass the load event's injected `fetch` down. When the rule trips, **fix the layering — never disable the rule.** | [`PRINCIPLES.md`](PRINCIPLES.md); `no-restricted-globals: fetch` in [`../eslint.config.js`](../eslint.config.js) |
| 2 | Parsing is pure and fixture-tested. A new upstream response shape gets a fixture **and** a registration in [`../tests/parse-contract.test.ts`](../tests/parse-contract.test.ts). Parse failures never throw to the page. | [`PRINCIPLES.md`](PRINCIPLES.md) |
| 3 | Honest presentation. Partial coverage, page-only sorting, and upstream failure become typed warnings (`source_unavailable`, `sort_page_only`) that the UI renders — never silence, never a stalled render. | [`PRINCIPLES.md`](PRINCIPLES.md) #3 |
| 4 | Primary source or nothing. Every document and proposition keeps source attribution and a verification link. No scraping where an official API or XML source exists; `scripts/fetch-constituicao-planalto.ts` is the sole sanctioned exception and is not precedent. | [`PRINCIPLES.md`](PRINCIPLES.md) #1, non-goals |
| 5 | The URN is canonical for identifier, route, and citation. Normalization parses structure and rejects non-`urn:lex:br` input. **Resolution is not search**: a resolver returns occurrences with an explicit match level, and fallback is visible, never silent. FRBR layering, not a flat `Document`. Fragment IDs are data. | [`../Principles.md`](../Principles.md) 3–6 |
| 6 | Edge-first. Cloudflare Workers is the only runtime; storage and scheduling use Workers primitives. Never add code that requires a long-running Node server. | [`PRINCIPLES.md`](PRINCIPLES.md) #4 |
| 7 | Legal source text stays in Portuguese. Interface chrome is localized through `src/lib/i18n/` — pt-BR **and** en updated together. | [`PRINCIPLES.md`](PRINCIPLES.md) |
| 8 | Visual identity: the two normative color roles and the Fraunces/system-sans split. The brand face is self-hosted; no third-party font CDN at runtime. | [`BRAND.md`](BRAND.md) |
| 9 | Defensive upstream integration: whitelist query fields, escape user values, cap page sizes, convert upstream failures into typed errors. | [`PRINCIPLES.md`](PRINCIPLES.md) |
| 10 | No secrets in the repo, in commits, in PR bodies, or in an agent's context. | [`PRINCIPLES.md`](PRINCIPLES.md), [`AGENT-TRUST.md`](AGENT-TRUST.md) |

#### Layer C — an independent pass

Run `/code-review` over the diff. Run `/security-review` as well when the diff
touches `src/lib/server/`, `src/hooks.server.ts`, `.github/workflows/`,
`wrangler.jsonc`, `package.json`, or `package-lock.json`.

Two rules make this layer worth anything:

- **An agent's own implementation report is not validation evidence.** "I
  updated the parser and it should handle the new shape" is a claim; the test
  output is the evidence.
- **A green CI run is not an independent review.** CI proves the gate passed;
  it says nothing about whether the change was the right one.

#### Layer D — surface triggers

Each trigger creates an obligation **in the same change**, not a follow-up:

| If the change touches… | Then |
| --- | --- |
| deployment, hosting, DNS, mail, CI/CD, external APIs, databases, storage, self-hosted services, local AI tooling, or exposure — plus security controls, which includes CODEOWNERS, Dependabot, branch protection, and CSP/HSTS | Run the AttackSurface skill; update [`../attacksurface.md`](../attacksurface.md) **and** [`../attacksurface.ai`](../attacksurface.ai) |
| the `permissions` block of [`../.claude/settings.json`](../.claude/settings.json) | Update [`AGENT-TRUST.md`](AGENT-TRUST.md) with the tier rationale — a rule without one does not ship. It is also AS-014, so the attack-surface pair updates too |
| the machine/agent discovery surface | Update [`AGENT-DISCOVERY.md`](AGENT-DISCOVERY.md) |
| a completed [`../ROADMAP.md`](../ROADMAP.md) item | Tick it, in the same change that completed it |

### 4. Hard gates

Do not describe a change as ready, done, or merge-ready while **any** of these
is true:

- the gate was not run against the final diff;
- CI is failed, pending, missing, or attached to an older commit;
- the diff carries unrelated changes, secrets, debug code, or generated junk
  (`worker-configuration.d.ts` churn, `.svelte-kit/` output);
- an owning document now contradicts the implementation;
- a Layer-D trigger fired without its matching update;
- required manual verification is incomplete or undocumented;
- actionable review feedback is unresolved.

**Never fabricate** a commit hash, a command's output, a review state, or a test
result. Report skipped checks and residual risk instead — an honest "I did not
run the e2e suite because the upstream was unreachable" is worth more than a
green summary that nobody ran.

Merging is a human act. It stays in the `ask` tier of
[`../.claude/settings.json`](../.claude/settings.json) and is performed only on
an explicit request.

### 5. Evidence

The pull request body is the record. `.github/pull_request_template.md` is its
shape: the problem and the approach, the coverage answer, the ROADMAP item, the
invariants touched, the exact commands run and what they returned, the checks
skipped and why, the manual verification and the environment it ran in,
screenshots for anything visible, the owner documents updated, and the residual
risk and follow-ups.

## What this workflow is — and is not

It is a checklist, not a sandbox. A determined or confused change can satisfy
every line here and still be wrong. The rails make the common failure modes —
a bundled diff, an undocumented invariant, a "done" with no evidence behind it —
fail loudly, but the enforcement that actually holds is elsewhere:

1. **`npm run gate`**, locally and re-run by CI on every pull request.
2. **CODEOWNERS + PR review** on governance, deployment, package, and
   `src/lib/server/` paths ([`../.github/CODEOWNERS`](../.github/CODEOWNERS)).
3. **Deploy credentials living only in the environment**, never in the repo —
   a session without `CLOUDFLARE_API_TOKEN` cannot deploy whatever it runs.

A fourth, **branch protection on `main`**, is designed-for but not yet
confirmed: the autonomous agent push lane covers only `claude/*` branches on the
assumption that `main` is protected, and confirming the ruleset is still open as
AS-001 P0 in [`../attacksurface.md`](../attacksurface.md) and in Phase 0 of
[`../ROADMAP.md`](../ROADMAP.md). Until it is confirmed, treat it as an
assumption this workflow leans on rather than a control that holds
([`AGENT-TRUST.md`](AGENT-TRUST.md) makes the same point).

The executable form of this file is
[`../.claude/skills/Review/SKILL.md`](../.claude/skills/Review/SKILL.md). Both
change together; a procedure change that lands in only one of them has not
landed.
