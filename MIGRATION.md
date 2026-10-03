# Migration guide — @gernst/bootstrap v5

This fork maintains Bootstrap 5 with modern compatibility: Dart Sass 2, Node.js 22, ESLint 9,
Vitest and Playwright. All releases stay on major version 5 to avoid any confusion with upstream
versioning. JavaScript remains vanilla — jQuery is not required.

## Table of contents

- [5.4.0 — Build modernization](#540)
- [Sass modules (`scss/module/`)](#sass-modules-scssmodule)
- [Compatibility](#compatibility)

## 5.4.0

### Node.js and toolchain

- Node.js 22+ required for the build toolchain.
- ESLint 9 flat config replaces the legacy `.eslintrc` setup.
- Karma/Jasmine replaced by Vitest for unit tests and Playwright for browser end-to-end tests.

### Sass

- The official build already used Dart Sass upstream; this fork additionally removes the
  remaining deprecations (`if()` function syntax, `color.red()/green()/blue()`, `mixed-decls`),
  so the `scss/` tree compiles with zero warnings under Dart Sass 2/3 — except `@import`.
- The `@import` syntax still works. To silence the remaining warning:

  ```js
  // vite.config.js
  export default {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["import"],
        },
      },
    },
  };
  ```

- Classic variable overrides remain valid:

  ```scss
  $primary: #0d6efd;
  @import "@gernst/bootstrap/scss/bootstrap";
  ```

### JavaScript

- Vanilla JavaScript only, as upstream: no jQuery dependency. The optional jQuery bridge
  (`jQueryInterface`, `bootstrap.Modal.getInstance($el)` interop) still activates when
  `window.jQuery` is detected, and now accepts jQuery 4.
- Popper 2 via `@popperjs/core`, bundled in `bootstrap.bundle.js` / `bootstrap.bundle.min.js`.
- ESM (`dist/js/bootstrap.esm.js`) and UMD outputs unchanged.

## Sass modules (`scss/module/`)

A parallel Sass tree based on `@use`/`@forward` is provided in `scss/module/`. It generates CSS
identical to the legacy tree (verified by `npm run test-css-module`).

```scss
// Configure variables before loading the framework
@use "@gernst/bootstrap/scss/module/variables" as vars with (
  $primary: #ff0000
);
@use "@gernst/bootstrap/scss/module/bootstrap";
```

Key differences from the legacy tree:

- Members are namespaced: `variables.$primary`, `functions.tint-color()`,
  `mixins.media-breakpoint-up()`, `rfs.rfs()`.
- Functions that depend on variables (`rgba-css-var`, `color-contrast`, `escape-svg`,
  `assert-ascending`, …) live in the `variables` module instead of `functions`.
- The grid entry point configures `mixins/grid` with `$include-column-box-sizing: true` and
  passes a `$utilities-subset` configuration to `utilities/api` instead of reassigning the
  global `$utilities` map.
- Cross-file `@extend` usage is preserved; where the extension graph could not cross module
  boundaries, merged selector lists are written out explicitly.

## Compatibility

| Tool            | Minimum supported |
| --------------- | ----------------- |
| Dart Sass       | 1.79+             |
| Node.js (build) | 22 LTS            |
| @popperjs/core  | 2.11+             |
| Browsers        | modern + ESR      |
