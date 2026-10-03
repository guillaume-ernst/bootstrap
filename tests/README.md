# Tests

Cette section contient les filets de sécurité du fork.

- `tests/golden/` — CSS de référence généré par le build officiel v4.6.2 (libsass).  
  Toute modification du Sass doit produire un golden diff nul après normalisation.
- `build/css-normalize.js` — normalise un fichier CSS pour comparaison via `diff`.
- `tests/sass/` — tests sass-true et de surcharge (`@import` et `@use ... with()`).
- `tests/e2e/` — tests visuels et comportementaux Playwright sur chaque composant.
- `tests/unit/` — tests unitaires Vitest (migration depuis QUnit/Karma).

## Baseline upstream

- Version de départ : `v4.6.2`
- Nombre de tests QUnit originaux : 12 fichiers, ~9 300 lignes.
- La suite Karma d'origine ne peut pas être exécutée sur Node 20+ (node-sass 6).  
  Les résultats de référence proviennent du CI upstream et de la migration vers Vitest.
