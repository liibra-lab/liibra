# Review Skill

Use this skill when finishing a unit of work in Liibra: reviewing a diff, deciding whether a change is done, preparing a push, or preparing a pull request.

## Purpose

Apply Liibra's review and delivery workflow to a specific change, so that "done" means the same thing every time.

`docs/REVIEW.md` owns the workflow. This file is its executable form: the same five stages, written as a procedure to run. When the two disagree, `docs/REVIEW.md` wins and this file is wrong — fix it in the same change.

This skill does not restate generic code review. It delegates that to `/code-review` and `/security-review` and adds what only this repository knows.

## Trigger conditions

Invoke this skill when a request includes or implies:

- Review this change, this diff, this branch, or this PR.
- Is this done / ready / good to push / good to merge?
- Prepare a commit, a push, or a pull request.
- Finish, wrap up, or hand off a unit of work.
- Any change that touches `src/lib/server/`, `src/hooks.server.ts`, `src/routes/`, `.github/`, `wrangler.jsonc`, or the dependency files.

Do not invoke it for pure questions, exploration, or reading tasks that change nothing.

## Procedure

### 1. Establish the diff

```sh
git status --porcelain --untracked-files=all
git branch --show-current
git fetch origin main
git diff origin/main...HEAD          # committed work not yet on main
git diff HEAD                        # uncommitted edits
```

All three parts of the change are in scope and each needs a different command:
**committed** work on the branch, **uncommitted** edits in the worktree, and
**untracked** new files — which no `git diff` shows at all, so read them with
`cat` or `git diff --no-index /dev/null <path>`. A review that runs only
`git diff` sees nothing on a branch whose work is already committed, which is
precisely the "prepare a push" case above.

Separate the requested change from unrelated pre-existing edits and say which is
which. If the diff bundles unrelated work, say so — that is a finding, not a
detail.

### 2. Re-read the owners the change touches

`CLAUDE.md` routes to them. Read the owning document, not a summary:

| Change touches | Read |
| --- | --- |
| anything | `docs/PRINCIPLES.md` |
| what to build next, phase state | `ROADMAP.md` |
| `src/lib/server/legal/` — URN, metadata, resolver, vocabulary, ingestion | `Principles.md` |
| logo, type, color, layout chrome | `docs/BRAND.md` |
| `.claude/settings.json` permissions | `docs/AGENT-TRUST.md` |
| robots, sitemap, `.well-known`, machine-readable surfaces | `docs/AGENT-DISCOVERY.md` |
| deployment, hosting, CI, external APIs, storage, exposure | `attacksurface.md`, `attacksurface.ai` |

### 3. Run the gate against the final diff

```sh
npm run gate
```

Run it **after** the last edit, not before. Add `npm run test:e2e` when routes, rendered UI, or response headers changed (it needs `npm run build` first).

Record the exact commands and what they returned. If a check was skipped, record which and why.

### 4. Check the invariants

Walk the ten rows of the Layer B table in `docs/REVIEW.md` and report each as pass, fail, or not applicable. The five that catch the most in this repository:

1. **Network boundary.** No `fetch` outside `src/lib/server/`. Routes depend on `LegalSource`/`PropositionSource` from the composition roots (`src/lib/server/legal/index.ts`, `src/lib/server/camara/index.ts`) and pass the load event's injected `fetch` down. ESLint enforces this; when it trips, fix the layering — never disable the rule, never add an inline suppression.
2. **Parse contract.** A new upstream response shape needs a fixture *and* a registration in `tests/parse-contract.test.ts`. Parsing stays pure and never throws to the page.
3. **Honest presentation.** Partial coverage, page-only sorting, and upstream failure surface as typed warnings the UI renders (`source_unavailable`, `sort_page_only`), localized in `src/lib/i18n/`. A silent empty state is a defect.
4. **URN discipline.** Canonical URN normalization; resolution returns an explicit match level and never falls back silently; FRBR layering rather than a flat document.
5. **Language and localization.** Legal text stays Portuguese; every new chrome string lands in both pt-BR and en.

### 5. Get an independent pass

Run `/code-review` on the diff. Run `/security-review` as well when the diff touches `src/lib/server/`, `src/hooks.server.ts`, `.github/workflows/`, `wrangler.jsonc`, `package.json`, or `package-lock.json`.

Treat your own implementation report as a claim, never as evidence. A green CI run proves the gate passed; it does not constitute a review.

### 6. Fire the surface triggers

Each is an obligation in the same change, not a follow-up:

- Deployment, hosting, DNS, mail, CI/CD, external APIs, databases, storage, self-hosted services, local AI tooling, or exposure changed → run the AttackSurface skill and update `attacksurface.md` **and** `attacksurface.ai`.
- `.claude/settings.json` `permissions` changed → update `docs/AGENT-TRUST.md` with the tier rationale in the same change; it is AS-014, so the attack-surface pair updates too.
- Discovery surface changed → update `docs/AGENT-DISCOVERY.md`.
- A ROADMAP item was completed → tick it.

### 7. Apply the hard gates

Walk the list below. Any one of them still true means the change is not ready, however much of the rest passed.

## Hard gates

Do not report a change as ready, done, or merge-ready while any of these remain true:

- The gate was not run against the final diff.
- CI is failed, pending, missing, or attached to an older commit.
- The diff contains unrelated changes, secrets, debug code, or generated junk (`worker-configuration.d.ts` churn, `.svelte-kit/` output).
- An owning document now contradicts the implementation.
- A surface trigger fired without its matching update.
- Required manual verification is incomplete or undocumented.
- Actionable review feedback is unresolved.

Never fabricate a commit hash, command output, review state, or test result. For uncommitted work, report `HEAD` together with the worktree and untracked-file state. Where no pull request exists, report remote checks and review state as not applicable rather than inventing them.

Do not merge unless the user explicitly asks. Merging and pushing to `main` are `ask`-tier actions in `.claude/settings.json`.

## Output expectations

Report, briefly:

- `HEAD`, branch, and worktree/untracked state.
- Changed files, and whether the diff is scoped to one reviewable change.
- The coverage answer (`docs/PRINCIPLES.md` #5) and the ROADMAP item, or an explicit "support work, off-roadmap" with justification.
- Invariant results — only the rows that are not a plain pass, plus a one-line "the rest pass".
- Exact checks run and their results; checks skipped and why.
- Surface triggers fired and the updates made.
- Manual verification performed, and in what environment.
- Remaining blockers and residual risk.

Keep it short. A review that nobody reads enforces nothing.
