# Agent trust boundary

This file is the single owner of the coding-agent trust boundary: what an
agent (Claude Code or equivalent) working in this repository may do
autonomously, must ask a maintainer for, and must never do. The enforced form
lives in the `permissions` block of [`.claude/settings.json`](../.claude/settings.json);
this file explains the intent so rule changes stay calibrated instead of
accreting by habit.

## The calibration principle

Every action is placed by **blast radius × reversibility against leverage**,
not by how scary it sounds or how it has always been handled:

- **Autonomous (allow)** — the worst outcome is contained by git or is
  read-only, and the action is needed constantly. Prompting here costs
  attention on every iteration and buys nothing: the real review point is the
  diff, the PR, and CODEOWNERS — not the moment a file is edited or a test
  is run.
- **Ask** — the action mutates something that outlives the session or the
  branch (the dependency lockfile, `main`, primary-source seed data) but is
  legitimately part of the workflow. A human should witness it each time.
- **Deny** — the action's blast radius is production, credentials, or the
  published package namespace. Its leverage inside an agent session is zero:
  there is no task in this repository that legitimately needs an agent to
  deploy, mutate secrets, or publish. These are done deliberately by a
  maintainer, outside agent sessions.

## The three tiers

### Autonomous

| Group | Rationale |
| --- | --- |
| `npm run gate` and its parts (`check`, `lint`, `test`, `test:e2e`, `build`), `npx playwright test` | The repo *mandates* running the gate before every push. Mandating an action and prompting for permission to perform it is incoherent — this is the highest-leverage, lowest-risk command set in the project. |
| `npm ci` | Restores exactly the committed lockfile and never mutates it. It already runs unprompted in the SessionStart hook; prompting for it interactively contradicts that. |
| `npm run gen`, `npm run dev`, `npm run preview` | Local codegen and local servers. Nothing leaves the machine. |
| Read-only git (`status`, `diff`, `log`, `show`, `branch`, `blame`, `fetch`) and local git writes (`add`, `commit`, `checkout`, `switch`, `stash`) | Fully contained by the repository's own history. Worst case loses uncommitted work in a working copy. |
| `git push` to `claude/*` branches (including `--force-with-lease`) | Agent branches are agent-owned and deleted after merge. The control that matters is review before `main` — branch protection and CODEOWNERS — not a prompt on every feature-branch push. |
| `Edit` / `Write` in the working tree | The most reversible action an agent has: every change is a `git diff` away from inspection and a `git checkout` away from gone. CODEOWNERS still forces human review on governance, deployment, and `src/lib/server/` paths before anything reaches `main`. |
| `WebFetch` to the project's own upstreams and toolchain docs (lexml.gov.br, dadosabertos.camara.leg.br, Cloudflare/Svelte/Tailwind docs, localhost) | Read-only GETs to endpoints the deployed Worker already talks to, plus the local dev server for verification loops. Fetches to any other domain still prompt. |

### Ask

| Group | Rationale |
| --- | --- |
| `npm install` / `uninstall` / `update` / `audit fix` | Mutates `package.json`/`package-lock.json` — the supply chain. CLAUDE.md says never casually; CODEOWNERS reviews it; the human approves the mutation at the moment it happens, not only at PR time. |
| `npm run gen:constituicao`, `npm run gen:sru-fixtures` | Low risk mechanically, but they rewrite primary-source seed data and fixtures — trusted legal-content integrity is this project's core promise (Critical per the attack-surface criticality rules). Refreshing it is rare (low leverage) and a provenance event a maintainer should witness. This is the calibration cutting the *other* way: cheap ≠ autonomous. |
| `git push origin main`, PR merge (`mcp__github__merge_pull_request`) | Crossing into `main` is the one git action that isn't branch-contained. |

Everything unlisted falls through to the harness default, which prompts.

### Never (deny)

| Group | Rationale |
| --- | --- |
| `wrangler deploy` / `npm run deploy`, `wrangler delete` | Production deploy control over liibra.com.br is Critical. Zero agent leverage: deploying is a deliberate maintainer act. |
| `wrangler secret`, `wrangler login` | Production credential mutation and credential minting. |
| `npm publish` | The package is `private: true`; publishing has no legitimate path at all. |
| `Read(.env)`, `Read(.dev.vars*)` | Secret-bearing files. `.gitignore` keeps them out of commits but not out of an agent's context window — and from there potentially into a public PR body or log. `.env.example` and `.env.test` are un-ignored and secret-free by convention, and stay readable. |
| `mcp__github__push_files`, `create_or_update_file`, `delete_file` | Server-side GitHub writes bypass the local clone entirely — no `npm run gate`, no local diff. All repository writes go through the local gate path; that rule has no exceptions. |

## What this boundary is — and is not

Permission rules are **string-matched rails against accident and prompt
injection, not a sandbox**. A sufficiently creative command line can evade a
deny pattern. The rails make the common failure modes (a confused agent, an
injected instruction inside fetched upstream XML, an over-permissive session
mode) fail closed; they do not replace the real enforcement points:

1. **Deploy credentials live only in the environment** (`CLOUDFLARE_API_TOKEN`),
   never in the repo — an agent session without the token cannot deploy no
   matter what it runs.
2. **CODEOWNERS + PR review** on governance, deployment, package, and
   `src/lib/server/` paths.
3. **Branch protection on `main`** — this design leans on it (the autonomous
   push lane covers only `claude/*` branches). Confirming the `main` ruleset
   is an open P0 task in `attacksurface.md` (AS-001) and is load-bearing here.
4. **CI** re-runs the full gate on every PR regardless of what happened
   locally.

## Maintenance rules

- Rule changes are edits to `.claude/settings.json` **and** this file, in the
  same change; a rule without a stated tier rationale doesn't ship.
- **Never place a broad `ask` pattern over an `allow` lane** (e.g.
  `Bash(git push:*)` in ask would swallow the `claude/*` allow): when multiple
  rules match, the most restrictive wins (deny > ask > allow).
- Personal loosening belongs in `.claude/settings.local.json` (untracked),
  never in the shared file.
- This boundary is part of the attack surface (AS-014). Changing it triggers
  the AttackSurface skill: update `attacksurface.md` and `attacksurface.ai`
  in the same change.
