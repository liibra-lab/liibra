# CLAUDE.md

Liibra is free, open, primary-source access to Brazilian legal information —
an LII-inspired project ([law.cornell.edu](https://www.law.cornell.edu/)) —
deployed exclusively to Cloudflare Workers.

Every standing rule has exactly one owning document. Read the owner, not a
summary:

- **`docs/PRINCIPLES.md`** — product principles, architecture invariants,
  language rule, and non-goals. They bind code review; read them before
  substantive work.
- **`ROADMAP.md`** — the plan of record: current state and phased goals.
- **`docs/BRAND.md`** — visual identity: logo, typography, and color rules.

## Quality gate — run before every push

```sh
npm run gate
```

CI enforces the same steps. Dependencies install from the committed
`package-lock.json` (`npm ci`); never mutate the lockfile casually. Node 22.

## Repository notes

- `.github/CODEOWNERS` marks governance, deployment, and `src/lib/server/`
  paths as owner-reviewed; expect PR review on changes there.
