# Guide de migration — @gernst/bootstrap v4

Ce fork maintient Bootstrap 4 avec une compatibilité moderne : Dart Sass 2, jQuery 4 et Popper 2. Toutes les releases restent en majeure 4 pour éviter toute confusion avec Bootstrap 5.

## Table des matières

- [4.7.0 — Modernisation du build](#470)
- [À venir — Modules Sass complets](#modules-sass-complets)
- [Compatibilité](#compatibilité)

## 4.7.0

### Node.js et navigateurs

- Node.js 22+ requis pour la toolchain.
- Internet Explorer 11 n'est plus pris en charge. Les préfixes `-ms-*` spécifiques et les hacks IE ont été retirés.
- La cible navigateur est ajustée à `>= 0.5%, last 2 versions, not dead, Firefox ESR`.

### Sass

- Le build officiel utilise maintenant Dart Sass.
- Les dépréciations Dart Sass suivantes sont corrigées : fonctions globales (`map-get`, `lighten`, `mix`, etc.), `slash-div`, `color-functions`, `mixed-decls`, `abs-percent`.
- La syntaxe `@import` fonctionne toujours. Cependant, Dart Sass affiche encore un avertissement `import` si vous surchargez des variables avant d'importer Bootstrap. Pour le masquer :

  ```js
  // vite.config.js
  export default {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import']
        }
      }
    }
  }
  ```

  ```bash
  sass --silence-deprecation=import --load-path=node_modules/@gernst/bootstrap/scss style.scss dist/style.css
  ```

- La surcharge classique reste valide :

  ```scss
  $primary: #0056b3;
  @import "@gernst/bootstrap/scss/bootstrap";
  ```

- `@use ... with()` est également pris en charge :

  ```scss
  @use "@gernst/bootstrap/scss/bootstrap" with (
    $primary: #0056b3
  );
  ```

### JavaScript

- jQuery 4 est supporté en plus de jQuery 3. jQuery 1.x/2.x ne le sont plus.
- Le paquet bundle embarque `@popperjs/core` v2. La globale reste `Popper` avec la nouvelle API `Popper.createPopper()`.
- Les options `fallbackPlacement` et `boundary` des tooltips/popovers/dropdowns sont toujours acceptées avec leur ancien nom ; elles sont traduites en interne vers les noms Popper 2 (`fallbackPlacements`, `rootBoundary`/`boundary`).

### Popper

- La peer dependency est passée de `popper.js` v1 à `@popperjs/core` v2.
- Si vous chargiez Popper manuellement via CDN, utilisez :

  ```html
  <script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>
  ```

### Package

- Le nom du paquet npm est `@gernst/bootstrap`.
- Le paquet expose `exports` pour ESM/UMD, Sass, CSS et chemins JS individuels.

## Modules Sass complets

Une future release 4.x passera de `@import` à `@use`/`@forward` en interne. Les chemins publics (`bootstrap/scss/bootstrap`, `bootstrap/scss/variables`, etc.) seront conservés, mais **la surcharge de variables avant `@import` ne fonctionnera plus**. La migration se fera via `@use ... with ()`. Une version import-only sera fournie temporairement pour faciliter la transition.

## Compatibilité

| Outil                 | Minimum supporté | Notes                                  |
|-----------------------|------------------|----------------------------------------|
| Dart Sass             | 1.79+            | `sass` npm                             |
| Node.js (build)       | 22 LTS           |                                        |
| jQuery                | 3.5+             | 4.x supporté                           |
| @popperjs/core        | 2.11+            | Bundle inclus ; peer pour standalone   |
| Navigateurs           | dernières versions + ESR | IE11 retiré                      |
