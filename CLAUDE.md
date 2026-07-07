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
- **`Principles.md`** — legal data tool layer: standing rules and key design
  for the LexML-based URN/metadata/resolver layer.
- **`docs/BRAND.md`** — visual identity: logo, typography, and color rules.
- **`docs/AGENT-DISCOVERY.md`** — machine/agent discovery surface: what is
  published, what is dashboard/DNS work, and what is deliberately absent.
- **`attacksurface.md`** and **`attacksurface.ai`** — public-safe security
  inventory. When deployment, hosting, DNS, mail, CI/CD, external APIs,
  databases, storage, self-hosted services, local AI tooling, or exposure
  changes, use `.claude/skills/AttackSurface/SKILL.md` and update both files.

## Quality gate — run before every push

```sh
npm run gate
```

CI enforces the same steps. Dependencies install from the committed
`package-lock.json` (`npm ci`); never mutate the lockfile casually. Node 22.

## Repository notes

- The `src/lib/server/` network boundary is lint-enforced
  (`eslint.config.js`); when the rule trips, fix the layering — don't
  disable the rule.
- `.github/CODEOWNERS` marks governance, deployment, and `src/lib/server/`
  paths as owner-reviewed; expect PR review on changes there.
- Keep the public security inventory free of sensitive operational details.
