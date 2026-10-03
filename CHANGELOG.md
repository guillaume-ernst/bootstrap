# Changelog

All notable changes to this project will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.7.0-dev]

### Added

- Fork of Bootstrap 4.6.2 under the package name `bootstrap-modernized`.
- Node.js 22 toolchain, Dart Sass, Rollup 4, Vitest and Playwright.
- Golden CSS tests, Sass tree parity checks (`css-module-check`) and an AdminLTE compatibility check (`adminlte-check`).
- Parallel Sass tree `scss/module/` based on `@use`/`@forward`, configurable via `@use ... with ()`; the legacy `scss/` tree remains untouched for `@import` consumers.
- Vitest unit test suite (replacing Karma/QUnit) and Playwright browser tests (modal, dropdown, tooltip, adminlte) on Chromium, Firefox and WebKit.
- ESM/UMD outputs and `exports` in `package.json`, with `sass` and `style` fields.
- GitHub Actions workflows: lint, css, js, e2e, release with npm provenance, and Dependabot.

### Changed

- Sass: migrated global functions (`map-get`, `mix`, `lighten`, etc.) to `sass:*` modules.
- Removed Dart Sass warnings `global-builtin`, `color-functions`, `if-function`, `slash-div` and `abs-percent`; only the `import` deprecation remains in the `scss/` tree and can be silenced.
- JavaScript: jQuery 4 supported alongside jQuery 3 (the peer dependency accepts `>=3.5 <5` and the version check was adjusted).
- Popper: `popper.js` v1 replaced by `@popperjs/core` v2; the bundle embeds Popper 2 and legacy options (`fallbackPlacement`, `boundary`) are translated to the v2 API.
- ESLint 9 (flat config) and stylelint aligned with modern Sass syntax.
- Internet Explorer 11 is no longer supported; `-ms-*` prefixes and IE hacks were removed.

## [4.6.2] - 2022-07-19

Original upstream version. See [twbs/bootstrap@v4.6.2](https://github.com/twbs/bootstrap/releases/tag/v4.6.2).

[4.7.0-dev]: https://github.com/guillaume-ernst/bootstrap-modernized/compare/v4.6.2...HEAD
[4.6.2]: https://github.com/twbs/bootstrap/releases/tag/v4.6.2
