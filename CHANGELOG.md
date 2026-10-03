# Changelog

Toutes les modifications notables de ce projet seront documentées ici.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/spec/v2.0.0.html).

## [4.7.0-dev]

### Ajout

- Fork de Bootstrap 4.6.2 sous le nom de paquet `@gernst/bootstrap`.
- Toolchain Node.js 22, Dart Sass, Rollup 4, Vitest et Playwright.
- Tests de golden CSS, de parité des arbres Sass (`css-module-check`) et de compatibilité AdminLTE (`adminlte-check`).
- Arbre Sass parallèle `scss/module/` basé sur `@use`/`@forward`, avec configuration via `@use ... with ()` ; l'arbre `scss/` historique reste intact pour les consommateurs en `@import`.
- Suite de tests unitaires Vitest (remplace Karma/QUnit) et tests navigateur Playwright (modal, dropdown, tooltip, adminlte) sur Chromium, Firefox et WebKit.
- Sorties ESM/UMD et `exports` dans `package.json`, avec champs `sass` et `style`.
- Workflows GitHub Actions : lint, css, js, e2e, release avec provenance npm, et Dependabot.

### Modifié

- Sass : migration des fonctions globales (`map-get`, `mix`, `lighten`, etc.) vers les modules `sass:*`.
- Suppression des avertissements Dart Sass `global-builtin`, `color-functions`, `if-function`, `slash-div` et `abs-percent` ; seule la dépréciation `import` demeure dans l'arbre `scss/` et peut être silençable.
- JavaScript : jQuery 4 supporté en plus de jQuery 3 (la peer dependency accepte `>=3.5 <5` et la vérification de version a été ajustée).
- Popper : `popper.js` v1 remplacé par `@popperjs/core` v2 ; le bundle embarque Popper 2 et les options historiques (`fallbackPlacement`, `boundary`) sont traduites vers l'API v2.
- ESLint 9 (flat config) et stylelint alignés sur la syntaxe Sass moderne.
- Internet Explorer 11 n'est plus supporté ; les préfixes `-ms-*` et hacks IE ont été retirés.

## [4.6.2] - 2022-07-19

Version amont originale. Voir [twbs/bootstrap@v4.6.2](https://github.com/twbs/bootstrap/releases/tag/v4.6.2).

[4.7.0-dev]: https://github.com/guillaume-ernst/bootstrap/compare/v4.6.2...HEAD
[4.6.2]: https://github.com/twbs/bootstrap/releases/tag/v4.6.2
