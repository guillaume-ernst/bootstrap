# Copilot instructions — bootstrap-modernized

This repository is a maintained Bootstrap fork. `main` only mirrors upstream and hosts an index —
**all maintained code lives on `v4-modern` (Bootstrap 4 line) and `v5-modern` (Bootstrap 5 line)**.
Check out the appropriate branch and follow its `AGENTS.md` before making changes.

Key rules:

- Never merge `v4-modern` and `v5-modern`; each stays on its own major version.
- Each branch keeps two Sass trees in sync: `scss/` (legacy `@import`) and `scss/module/`
  (`@use`/`@forward`). CSS output parity between them is enforced in CI — run the parity check
  after touching Sass.
- v4: jQuery 4 compatible, Popper 2, AdminLTE 3 verified. v5: vanilla JS + Popper 2, no jQuery.
- Use conventional commit messages.
