<h3 align="center">bootstrap-modernized</h3>

<p align="center">
  Maintained Bootstrap forks modernized for 2026-era stacks.
  <br>
  Dart Sass 2/3, Sass modules, jQuery 4 (v4) or vanilla JS (v5), Popper 2, Node.js 22 toolchain.
  <br>
  <em>Unofficial community fork — not affiliated with the Bootstrap team.</em>
  <br>
  <br>
  <a href="https://guillaume-ernst.github.io/bootstrap-modernized/demo/">Live demos</a>
  ·
  <a href="https://github.com/guillaume-ernst/bootstrap-modernized/issues">Report an issue</a>
</p>

## Two maintained major-version lines

This repository carries two independent modernization branches. Pick the line matching the
Bootstrap major version your project already uses — drop-in compatibility is preserved, and
each line stays on its own major version forever.

### [`v4-modern`](../../tree/v4-modern) — Bootstrap 4, modernized

For projects stuck on Bootstrap 4 (AdminLTE 3, legacy dashboards, jQuery plugins). Byte-identical
CSS output to 4.6.2, verified by golden tests.

```sh
npm install bootstrap-modernized@^4
# or alias it to keep every existing "bootstrap" import working:
npm install bootstrap@npm:bootstrap-modernized@^4
```

- jQuery 4 support (jQuery 3 still works), Popper 2 under the hood
- Dart Sass 2/3 clean `@import` sources + a parallel `scss/module/` tree using `@use`/`@forward`
- AdminLTE 3 compatibility verified in CI on Chromium, Firefox and WebKit
- [Live demo](https://guillaume-ernst.github.io/bootstrap-modernized/demo/v4/) ·
  [Migration guide](../../tree/v4-modern#readme) ·
  [README](../../tree/v4-modern)

### [`v5-modern`](../../tree/v5-modern) — Bootstrap 5, modernized

For projects on Bootstrap 5 that want a forward-compatible Sass/toolchain base on top of 5.3.8.

```sh
npm install bootstrap-modernized@^5
# or:
npm install bootstrap@npm:bootstrap-modernized@^5
```

- Vanilla JS + Popper 2 (unchanged upstream architecture), no jQuery
- All remaining Dart Sass deprecations removed; `scss/module/` `@use`/`@forward` tree ready for Dart Sass 3
- ESLint 9, Vitest, Playwright, Node.js 22 CI
- [Live demo](https://guillaume-ernst.github.io/bootstrap-modernized/demo/v5/) ·
  [README](../../tree/v5-modern)

## Why this fork exists

Bootstrap 4 is unmaintained yet still powers a large installed base. Upstream Bootstrap 5 compiles
fine but carries deprecation warnings under modern Dart Sass. `bootstrap-modernized` keeps both
majors compiling, installing and running like 2026 libraries — without forcing a major migration.

## Other branches

- [`gh-pages`](../../tree/gh-pages) — live demos under `demo/`, plus the preserved upstream docs site
- `main` — mirrors upstream Bootstrap for provenance; the maintained work happens on `v4-modern` and `v5-modern`

## License

MIT — see [LICENSE](LICENSE). Original copyright: Twitter, Inc. and The Bootstrap Authors.
