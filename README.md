<p align="center">
  <a href="https://getbootstrap.com/docs/4.6/">
    <img src="https://getbootstrap.com/docs/4.6/assets/brand/bootstrap-solid.svg" alt="Bootstrap logo" width="72" height="72">
  </a>
</p>

<h3 align="center">bootstrap-modernized</h3>

<p align="center">
  Maintained fork of Bootstrap 4, modernized for Dart Sass 2, jQuery 4 and Popper 2.
  <br>
  All releases stay on major version 4 to avoid any confusion with Bootstrap 5.
  <br>
  <br>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/issues">Report an issue</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/bootstrap-modernized"><img src="https://img.shields.io/npm/v/bootstrap-modernized" alt="npm version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/guillaume-ernst/bootstrap-modernized" alt="License"></a>
  <a href="https://coveralls.io/github/guillaume-ernst/bootstrap-modernized?branch=v4-modern"><img src="https://coveralls.io/repos/github/guillaume-ernst/bootstrap-modernized/badge.svg?branch=v4-modern" alt="Coverage"></a>
  <br>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/lint.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/lint.yml/badge.svg?branch=v4-modern" alt="Lint"></a>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/css.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/css.yml/badge.svg?branch=v4-modern" alt="CSS"></a>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/js.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/js.yml/badge.svg?branch=v4-modern" alt="JS"></a>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/e2e.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/e2e.yml/badge.svg?branch=v4-modern" alt="E2E"></a>
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/bundlewatch.yml"><img src="https://github.com/guillaume-ernst/bootstrap-modernized/actions/workflows/bundlewatch.yml/badge.svg?branch=v4-modern" alt="Bundlewatch"></a>
</p>

## Goal

Bootstrap 4.x is no longer actively maintained upstream, but it remains widely used (e.g. AdminLTE 3). This fork keeps a version compatible with 2026-era toolchains without adding new features.

## Why upgrade

Bootstrap 4 survives 2026-era stacks: instead of forcing a costly migration to v5, the fork makes the existing dependency compatible with today's tooling.

- **Dart Sass 2/3 ready** — zero warnings except `import` (which can be silenced), `slash-div` resolved, global functions migrated to `sass:*` modules. When Dart Sass 3 removes `@import`, the `scss/module/` tree (`@use`/`@forward`) is already here, so you can migrate today instead of in an emergency tomorrow.
- **jQuery 4** — the `<4` version bound is lifted, and Popper v1 options are translated to Popper 2. No more peer dependency conflicts with modern plugins.
- **Total drop-in** — an npm alias is all it takes: byte-identical CSS to 4.6.2 verified by golden tests, webpack `~bootstrap` imports, `$.fn.*` plugins and `data-*` attributes all unchanged. Nothing to rewrite. AdminLTE 3 is verified in CI on all three browsers.
- **ESM + `exports`** — native `import`, `sass`/`style` fields, no more UMD transpilation.
- **Incremental change** — the `@use` migration can be done file by file: `scss/` and `scss/module/` coexist in the same package.
- **Real confidence** — 370 unit tests, 33 end-to-end tests across Chromium/Firefox/WebKit, and automated CSS parity checks. This is not a blind fork.
- **Node.js 22 toolchain** — ESLint 9, Vitest, Playwright, bundlewatch, Dependabot and npm releases with provenance: a solid base to keep patching.

In short: **keep Bootstrap 4 exactly as it is, but it compiles, runs and installs like a 2026 library** — without paying the cost of a major migration to v5.

## Installation

```bash
npm install bootstrap-modernized
```

```scss
// With @import (legacy scss/ tree, import warning can be silenced)
$primary: #0056b3;
@import "bootstrap-modernized/scss/bootstrap";

// With @use (scss/module/ tree, recommended)
@use "bootstrap-modernized/scss/module/bootstrap" with (
  $primary: #0056b3
);
```

```js
// Bundle including Popper 2
import "bootstrap-modernized/dist/js/bootstrap.bundle";

// Standalone: jQuery and @popperjs/core expected as dependencies
import "bootstrap-modernized/dist/js/bootstrap";
```

## AdminLTE 3

AdminLTE 3 works as-is with the fork via an npm alias:

```json
{
  "dependencies": {
    "bootstrap": "npm:bootstrap-modernized@^4.7.0"
  }
}
```

See the [AdminLTE section in MIGRATION.md](./MIGRATION.md#adminlte-3) for Sass (`~` webpack) and JavaScript details.

## Compatibility

| Tool            | Minimum supported |
| --------------- | ----------------- |
| Dart Sass       | 1.79+             |
| Node.js (build) | 22 LTS            |
| jQuery          | 3.5+ (4.x OK)     |
| @popperjs/core  | 2.11+             |
| AdminLTE        | 3.x               |
| Browsers        | modern + ESR      |

## Demo

- [Live demo (v4-modern)](https://guillaume-ernst.github.io/bootstrap-modernized/demo/v4/) — the dist build exercising modal, dropdown, tooltip, popover and collapse with jQuery 4
- [Live demo (v5-modern)](https://guillaume-ernst.github.io/bootstrap-modernized/demo/v5/) — the v5 fork running with vanilla JS and Popper 2

## Documentation

- [MIGRATION.md](./MIGRATION.md) — changes compared to Bootstrap 4.6.2
- [CHANGELOG.md](./CHANGELOG.md)
- Upstream Bootstrap 4.6 docs: https://getbootstrap.com/docs/4.6/

## License

The original code is MIT licensed (Copyright Twitter, Inc. and The Bootstrap Authors). This fork adds modifications copyrighted by Guillaume Ernst, also under MIT. See [LICENSE](./LICENSE).
