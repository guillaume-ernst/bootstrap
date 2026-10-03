<p align="center">
  <a href="https://getbootstrap.com/docs/4.6/">
    <img src="https://getbootstrap.com/docs/4.6/assets/brand/bootstrap-solid.svg" alt="Bootstrap logo" width="72" height="72">
  </a>
</p>

<h3 align="center">@gernst/bootstrap</h3>

<p align="center">
  Fork maintenu de Bootstrap 4, modernisé pour Dart Sass 2, jQuery 4 et Popper 2.
  <br>
  Toutes les releases restent en majeure 4 pour éviter toute confusion avec Bootstrap 5.
  <br>
  <br>
  <a href="https://github.com/guillaume-ernst/bootstrap/issues">Signaler un problème</a>
</p>

## Objectif

Bootstrap 4.x n'est plus maintenu activement par l'amont, mais il reste très utilisé (p. ex. AdminLTE 3). Ce fork vise à maintenir une version compatible avec les chaînes d'outils de 2026 sans ajouter de nouvelles fonctionnalités.

## Installation

```bash
npm install @gernst/bootstrap
```

```scss
// Avec @import (toujours supporté, avertissement import silençable)
$primary: #0056b3;
@import "@gernst/bootstrap/scss/bootstrap";

// Avec @use
@use "@gernst/bootstrap/scss/bootstrap" with (
  $primary: #0056b3
);
```

```js
// Bundle incluant Popper 2
import "@gernst/bootstrap/dist/js/bootstrap.bundle";

// Standalone : jQuery et @popperjs/core attendus en dépendances
import "@gernst/bootstrap/dist/js/bootstrap";
```

## Compatibilité

| Outil           | Minimum supporté |
| --------------- | ---------------- |
| Dart Sass       | 1.79+            |
| Node.js (build) | 22 LTS           |
| jQuery          | 3.5+ (4.x OK)    |
| @popperjs/core  | 2.11+            |
| Navigateurs     | modernes + ESR   |

## Documentation

- [MIGRATION.md](./MIGRATION.md) — changements par rapport à Bootstrap 4.6.2
- [CHANGELOG.md](./CHANGELOG.md)
- Documentation Bootstrap 4.6 amont : https://getbootstrap.com/docs/4.6/

## Licences

Le code original est sous licence MIT (Copyright Twitter, Inc. et The Bootstrap Authors). Ce fork y ajoute des modifications sous copyright Guillaume Ernst, toujours sous licence MIT. Voir [LICENSE](./LICENSE).
