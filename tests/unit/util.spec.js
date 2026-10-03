import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Util from '../../js/src/util'

describe('util', () => {
  afterEach(() => {
    clearFixture()
  })
  it('Util.getSelectorFromElement should return the correct element', () => {
    expect.assertions(2)

        var $el = $('<div data-target="body"></div>').appendTo($('#qunit-fixture'))
        expect(Util.getSelectorFromElement($el[0])).toBe('body')

        // Not found element
        var $el2 = $('<div data-target="#fakeDiv"></div>').appendTo($('#qunit-fixture'))
        expect(Util.getSelectorFromElement($el2[0])).toBe(null)
  })
  it('Util.getSelectorFromElement should return null when there is a bad selector', () => {
    expect.assertions(2)

        var $el = $('<div data-target="#1"></div>').appendTo($('#qunit-fixture'))

        expect(Util.getSelectorFromElement($el[0])).toBe(null)

        var $el2 = $('<a href="/posts"></a>').appendTo($('#qunit-fixture'))

        expect(Util.getSelectorFromElement($el2[0])).toBe(null)
  })
  it('Util.typeCheckConfig should thrown an error when a bad config is passed', () => {
    expect.assertions(1)
        var namePlugin = 'collapse'
        var defaultType = {
          toggle: 'boolean',
          parent: '(string|element)'
        }
        var config = {
          toggle: true,
          parent: 777
        }

        try {
          Util.typeCheckConfig(namePlugin, config, defaultType)
        } catch (error) {
          expect(error.message).toBe('COLLAPSE: Option "parent" provided type "number" but expected type "(string|element)".')
        }
  })
  it('Util.typeCheckConfig should return null/undefined stringified when passed', () => {
    expect.assertions(1)
        var namePlugin = 'collapse'
        var defaultType = {
          toggle: '(null|undefined)'
        }
        var config = {
          toggle: null
        }

        Util.typeCheckConfig(namePlugin, config, defaultType)

        config.toggle = undefined

        Util.typeCheckConfig(namePlugin, config, defaultType)

        expect(true).toBe(true)
  })
  it('Util.isElement should check if we passed an element or not', () => {
    expect.assertions(3)
        var $div = $('<div id="test"></div>').appendTo($('#qunit-fixture'))

        expect(Util.isElement($div)).toBe(1)
        expect(Util.isElement($div[0])).toBe(1)
        expect(typeof Util.isElement({})).toBe('undefined')
  })
  it('Util.getTransitionDurationFromElement should accept transition durations in milliseconds', () => {
    expect.assertions(1)
        var $div = $('<div style="transition: all 300ms ease-out;"></div>').appendTo($('#qunit-fixture'))

        expect(Util.getTransitionDurationFromElement($div[0])).toBe(300)
  })
  it('Util.getTransitionDurationFromElement should accept transition durations in seconds', () => {
    expect.assertions(1)
        var $div = $('<div style="transition: all .4s ease-out;"></div>').appendTo($('#qunit-fixture'))

        expect(Util.getTransitionDurationFromElement($div[0])).toBe(400)
  })
  it('Util.getTransitionDurationFromElement should return the addition of transition-delay and transition-duration', () => {
    expect.assertions(2)
        var $fixture = $('#qunit-fixture')
        var $div = $('<div style="transition: all 0s 150ms ease-out;"></div>').appendTo($fixture)
        var $div2 = $('<div style="transition: all .25s 30ms ease-out;"></div>').appendTo($fixture)

        expect(Util.getTransitionDurationFromElement($div[0])).toBe(150)
        expect(Util.getTransitionDurationFromElement($div2[0])).toBe(280)
  })
  it('Util.getTransitionDurationFromElement should get the first transition duration if multiple transition durations are defined', () => {
    expect.assertions(1)
        var $div = $('<div style="transition: transform .3s ease-out, opacity .2s;"></div>').appendTo($('#qunit-fixture'))

        expect(Util.getTransitionDurationFromElement($div[0])).toBe(300)
  })
  it('Util.getTransitionDurationFromElement should return 0 if transition duration is not defined', () => {
    expect.assertions(1)
        var $div = $('<div></div>').appendTo($('#qunit-fixture'))

        expect(Util.getTransitionDurationFromElement($div[0])).toBe(0)
  })
  it('Util.getTransitionDurationFromElement should return 0 if element is not found in DOM', () => {
    expect.assertions(1)
        var $div = $('#fake-id')

        expect(Util.getTransitionDurationFromElement($div[0])).toBe(0)
  })
  it('Util.getUID should generate a new id uniq', () => {
    expect.assertions(2)
        var id = Util.getUID('test')
        var id2 = Util.getUID('test')

        expect(id).not.toBe(id2)

        id = Util.getUID('test')
        $('<div id="' + id + '"></div>').appendTo($('#qunit-fixture'))

        id2 = Util.getUID('test')
        expect(id).not.toBe(id2)
  })
  it('Util.supportsTransitionEnd should return true', () => {
    expect.assertions(1)
        expect(Util.supportsTransitionEnd()).toBe(true)
  })
  it('Util.jQueryDetection should detect jQuery', () => {
    expect.assertions(0)
        Util.jQueryDetection()
  })
})
