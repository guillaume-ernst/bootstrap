import {
  describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi
} from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Toast from '../../js/src/toast'
describe('toast plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
    expect($(document.body).toast).toBeTruthy()
  })
})
describe('toast', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
    $.fn.bootstrapToast = $.fn.toast.noConflict()
  })
  afterEach(() => {
    $.fn.toast = $.fn.bootstrapToast
    delete $.fn.bootstrapToast
    clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
    expect(typeof $.fn.toast).toBe('undefined')
  })
  it('should return the current version', () => {
    expect.assertions(1)
    expect(typeof Toast.VERSION).toBe('string')
  })
  it('should throw explicit error on undefined method', () => {
    expect.assertions(1)
    var $el = $('<div/>')
    $el.bootstrapToast()
    try {
      $el.bootstrapToast('noMethod')
    } catch (error) {
      expect(error.message).toBe('No method named "noMethod"')
    }
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
    var $el = $('<div/>')
    var $toast = $el.bootstrapToast()
    expect($toast instanceof $).toBe(true)
    expect($toast[0]).toBe($el[0])
  })
  it('should auto hide', () => new Promise(resolve => {
    expect.assertions(1)
    var toastHtml = '<div class="toast" data-delay="1">' + '<div class="toast-body">' + 'a simple toast' + '</div>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast().appendTo($('#qunit-fixture'))
    $toast.on('hidden.bs.toast', function () {
      expect($toast.hasClass('show')).toBe(false)
      resolve()
    }).bootstrapToast('show')
  }))
  it('should not add fade class', () => new Promise(resolve => {
    expect.assertions(1)
    var toastHtml = '<div class="toast" data-delay="1" data-animation="false">' + '<div class="toast-body">' + 'a simple toast' + '</div>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast().appendTo($('#qunit-fixture'))
    $toast.on('shown.bs.toast', function () {
      expect($toast.hasClass('fade')).toBe(false)
      resolve()
    }).bootstrapToast('show')
  }))
  it('should allow to hide toast manually', () => new Promise(resolve => {
    expect.assertions(1)
    var toastHtml = '<div class="toast" data-delay="1" data-autohide="false">' + '<div class="toast-body">' + 'a simple toast' + '</div>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast().appendTo($('#qunit-fixture'))
    $toast.on('shown.bs.toast', function () {
      $toast.bootstrapToast('hide')
    }).on('hidden.bs.toast', function () {
      expect($toast.hasClass('show')).toBe(false)
      resolve()
    }).bootstrapToast('show')
  }))
  it('should do nothing when we call hide on a non shown toast', () => {
    expect.assertions(1)
    var $toast = $('<div />').bootstrapToast().appendTo($('#qunit-fixture'))
    var spy = sinon.spy($toast[0].classList, 'contains')
    $toast.bootstrapToast('hide')
    expect(spy.called).toBe(true)
  })
  it('should allow to destroy toast', () => {
    expect.assertions(2)
    var $toast = $('<div />').bootstrapToast().appendTo($('#qunit-fixture'))
    expect(typeof $toast.data('bs.toast')).not.toBe('undefined')
    $toast.bootstrapToast('dispose')
    expect(typeof $toast.data('bs.toast')).toBe('undefined')
  })
  it('should allow to destroy toast and hide it before that', () => new Promise(resolve => {
    expect.assertions(4)
    var toastHtml = '<div class="toast" data-delay="0" data-autohide="false">' + '<div class="toast-body">' + 'a simple toast' + '</div>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast().appendTo($('#qunit-fixture'))
    $toast.one('shown.bs.toast', function () {
      setTimeout(function () {
        expect($toast.hasClass('show')).toBe(true)
        expect(typeof $toast.data('bs.toast')).not.toBe('undefined')
        $toast.bootstrapToast('dispose')
        expect(typeof $toast.data('bs.toast')).toBe('undefined')
        expect($toast.hasClass('show')).toBe(false)
        resolve()
      }, 1)
    }).bootstrapToast('show')
  }))
  it('should allow to config in js', () => new Promise(resolve => {
    expect.assertions(1)
    var toastHtml = '<div class="toast">' + '<div class="toast-body">' + 'a simple toast' + '</div>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast({
      delay: 1
    }).appendTo($('#qunit-fixture'))
    $toast.on('shown.bs.toast', function () {
      expect($toast.hasClass('show')).toBe(true)
      resolve()
    }).bootstrapToast('show')
  }))
  it('should close toast when close element with data-dismiss attribute is set', () => new Promise(resolve => {
    expect.assertions(2)
    var toastHtml = '<div class="toast" data-delay="1" data-autohide="false" data-animation="false">' + '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">' + 'close' + '</button>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast().appendTo($('#qunit-fixture'))
    $toast.on('shown.bs.toast', function () {
      expect($toast.hasClass('show')).toBe(true)
      var button = $toast.find('.close')
      button.trigger('click')
    }).on('hidden.bs.toast', function () {
      expect($toast.hasClass('show')).toBe(false)
      resolve()
    }).bootstrapToast('show')
  }))
  it('should expose default setting to allow to override them', () => {
    expect.assertions(1)
    var defaultDelay = 1000
    Toast.Default.delay = defaultDelay
    var toastHtml = '<div class="toast" data-autohide="false" data-animation="false">' + '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">' + 'close' + '</button>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast()
    var toast = $toast.data('bs.toast')
    expect(toast._config.delay).toBe(defaultDelay)
  })
  it('should not trigger shown if show is prevented', () => new Promise(resolve => {
    expect.assertions(1)
    var toastHtml = '<div class="toast" data-delay="1" data-autohide="false">' + '<div class="toast-body">' + 'a simple toast' + '</div>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast().appendTo($('#qunit-fixture'))
    var shownCalled = false
    function assertDone() {
      setTimeout(function () {
        expect(shownCalled).toBe(false)
        resolve()
      }, 20)
    }

    $toast.on('show.bs.toast', function (event) {
      event.preventDefault()
      assertDone()
    }).on('shown.bs.toast', function () {
      shownCalled = true
    }).bootstrapToast('show')
  }))
  it('should clear timeout if toast is shown again before it is hidden', () => new Promise(resolve => {
    expect.assertions(2)
    var toastHtml = '<div class="toast">' + '<div class="toast-body">' + 'a simple toast' + '</div>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast().appendTo($('#qunit-fixture'))
    var toast = $toast.data('bs.toast')
    var spyClearTimeout = sinon.spy(toast, '_clearTimeout')
    setTimeout(function () {
      toast._config.autohide = false
      $toast.on('shown.bs.toast', function () {
        expect(spyClearTimeout.called).toBe(true)
        expect(toast._timeout).toBe(null)
        resolve()
      })
      $toast.bootstrapToast('show')
    }, toast._config.delay / 2)
    $toast.bootstrapToast('show')
  }))
  it('should not trigger hidden if hide is prevented', () => new Promise(resolve => {
    expect.assertions(1)
    var toastHtml = '<div class="toast" data-delay="1" data-autohide="false">' + '<div class="toast-body">' + 'a simple toast' + '</div>' + '</div>'
    var $toast = $(toastHtml).bootstrapToast().appendTo($('#qunit-fixture'))
    var hiddenCalled = false
    function assertDone() {
      setTimeout(function () {
        expect(hiddenCalled).toBe(false)
        resolve()
      }, 20)
    }

    $toast.on('shown.bs.toast', function () {
      $toast.bootstrapToast('hide')
    }).on('hide.bs.toast', function (event) {
      event.preventDefault()
      assertDone()
    }).on('hidden.bs.toast', function () {
      hiddenCalled = true
    }).bootstrapToast('show')
  }))
})
