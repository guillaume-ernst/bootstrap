<p align="center">
  <a href="https://getbootstrap.com/docs/4.6/">
    <img src="https://getbootstrap.com/docs/4.6/assets/brand/bootstrap-solid.svg" alt="Bootstrap logo" width="72" height="72">
  </a>
</p>

<h3 align="center">@gernst/bootstrap</h3>

<p align="center">
  Maintained fork of Bootstrap 4, modernized for Dart Sass 2, jQuery 4 and Popper 2.
  <br>
  All releases stay on major version 4 to avoid any confusion with Bootstrap 5.
  <br>
  <br>
  <a href="https://github.com/guillaume-ernst/bootstrap/issues">Report an issue</a>
</p>

## Goal

Bootstrap 4.x is no longer actively maintained upstream, but it remains widely used (e.g. AdminLTE 3). This fork keeps a version compatible with 2026-era toolchains without adding new features.

## Installation

```bash
npm install @gernst/bootstrap
```

```scss
// With @import (legacy scss/ tree, import warning can be silenced)
$primary: #0056b3;
@import "@gernst/bootstrap/scss/bootstrap";

// With @use (scss/module/ tree, recommended)
@use "@gernst/bootstrap/scss/module/bootstrap" with (
  $primary: #0056b3
);
```

```js
// Bundle including Popper 2
import "@gernst/bootstrap/dist/js/bootstrap.bundle";

// Standalone: jQuery and @popperjs/core expected as dependencies
import "@gernst/bootstrap/dist/js/bootstrap";
```

## AdminLTE 3

AdminLTE 3 works as-is with the fork via an npm alias:

```json
{
  "dependencies": {
    "bootstrap": "npm:@gernst/bootstrap@^4.7.0"
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

## Documentation

- [MIGRATION.md](./MIGRATION.md) — changes compared to Bootstrap 4.6.2
- [CHANGELOG.md](./CHANGELOG.md)
- Upstream Bootstrap 4.6 docs: https://getbootstrap.com/docs/4.6/

## License

The original code is MIT licensed (Copyright Twitter, Inc. and The Bootstrap Authors). This fork adds modifications copyrighted by Guillaume Ernst, also under MIT. See [LICENSE](./LICENSE).
