<!--
docs/REVIEW.md owns this workflow. Delete sections that genuinely do not apply
and say so — do not leave placeholders, and do not delete a section to avoid
answering it.
-->

## Problem and approach

<!-- What was wrong or missing, and how this change addresses it. -->

## Coverage

<!--
docs/PRINCIPLES.md #5: does this increase the amount of Brazilian law a person
or AI system can reliably find, resolve, verify, or evaluate through Liibra?
If no, say "support work" and justify why it comes now.
-->

**ROADMAP item:** <!-- phase and item, or "off-roadmap" with a reason -->

## Invariants

<!--
Which of the docs/REVIEW.md Layer B invariants this change touches, and how it
satisfies them. Network boundary, parse contract, honest presentation, primary
source, URN discipline, edge-first, language, brand, defensive integration,
secrets.
-->

## Validation

**Automated** — exact commands and results:

```
npm run gate
```

**Manual** — what was verified by hand, and in what environment:

**Skipped** — checks not run, and why:

<!-- Screenshots or recordings for anything visible. -->

## Owner documents updated

<!-- Tick what this change updated; strike or leave unticked what it did not need. -->

- [ ] `docs/PRINCIPLES.md` — a principle, invariant, or non-goal changed
- [ ] `ROADMAP.md` — a phase item completed or re-scoped
- [ ] `Principles.md` — the legal data tool layer changed
- [ ] `docs/BRAND.md` — visual identity changed
- [ ] `docs/AGENT-TRUST.md` — `.claude/settings.json` permissions changed
- [ ] `docs/AGENT-DISCOVERY.md` — the machine/agent discovery surface changed
- [ ] `docs/REVIEW.md` **and** `.claude/skills/Review/SKILL.md` — the review
      procedure changed; both always move together
- [ ] `attacksurface.md` **and** `attacksurface.ai` — deployment, hosting, DNS,
      mail, CI/CD, external APIs, storage, local AI tooling, exposure, or a
      security control (CODEOWNERS, Dependabot, branch protection, CSP/HSTS)
      changed
- [ ] None of the above applied

## Residual risk and follow-ups

<!-- Known limitations, deferred work, and anything a reviewer should watch. -->
