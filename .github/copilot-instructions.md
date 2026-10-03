# Copilot instructions — bootstrap-modernized (v4 line)

This branch is the Bootstrap 4 line of `bootstrap-modernized` (4.6.2 base → 4.7.x). Read
`AGENTS.md` at the root for the full playbook before making changes.

Key rules:

- Stays on major version 4 forever — never merge from `v5-modern` or upstream `main`.
- Two Sass trees kept in sync: `scss/` (legacy `@import`) and `scss/module/` (`@use`/`@forward`).
  CSS parity between them is enforced in CI (`npm run test-css-module`).
- Golden CSS invariants: `npm run test:golden` — compiled output must stay byte-identical
  (normalized) to Bootstrap 4.6.2.
- jQuery 4 compatible (3 still works), Popper 2 runtime. AdminLTE 3 compat: `npm run adminlte-check`.
- Tests: Vitest unit (`npm test`), Playwright e2e. Use conventional commit messages.
