# Agent guide — bootstrap-modernized

This file tells an agent how to migrate a consumer project from the legacy `bootstrap` npm
package to this fork (`bootstrap-modernized`), and how to work inside this repository.

Two maintained branches exist:

- `v4-modern` — this branch. Fork of Bootstrap 4.6.2 (jQuery 3.5+/4, Popper 2), for projects
  stuck on v4 such as AdminLTE 3. Releases stay on major version 4.
- `v5-modern` — fork of Bootstrap 5.3.8 (vanilla JS, Popper 2). Releases stay on major
  version 5.

Pick the branch matching the project's current Bootstrap major version. Never migrate a project
across major versions as part of this swap.

## Migrating a consumer project

### 1. Swap the dependency

```json
{
  "dependencies": {
    "bootstrap": "npm:bootstrap-modernized@^4.7.0"
  }
}
```

The npm alias keeps every `import "bootstrap"` / `@import "bootstrap"` working unchanged,
including webpack `~bootstrap` prefixes used by themes like AdminLTE 3.

Alternatively depend on `bootstrap-modernized` directly and update import specifiers.

### 2. JavaScript and jQuery

- The fork accepts jQuery `>=3.5 <5` — code written for jQuery 3 works with jQuery 4; verify the
  project's other jQuery plugins separately (select2, DataTables, daterangepicker may need
  `jquery-migrate`).
- Popper v1 (`popper.js`) is replaced by `@popperjs/core` v2. The `bootstrap.bundle` build embeds
  Popper 2; the standalone build expects `@popperjs/core` as a dependency.
- Legacy Popper v1 options (`fallbackPlacement`, `boundary: "scrollParent"`, string `offset`)
  are translated to the v2 API inside the components — consumer code needs no changes.
- `$.fn.*` plugin interfaces (`.modal()`, `.tooltip()`, …) are unchanged.

### 3. AdminLTE 3

AdminLTE 3 works as-is against the fork via the npm alias — both its Sass (`~bootstrap`
imports) and `adminlte.js` run unchanged (PushMenu, CardWidget, Treeview, Layout). A fixture in
`tests/adminlte/` verifies this in CI. No source changes are needed; just swap the dependency
and rebuild.

### 4. Sass — two trees, pick one

The package ships two Sass trees:

- `scss/` — legacy `@import` tree, byte-compatible with upstream. Works out of the box; emits
  the `@import` deprecation warning under Dart Sass.
- `scss/module/` — `@use`/`@forward` tree, no warnings, recommended for new code. Produces
  CSS identical to the legacy tree. The package also exposes
  `bootstrap-modernized/scss/module*` through `exports`.

Option A — keep `@import` (zero-effort):

```scss
$primary: #0056b3;
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
@use "bootstrap/scss/module/variables" as vars with (
  $primary: #0056b3
);
@use "bootstrap/scss/module/bootstrap";
```

Rules for the module tree:

- Every member is namespaced: `variables.$primary`, `functions.tint-color()`,
  `mixins.media-breakpoint-up()`, `rfs.rfs()`. Rewrite references accordingly.
- `with()` configuration must target the module that declares the variable (mostly
  `variables`). You cannot configure `bootstrap.scss` itself.
- Functions that read variables (`color`, `theme-color`, `color-yiq`, `gray`,
  `theme-color-level`, `escape-svg`) live in the `variables` module, not `functions`.
- Overriding a variable *before* `@import` is not possible in module semantics — use
  `with()` on `variables` instead. This is the one intentional breaking change vs. the legacy
  tree.
- `@import` and `@use` trees must not be mixed in the same compilation unit.

### 5. Verify

- Rebuild CSS and diff rendered output — class names and markup expectations are unchanged;
  any visual diff indicates an integration error.
- Exercise interactive components (modal, dropdown, tooltip, popover) — the JS API and data
  attributes are identical to upstream 4.6.2.
- For Sass module migration, compile each entry point; namespace errors surface at compile
  time, not runtime.

## Working inside this repository

- Build: `npm run dist` · Test: `npm test` (lint, unit, sass, e2e, golden via `test:unit`,
  `test:sass`, `test:e2e`, `test:golden`).
- `npm run test:golden` compares generated CSS against the committed upstream baseline and
  checks `scss/` ↔ `scss/module/` parity; it must stay green after any Sass change.
- `npm run adminlte-check` compiles AdminLTE's Sass against both the fork and upstream 4.6.2
  and diffs the result.
- Unit tests run in jsdom (Vitest); layout- or focus-geometry-dependent behavior belongs in
  Playwright (`tests/e2e/`), including the AdminLTE smoke tests.
- Commits use conventional commit format.
