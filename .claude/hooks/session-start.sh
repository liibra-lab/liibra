#!/bin/bash
# SessionStart hook: make the quality gate runnable in Claude Code on the web.
# Installs npm dependencies from the committed lockfile so `npm run check`,
# `npm run lint`, `npm test`, and `npm run build` work from the first turn.
set -euo pipefail

# Web sessions only; local sessions manage their own node_modules.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# `npm ci` matches the committed package-lock.json exactly and never mutates
# it (README: the lockfile is the source of truth), but it wipes node_modules
# on every run — so skip it when the tree is already in sync and let cached
# containers start fast. npm stamps node_modules/.package-lock.json on every
# successful install, which makes this freshness check reliable.
if [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  npm ci --no-audit --no-fund
fi
