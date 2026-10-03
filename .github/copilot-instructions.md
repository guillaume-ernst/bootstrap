# Copilot instructions — bootstrap-modernized (v5 line)

This branch is the Bootstrap 5 line of `bootstrap-modernized` (5.3.8 base → 5.4.x). Read
`AGENTS.md` at the root for the full playbook before making changes.

Key rules:

- Stays on major version 5 forever — never merge from `v4-modern` or upstream `main`.
- Vanilla JavaScript only, Popper 2 — no jQuery runtime dependency (the optional
  `window.jQuery` bridge is upstream behavior, keep it).
- Two Sass trees kept in sync: `scss/` (legacy `@import`) and `scss/module/` (`@use`/`@forward`).
  CSS parity between them is enforced in CI (`npm run test-css-module`).
- Golden CSS invariants: compiled output must stay identical (normalized) to Bootstrap 5.3.8.
- Tests: Vitest unit (`npm test`), Playwright e2e. Use conventional commit messages.
