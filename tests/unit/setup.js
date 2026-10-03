import $ from 'jquery'
import * as Popper from '@popperjs/core'

globalThis.jQuery = $
globalThis.$ = $
globalThis.Popper = Popper

// jsdom has no layout engine, so jQuery's :visible selector (which relies on
// offset dimensions) always returns false. Patch it to fall back to display/visibility.
if ($.expr && $.expr.pseudos) {
  $.expr.pseudos.visible = elem => {
    const style = globalThis.getComputedStyle(elem)
    return style.display !== 'none' && style.visibility !== 'hidden'
  }
}

// Provide sensible viewport dimensions so Bootstrap's scrollbar-width logic
// and other layout-dependent code does not compute NaN values under jsdom.
if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'innerWidth', { value: 1024, writable: true })
  Object.defineProperty(globalThis, 'innerHeight', { value: 768, writable: true })
}

if (typeof document !== 'undefined' && document.documentElement) {
  Object.defineProperty(document.documentElement, 'clientWidth', { value: 1008, writable: true })
  Object.defineProperty(document.documentElement, 'clientHeight', { value: 768, writable: true })
  Object.defineProperty(document.body, 'clientWidth', { value: 1008, writable: true })
  Object.defineProperty(document.body, 'clientHeight', { value: 768, writable: true })
}

// Provide the fixture element that QUnit creates automatically.
if (!document.getElementById('qunit-fixture')) {
  const fixture = document.createElement('div')
  fixture.id = 'qunit-fixture'
  document.body.appendChild(fixture)
}
