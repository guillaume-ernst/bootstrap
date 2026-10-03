# Agent guide — bootstrap-modernized

This file tells an agent how to migrate a consumer project from the legacy `bootstrap` npm
package to this fork (`bootstrap-modernized`), and how to work inside this repository.

Two maintained branches exist:

- `v4-modern` — fork of Bootstrap 4.6.2 (jQuery 3.5+/4, Popper 2), for projects stuck on v4
  (e.g. AdminLTE 3). Releases stay on major version 4.
- `v5-modern` — fork of Bootstrap 5.3.8 (vanilla JS, Popper 2). Releases stay on major version 5.

Pick the branch matching the project's current Bootstrap major version. Never migrate a project
across major versions as part of this swap.

## Migrating a consumer project

### 1. Swap the dependency

Direct swap (source code may import `bootstrap` paths — see step 3):

```json
{
  "dependencies": {
    "bootstrap": "npm:bootstrap-modernized@^5.4.0"
  }
}
```

For Bootstrap 4 projects:

```json
{
  "dependencies": {
    "bootstrap": "npm:bootstrap-modernized@^4.7.0"
  }
}
```

The npm alias keeps every `import "bootstrap"` / `@import "bootstrap"` working unchanged,
including webpack `~bootstrap` prefixes used by themes like AdminLTE.

Alternatively depend on `bootstrap-modernized` directly and update import specifiers.

### 2. JavaScript — no changes needed (v5)

Bootstrap 5 is vanilla JS. `import "bootstrap"`, `import { Modal } from "bootstrap"` and the
`bootstrap.bundle` builds work identically. Popper 2 is bundled in the `*.bundle` files and is a
regular dependency for the standalone build — no consumer action required.

For v4 consumers: the fork accepts jQuery `>=3.5 <5`. Code written for jQuery 3 works with
jQuery 4; verify plugins of the project separately.

### 3. Sass — two trees, pick one

The package ships two Sass trees:

- `scss/` — legacy `@import` tree, byte-compatible with upstream. Works out of the box; emits
  the `@import` deprecation warning under Dart Sass.
- `scss/module/` — `@use`/`@forward` tree, no warnings, recommended for new code. Produces
  CSS identical to the legacy tree.

Option A — keep `@import` (zero-effort):

```scss
$primary: #ff0000;
@import "bootstrap/scss/bootstrap";
```

Optionally silence the warning in the bundler:

```js
// vite.config.js
export default {
  css: { preprocessorOptions: { scss: { silenceDeprecations: ["import"] } } },
};
```

Option B — migrate to modules (`@use`), recommended:

```scss
// Variables are configured through the variables module, NOT via global redefinition.
@use "bootstrap/scss/module/variables" as vars with (
  $primary: #ff0000,
  $body-bg: #fafafa
);
@use "bootstrap/scss/module/bootstrap";
```

Rules for the module tree:

- Every member is namespaced: `variables.$primary`, `functions.tint-color()`,
  `mixins.media-breakpoint-up()`, `rfs.rfs()`. Rewrite references accordingly —
  `$primary` becomes `variables.$primary` once imported via `@use "variables"`.
- `with()` configuration must target the module that declares the variable
  (mostly `variables`). You cannot configure `bootstrap.scss` itself.
- Functions that read variables (`rgba-css-var`, `color-contrast`, `escape-svg`) live in the
  `variables` module, not `functions`.
- The grid-only build uses `@use "bootstrap/scss/module/mixins/grid" with
  ($include-column-box-sizing: true)` and `utilities/api` accepts a `$utilities-subset`
  configuration instead of reassigning the global `$utilities` map.
- `@import` and `@use` trees must not be mixed in the same compilation unit.

### 4. Verify

- Rebuild CSS and diff rendered output — the public class names and CSS variables are
  unchanged, so any visual diff indicates an integration error.
- Exercise interactive components (dropdown, modal, offcanvas, scrollspy) — the JS API is
  identical to upstream 5.3.8.
- For Sass module migration, run a compile per entry point; namespace errors surface at
  compile time, not runtime.

## Working inside this repository

- Build: `npm run dist` · Test: `npm test` (lint, unit, sass, e2e, golden in parallel via
  `test:unit`, `test:sass`, `test:e2e`, `test:golden`).
- `npm run test:golden` compares generated CSS against the committed upstream baseline; it
  must stay green after any Sass change.
- The two Sass trees must keep output parity — `build/css-module-check.mjs` enforces it.
- Unit tests run in jsdom (Vitest); anything layout- or focus-geometry-dependent belongs in
  Playwright (`tests/e2e/`), not `it()` stubs.
- Commits use conventional commit format.
