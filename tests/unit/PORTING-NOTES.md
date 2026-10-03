# QUnit → Vitest Porting Notes

This directory contains the Bootstrap 4 unit tests ported from `js/tests/unit/*.js` (QUnit) to `tests/unit/*.spec.js` (Vitest).

## Statistics

- Source files: 12 (`js/tests/unit/*.js`)
- Generated spec files: 12 (`tests/unit/*.spec.js`)
- Total `it()` / `it.skip()` blocks: **397**
  - Active tests: 392 (including 2 conditionally skipped via `it.skipIf`)
  - Hard-skipped tests: 5 (`it.skip`)

## Files Created / Updated

- `tests/unit/*.spec.js` — Vitest specs for each plugin/util.
- `tests/unit/helpers.js` — `getFixture()`, `setFixture(html)`, and `clearFixture()` helpers.
- `tests/unit/setup.js` — Existing setup file extended to ensure `#qunit-fixture` is present.

## Mapping Rules Applied

| QUnit                                                         | Vitest                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `QUnit.module('Name', hooks)`                                 | `describe('Name', () => { beforeEach(...); afterEach(...); ... })` |
| `QUnit.test('title', fn)`                                     | `it('title', () => { ... })` / `it('title', done => { ... })`      |
| `assert.expect(n)`                                            | `expect.assertions(n)`                                             |
| `assert.async()`                                              | `it('title', done => { ... })` callback style                      |
| `assert.ok(x)`                                                | `expect(x).toBeTruthy()`                                           |
| `assert.notOk(x)`                                             | `expect(x).toBeFalsy()`                                            |
| `assert.true(x)`                                              | `expect(x).toBe(true)`                                             |
| `assert.false(x)`                                             | `expect(x).toBe(false)`                                            |
| `assert.strictEqual(a, b)`                                    | `expect(a).toBe(b)`                                                |
| `assert.equal(a, b)`                                          | `expect(a).toBe(b)`                                                |
| `assert.deepEqual(a, b)`                                      | `expect(a).toEqual(b)`                                             |
| `assert.notStrictEqual(a, b)`                                 | `expect(a).not.toBe(b)`                                            |
| `assert.notEqual(a, b)`                                       | `expect(a).not.toEqual(b)`                                         |
| `assert.throws(fn, expected)` / `assert.raises(fn, expected)` | `expect(fn).toThrow(expected)`                                     |

## Skipped Tests

### Hard-skipped (`it.skip`)

The carousel swipe tests rely on the QUnit-only `Simulator` global for touch/pointer gesture simulation, which is not available under Vitest. These five tests are skipped with `it.skip()` so the suite can run without failing:

1. `carousel` → `should allow swiperight and call prev with pointer events`
2. `carousel` → `should allow swiperight and call prev with touch events`
3. `carousel` → `should allow swipeleft and call next with pointer events`
4. `carousel` → `should allow swipeleft and call next with touch events`
5. `carousel` → `should not allow pinch with touch events`

### Conditionally skipped (`it.skipIf`)

`util.spec.js` uses `it.skipIf()` to keep the original conditional registration based on `attachShadow` support:

- `Util.findShadowRoot should find the shadow DOM root`
- `Util.findShadowRoot should return null when attachShadow is not available`

## Modified / Hand-Converted Tests

### `util.spec.js`

The source used conditional QUnit registration:

```js
QUnit[supportsAttachShadow ? 'test' : 'skip']('Util.findShadowRoot ...', ...)
```

This was converted to Vitest's `it.skipIf()`:

- `it.skipIf(!supportsAttachShadow)('Util.findShadowRoot should find the shadow DOM root')`
- `it.skipIf(supportsAttachShadow)('Util.findShadowRoot should return null when attachShadow is not available')`

## Other Notable Conversions

- Top-level variables and helper functions declared before the first `QUnit.module()` in the source were preserved at module scope in the generated spec files (e.g., `stylesCarousel`, `supportPointerEvent`, `clearPointerEvents()`, `restorePointerEvents()` in `carousel.spec.js`).
- `assert.expect(0)` calls were removed because Vitest does not accept `expect.assertions(0)`.
- QUnit `before` / `after` hooks were mapped to Vitest `beforeAll` / `afterAll`.
- `$('#qunit-fixture').html('')` calls were replaced with `clearFixture()`.

## Unsupported QUnit APIs

The following QUnit APIs were not present in the source test suite, so no conversion was needed:

- `assert.step()` / `assert.verifySteps()`
- `assert.rejects()`
- `assert.raises()` (not used; only `assert.throws()` was used)

## Known Limitations / Things to Watch

- Carousel touch gesture coverage is incomplete because the `Simulator` helper is not included in the Vitest environment.
- `assert.equal()` was not used in the source, so the primitive/object distinction for `toBe` vs `toEqual` did not arise.
- Several tests use real `setTimeout` intervals. They were left as-is and rely on Vitest's default timeout; if flakiness appears, those tests can be migrated to `vi.useFakeTimers()`.
