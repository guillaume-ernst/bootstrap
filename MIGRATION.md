# Migration guide — @gernst/bootstrap v4

This fork maintains Bootstrap 4 with modern compatibility: Dart Sass 2, jQuery 4 and Popper 2. All releases stay on major version 4 to avoid any confusion with Bootstrap 5.

## Table of contents

- [4.7.0 — Build modernization](#470)
- [Sass modules (`scss/module/`)](#sass-modules-scssmodule)
- [AdminLTE 3](#adminlte-3)
- [Compatibility](#compatibility)

## 4.7.0

### Node.js and browsers

- Node.js 22+ required for the toolchain.
- Internet Explorer 11 is no longer supported. IE-specific `-ms-*` prefixes and hacks have been removed.
- The browser target is adjusted to `>= 0.5%, last 2 versions, not dead, Firefox ESR`.

### Sass

- The official build now uses Dart Sass.
- The following Dart Sass deprecations are fixed: global functions (`map-get`, `lighten`, `mix`, etc.), `slash-div`, `color-functions`, `mixed-decls`, `abs-percent`.
- The `@import` syntax still works. However, Dart Sass emits an `import` warning if you override variables before importing Bootstrap. To silence it:

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

  ```bash
  sass --silence-deprecation=import --load-path=node_modules/@gernst/bootstrap/scss style.scss dist/style.css
  ```

- Classic variable overrides remain valid:

  ```scss
  $primary: #0056b3;
  @import "@gernst/bootstrap/scss/bootstrap";
  ```

- `@use ... with()` is also supported:

  ```scss
  @use "@gernst/bootstrap/scss/bootstrap" with (
    $primary: #0056b3
  );
  ```

### JavaScript

- jQuery 4 is supported alongside jQuery 3. jQuery 1.x/2.x are no longer supported.
- The bundle package embeds `@popperjs/core` v2. The global stays `Popper` with the new `Popper.createPopper()` API.
- The `fallbackPlacement` and `boundary` options of tooltips/popovers/dropdowns are still accepted under their old names; they are translated internally to the Popper 2 names (`fallbackPlacements`, `rootBoundary`/`boundary`).

### Popper

- The peer dependency moved from `popper.js` v1 to `@popperjs/core` v2.
- If you loaded Popper manually via CDN, use:

  ```html
  <script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>
  ```

### Package

- The npm package name is `@gernst/bootstrap`.
- The package exposes `exports` for ESM/UMD, Sass, CSS and individual JS paths.

## Sass modules (`scss/module/`)

A complete Sass tree based on `@use`/`@forward` is available under `scss/module/`, in parallel with the legacy `scss/` tree which remains untouched for `@import` consumers.

```scss
// Full, configurable entry point
@use "@gernst/bootstrap/scss/module/bootstrap" with (
  $primary: #0056b3,
  $enable-rounded: false
);
```

- Any `!default` variable can be configured via `with ()` on the entry point.
- The entry point re-exports `functions`, `variables` and `mixins`: the public API is accessible under a single namespace (`bootstrap.theme-color("primary")`, `@include bootstrap.border-radius()`, etc.).
- Lightweight variants: `@gernst/bootstrap/scss/module/bootstrap-grid` and `bootstrap-reboot`.
- The CSS output is identical to the `@import` tree's (verified by `npm run css-module-check`).

### Differences from `@import` overrides

```scss
// Legacy behavior (@import) — still valid with scss/
$primary: #0056b3;
@import "@gernst/bootstrap/scss/bootstrap";

// Module equivalent (scss/module/)
@use "@gernst/bootstrap/scss/module/bootstrap" with (
  $primary: #0056b3
);
```

Variable-dependent functions (`theme-color`, `color-yiq`, `color`, `gray`, `theme-color-level`, `escape-svg`) are defined in `scss/module/_variables.scss` to avoid a module cycle; they remain exposed through the entry point.

## AdminLTE 3

AdminLTE 3 targets Bootstrap 4 and works as-is with the fork. Replace the dependency with an npm alias:

```json
{
  "dependencies": {
    "admin-lte": "^3.2.0",
    "bootstrap": "npm:@gernst/bootstrap@^4.7.0"
  }
}
```

- Sass compilation: AdminLTE's `@import "~bootstrap/scss/..."` uses the `~` prefix (a webpack/sass-loader convention). Under Vite or plain Dart Sass, replace `~bootstrap` with `bootstrap` or use a compatible resolver.
- JavaScript: `adminlte.js` registers its jQuery plugins (`PushMenu`, `CardWidget`, `Treeview`, `Layout`) normally under jQuery 4.
- Verified by `npm run adminlte-check` (compiles `adminlte.scss` against both the fork and Bootstrap 4.6.2, then compares) and by Playwright tests (`tests/e2e/adminlte.spec.js`).

## Compatibility

| Tool            | Minimum supported | Notes                        |
| --------------- | ----------------- | ---------------------------- |
| Dart Sass       | 1.79+             | `sass` npm                   |
| Node.js (build) | 22 LTS            |                              |
| jQuery          | 3.5+              | 4.x supported                |
| @popperjs/core  | 2.11+             | Bundled; peer for standalone |
| Browsers        | latest + ESR      | IE11 removed                 |
