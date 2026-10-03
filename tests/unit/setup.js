// Vitest setup: shims for the Jasmine APIs used by the upstream test suite.
import { expect, vi } from 'vitest'

const wrapSpy = spy => {
  spy.and = {
    callThrough: () => spy.mockImplementation(spy._original),
    returnValue: value => spy.mockReturnValue(value),
    callFake: fn => spy.mockImplementation(fn),
    stub: () => spy.mockImplementation(() => {})
  }
  spy.calls = {
    count: () => spy.mock.calls.length,
    allArgs: () => spy.mock.calls,
    mostRecent: () => ({ args: spy.mock.calls.at(-1) ?? [] }),
    first: () => ({ args: spy.mock.calls[0] ?? [] }),
    argsForCall: index => spy.mock.calls[index],
    reset: () => spy.mockClear()
  }
  return spy
}

// Jasmine semantics: a bare spyOn is a stub; callThrough is opt-in. Vitest's
// spyOn keeps calling the original, so we stub it and remember the original.
globalThis.spyOn = (object, method) => {
  const original = object[method]
  const spy = wrapSpy(vi.spyOn(object, method))
  spy._original = original
  spy.mockImplementation(() => {})
  return spy
}

globalThis.spyOnProperty = (object, property, accessType = 'get') => {
  const descriptor = Object.getOwnPropertyDescriptor(object, property) ??
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(object), property)
  const spy = wrapSpy(vi.spyOn(object, property, accessType))
  spy._original = descriptor?.[accessType]
  spy.mockImplementation(() => {})
  return spy
}

globalThis.createSpy = () => wrapSpy(vi.fn())

globalThis.jasmine = {
  any: expect.any,
  objectContaining: expect.objectContaining,
  createSpy: globalThis.createSpy
}

// Custom matchers provided upstream by jasmine-jquery
expect.extend({
  toHaveClass(element, className) {
    return {
      pass: element instanceof Element && element.classList.contains(className),
      message: () => `expected element ${this.isNot ? 'not ' : ''}to have class "${className}"`
    }
  },
  nothing() {
    return { pass: true, message: () => '' }
  },
  toHaveSize(collection, size) {
    return {
      pass: collection && collection.length === size,
      message: () => `expected collection to have size ${size}`
    }
  }
})

// jsdom stubs for APIs Bootstrap uses but jsdom does not implement
class IntersectionObserverStub {
  constructor(callback, options = {}) {
    this._callback = callback
    this._elements = new Set()
    this.root = options.root ?? null
    this.rootMargin = options.rootMargin ?? '0px 0px 0px 0px'
    this.thresholds = Array.isArray(options.threshold) ?
      options.threshold :
      [options.threshold ?? 0]
  }

  observe(element) {
    this._elements.add(element)
    // jsdom has no layout or real intersection detection; report every
    // observed element as intersecting so consumers can exercise their
    // callback path.
    setTimeout(() => {
      if (this._elements.has(element)) {
        this._callback([
          {
            isIntersecting: true,
            intersectionRatio: 1,
            target: element,
            boundingClientRect: element.getBoundingClientRect()
          }
        ], this)
      }
    }, 0)
  }

  unobserve(element) {
    this._elements.delete(element)
  }

  disconnect() {
    this._elements.clear()
  }

  takeRecords() {
    return []
  }
}

globalThis.IntersectionObserver ??= IntersectionObserverStub

class TransitionEventStub extends Event {
  constructor(type, init = {}) {
    super(type, init)
    this.propertyName = init.propertyName ?? ''
    this.elapsedTime = init.elapsedTime ?? 0
    this.pseudoElement = init.pseudoElement ?? ''
  }
}

globalThis.TransitionEvent ??= TransitionEventStub

// jsdom does not implement CSS.escape (used by util/index.js parseSelector)
globalThis.CSS ??= {}
// Plain backslash escapes are what jsdom's selector parser supports.
// Note: identifiers starting with a digit cannot be expressed this way.
const cssEscape = id => id.replaceAll(/[^\w-]/g, String.raw`\$&`)

globalThis.CSS.escape ??= cssEscape

// After jsdom teardown, trailing timers (e.g. emulateTransitionEnd) may still
// call dispatchEvent with a Node-native Event, which jsdom rejects with an
// unhandled exception. Drop those late events instead.
const JSDOMEvent = globalThis.Event
const originalDispatchEvent = Element.prototype.dispatchEvent
Element.prototype.dispatchEvent = function (event) {
  if (!(event instanceof JSDOMEvent)) {
    return false
  }
  return originalDispatchEvent.call(this, event)
}

// Touch gesture simulator (was loaded as a global script by karma)
// Its IIFE registers window.Simulator and fakes touch support when
// PointerEvent is unavailable, which is the case under jsdom.
import 'hammer-simulator'
