# Changelog

All notable changes to this project will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.4.0-dev]

### Added

- Fork of Bootstrap 5.3.8 under the package name `bootstrap-modernized`.
- Node.js 22 toolchain, ESLint 9 flat config, Vitest and Playwright.
- Golden CSS tests (`test-css-golden`) and Sass tree parity checks (`test-css-module`).
- Parallel Sass tree `scss/module/` based on `@use`/`@forward`, configurable via
  `@use ... with()`; the legacy `scss/` tree remains untouched for `@import` consumers.
- Vitest unit test suite (replacing Karma/Jasmine) and Playwright browser tests
  (dropdown, modal, offcanvas, scrollspy) on Chromium, Firefox and WebKit.
- Playwright coverage for behavior jsdom cannot simulate (layout geometry, focus
  visibility, computed styles), with the corresponding unit tests marked as skipped.
- GitHub Actions workflows: lint, css, js, e2e, bundlewatch, and Dependabot.

### Changed

- Sass: migrated to `sass:*` built-in modules and removed the `if-function`,
  `color-functions`, `global-builtin` and `mixed-decls` deprecations; only the `import`
  deprecation remains in the `scss/` tree and can be silenced.
- Tests: migrated the whole upstream unit suite from Karma/Jasmine to Vitest
  (28 files, 822 tests, 35 documented jsdom skips covered by Playwright).
- Bundlewatch budgets recalibrated for the Dart Sass/PostCSS output and the
  `trackBranches` list now follows `v5-modern`, `v4-modern` and `main`.
- Documentation site stack removed; the repository focuses on the framework sources.

### Notes

- JavaScript remains vanilla — jQuery is not a dependency. The optional jQuery
  compatibility bridge is kept for consumers that expose `window.jQuery`.
- Popper 2 via `@popperjs/core`, unchanged from upstream 5.3.8.

## [5.3.8] - 2025-08-05

Original upstream version. See [twbs/bootstrap@v5.3.8](https://github.com/twbs/bootstrap/releases/tag/v5.3.8).

[5.4.0-dev]: https://github.com/guillaume-ernst/bootstrap-modernized/compare/v5.3.8...HEAD
[5.3.8]: https://github.com/twbs/bootstrap/releases/tag/v5.3.8
