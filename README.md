<h3 align="center">bootstrap-modernized</h3>

<p align="center">
  Maintained fork of Bootstrap 5, modernized for Dart Sass 2 and 2026-era toolchains.
  <br>
  Vanilla JavaScript only — no jQuery required. Popper 2 included via <code>@popperjs/core</code>.
  <br>
  All releases stay on major version 5 to avoid any confusion with upstream versioning.
  <br>
  <br>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/issues">Report an issue</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/bootstrap-modernized"><img src="https://img.shields.io/npm/v/bootstrap-modernized" alt="npm version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/guillaume-ernst/bootstrap-modernized" alt="License"></a>
  <a href="https://coveralls.io/github/guillaume-ernst/bootstrap-modernized?branch=v5-modern"><img src="https://coveralls.io/repos/github/guillaume-ernst/bootstrap-modernized/badge.svg?branch=v5-modern" alt="Coverage"></a>
  <br>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/lint.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/lint.yml/badge.svg?branch=v5-modern" alt="Lint"></a>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/css.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/css.yml/badge.svg?branch=v5-modern" alt="CSS"></a>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/js.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/js.yml/badge.svg?branch=v5-modern" alt="JS Tests"></a>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/e2e.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/e2e.yml/badge.svg?branch=v5-modern" alt="E2E"></a>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/bundlewatch.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/bundlewatch.yml/badge.svg?branch=v5-modern" alt="Bundlewatch"></a>
</p>

## Goal

This fork keeps Bootstrap 5 fully compatible with modern toolchains: Dart Sass (including the
upcoming `@import` removal), Node.js 22, ESLint 9 flat config, Vitest and Playwright. The public
API stays identical to upstream Bootstrap 5.3.

## Why upgrade

Upstream 5.3.x is stable, but its toolchain and Sass sources still carry deprecations that will
break or warn under Dart Sass 2/3 and modern Node. The fork removes that friction while keeping
the public API identical to 5.3.8.

- **Dart Sass 2/3 ready** — the remaining deprecations are gone: `if()` function syntax,
  `color.red()/green()/blue()`, `mixed-decls`. Only `import` remains (which can be silenced), and the
  `scss/module/` tree (`@use`/`@forward`) is ready for when it disappears.
- **Drop-in total** — an npm alias is all it takes: byte-identical CSS verified by golden
  tests, vanilla JS and Popper 2 unchanged, `data-*` attributes and plugin APIs identical.
  Nothing to rewrite.
- **Incremental change** — the `@use` migration can be done file by file: `scss/` and
  `scss/module/` coexist in the same package.
- **Real confidence** — 822 unit tests, 18 end-to-end tests across Chromium/Firefox/WebKit
  covering what jsdom cannot (focus trapping, geometry, keyboard navigation), Sass True
  coverage, and automated CSS parity checks between both Sass trees.
- **Node.js 22 toolchain** — ESLint 9 flat config, Vitest, Playwright, recalibrated
  bundlewatch and Dependabot: a solid base to keep patching.

In short: **same Bootstrap 5, but it compiles, runs and installs like a 2026 library.**

## Installation

```bash
npm install bootstrap-modernized
```

```scss
// With @import (legacy scss/ tree, import warning can be silenced)
@import "bootstrap-modernized/scss/bootstrap";

// With @use (scss/module/ tree, recommended)
@use "bootstrap-modernized/scss/module/bootstrap";
```

```js
// Bundle including Popper 2
import "bootstrap-modernized/dist/js/bootstrap.bundle";

// Standalone ESM (Popper 2 as a peer dependency)
import { Modal, Dropdown } from "bootstrap-modernized";
```

## Sass usage

The `scss/module/` tree is the recommended entry point. Configuration happens through
`@use ... with()` on the `variables` module:

```scss
@use "bootstrap-modernized/scss/module/variables" as vars with (
  $primary: #0d6efd,
  $body-bg: #fafafa
);
@use "bootstrap-modernized/scss/module/bootstrap";
```

All functions and mixins are namespaced (`variables.$primary`, `functions.tint-color()`,
`mixins.media-breakpoint-up()`, `rfs.rfs()`), so the tree works without global imports.

## Compatibility

| Tool            | Minimum supported |
| --------------- | ----------------- |
| Dart Sass       | 1.79+             |
| Node.js (build) | 22 LTS            |
| @popperjs/core  | 2.11+             |
| Browsers        | modern + ESR      |

The optional jQuery compatibility bridge still activates when `window.jQuery` is present,
but jQuery is not a dependency of Bootstrap 5.

## Demo

- [Live demo (v5-modern)](https://guillaume-ernst.github.io/bootstrap-modernized/demo/v5/) — the dist build exercising modal, dropdown, tooltip, popover and accordion with vanilla JS
- [Live demo (v4-modern)](https://guillaume-ernst.github.io/bootstrap-modernized/demo/v4/) — the v4 fork running with jQuery 4 and Popper 2

## Documentation

- [MIGRATION.md](./MIGRATION.md) — changes compared to Bootstrap 5.3.8
- [CHANGELOG.md](./CHANGELOG.md)
- Upstream Bootstrap 5.3 docs: https://getbootstrap.com/docs/5.3/

## License

The original code is MIT licensed (Copyright Twitter, Inc. and The Bootstrap Authors). This fork
adds modifications copyrighted by Guillaume Ernst, also under MIT. See [LICENSE](./LICENSE).
