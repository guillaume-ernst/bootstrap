import {
  describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi
} from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Modal from '../../js/src/modal'
import Util from '../../js/src/util'
describe('modal plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
    expect($(document.body).modal).toBeTruthy()
  })
})
describe('modal', () => {
  beforeAll(() => {
    // Enable the scrollbar measurer
    $('<style type="text/css"> .modal-scrollbar-measure { position: absolute; top: -9999px; width: 50px; height: 50px; overflow: scroll; } </style>').appendTo('head')
    // Function to calculate the scrollbar width which is then compared to the padding or margin changes
    $.fn.getScrollbarWidth = $.fn.modal.Constructor.prototype._getScrollbarWidth

    // Simulate scrollbars
    $('html').css('padding-right', '16px')
  })
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
    $.fn.bootstrapModal = $.fn.modal.noConflict()
  })
  afterEach(() => {
    $('.modal-backdrop, #modal-test').remove()
    $(document.body).removeClass('modal-open')
    $.fn.modal = $.fn.bootstrapModal
    delete $.fn.bootstrapModal
    clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
    expect(typeof $.fn.modal).toBe('undefined')
  })
  it('should throw explicit error on undefined method', () => {
    expect.assertions(1)
    var $el = $('<div id="modal-test"/>')
    $el.bootstrapModal()
    try {
      $el.bootstrapModal('noMethod')
    } catch (error) {
      expect(error.message).toBe('No method named "noMethod"')
    }
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
    var $el = $('<div id="modal-test"/>')
    var $modal = $el.bootstrapModal()
    expect($modal instanceof $).toBe(true)
    expect($modal[0]).toBe($el[0])
  })
  it('should expose defaults var for settings', () => {
    expect.assertions(1)
    expect($.fn.bootstrapModal.Constructor.Default).toBeTruthy()
  })
  it('should insert into dom when show method is called', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div id="modal-test"/>').on('shown.bs.modal', function () {
      expect($('#modal-test').length).not.toBe(0)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should fire show event', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div id="modal-test"/>').on('show.bs.modal', function () {
      expect(true).toBeTruthy()
      resolve()
    }).bootstrapModal('show')
  }))
  it('should not fire shown when show was prevented', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div id="modal-test"/>').on('show.bs.modal', function (e) {
      e.preventDefault()
      expect(true).toBeTruthy()
      resolve()
    }).on('shown.bs.modal', function () {
      expect(false).toBeTruthy()
    }).bootstrapModal('show')
  }))
  it('should be shown after the first call to show() has been prevented while fading is enabled', () => new Promise(resolve => {
    expect.assertions(2)
    var $el = $('<div class="modal fade"><div class="modal-dialog" style="transition-duration: 20ms;"/></div>').appendTo('#qunit-fixture')
    var prevented = false
    $el.on('show.bs.modal', function (e) {
      if (!prevented) {
        e.preventDefault()
        prevented = true
        setTimeout(function () {
          $el.bootstrapModal('show')
        })
      }
    }).on('shown.bs.modal', function () {
      expect(prevented).toBe(true)
      expect($el.hasClass('fade')).toBe(true)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should hide modal when hide is called', () => new Promise(resolve => {
    expect.assertions(3)
    $('<div id="modal-test"/>').on('shown.bs.modal', function () {
      expect($('#modal-test').is(':visible')).toBe(true)
      expect($('#modal-test').length).not.toBe(0)
      $(this).bootstrapModal('hide')
    }).on('hidden.bs.modal', function () {
      expect($('#modal-test').is(':visible')).toBe(false)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should toggle when toggle is called', () => new Promise(resolve => {
    expect.assertions(3)
    $('<div id="modal-test"/>').on('shown.bs.modal', function () {
      expect($('#modal-test').is(':visible')).toBe(true)
      expect($('#modal-test').length).not.toBe(0)
      $(this).bootstrapModal('toggle')
    }).on('hidden.bs.modal', function () {
      expect($('#modal-test').is(':visible')).toBe(false)
      resolve()
    }).bootstrapModal('toggle')
  }))
  it('should remove from dom when click [data-dismiss="modal"]', () => new Promise(resolve => {
    expect.assertions(3)
    $('<div id="modal-test"><span class="close" data-dismiss="modal"/></div>').on('shown.bs.modal', function () {
      expect($('#modal-test').is(':visible')).toBe(true)
      expect($('#modal-test').length).not.toBe(0)
      $(this).find('.close').trigger('click')
    }).on('hidden.bs.modal', function () {
      expect($('#modal-test').is(':visible')).toBe(false)
      resolve()
    }).bootstrapModal('toggle')
  }))
  it('should allow modal close with "backdrop:false"', () => new Promise(resolve => {
    expect.assertions(2)
    $('<div id="modal-test" data-backdrop="false"/>').on('shown.bs.modal', function () {
      expect($('#modal-test').is(':visible')).toBe(true)
      $(this).bootstrapModal('hide')
    }).on('hidden.bs.modal', function () {
      expect($('#modal-test').is(':visible')).toBe(false)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should close modal when clicking outside of modal-content', () => new Promise(resolve => {
    expect.assertions(3)
    $('<div id="modal-test"><div class="contents"/></div>').on('shown.bs.modal', function () {
      expect($('#modal-test').length).not.toBe(0)
      $('.contents').trigger('click')
      expect($('#modal-test').is(':visible')).toBe(true)
      $('#modal-test').trigger('click')
    }).on('hidden.bs.modal', function () {
      expect($('#modal-test').is(':visible')).toBe(false)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should not close modal when clicking outside of modal-content if data-backdrop="true"', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div id="modal-test" data-backdrop="false"><div class="contents"/></div>').on('shown.bs.modal', function () {
      $('#modal-test').trigger('click')
      expect($('#modal-test').is(':visible')).toBe(true)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should close modal when escape key is pressed via keydown', () => new Promise(resolve => {
    expect.assertions(3)
    var $div = $('<div id="modal-test"/>')
    $div.on('shown.bs.modal', function () {
      expect($('#modal-test').length).not.toBe(0)
      expect($('#modal-test').is(':visible')).toBe(true)
      $div.trigger($.Event('keydown', {
        which: 27
      }))
      setTimeout(function () {
        expect($('#modal-test').is(':visible')).toBe(false)
        $div.remove()
        resolve()
      }, 0)
    }).bootstrapModal('show')
  }))
  it('should not close modal when escape key is pressed via keyup', () => new Promise(resolve => {
    expect.assertions(3)
    var $div = $('<div id="modal-test"/>')
    $div.on('shown.bs.modal', function () {
      expect($('#modal-test').length).not.toBe(0)
      expect($('#modal-test').is(':visible')).toBe(true)
      $div.trigger($.Event('keyup', {
        which: 27
      }))
      setTimeout(function () {
        expect($div.is(':visible')).toBe(true)
        $div.remove()
        resolve()
      }, 0)
    }).bootstrapModal('show')
  }))
  it('should trigger hide event once when clicking outside of modal-content', () => new Promise(resolve => {
    expect.assertions(1)
    var triggered
    $('<div id="modal-test"><div class="contents"/></div>').on('shown.bs.modal', function () {
      triggered = 0
      $('#modal-test').trigger('click')
    }).on('hide.bs.modal', function () {
      triggered += 1
      expect(triggered).toBe(1)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should remove aria-hidden attribute when shown, add it back when hidden', () => new Promise(resolve => {
    expect.assertions(3)
    $('<div id="modal-test" aria-hidden="true"/>').on('shown.bs.modal', function () {
      expect($('#modal-test').is('[aria-hidden]')).toBe(false)
      $(this).bootstrapModal('hide')
    }).on('hidden.bs.modal', function () {
      expect($('#modal-test').is('[aria-hidden]')).toBe(true)
      expect($('#modal-test').attr('aria-hidden')).toBe('true')
      resolve()
    }).bootstrapModal('show')
  }))
  it('should add aria-modal attribute when shown, remove it again when hidden', () => new Promise(resolve => {
    expect.assertions(3)
    $('<div id="modal-test"/>').on('shown.bs.modal', function () {
      expect($('#modal-test').is('[aria-modal]')).toBe(true)
      expect($('#modal-test').attr('aria-modal')).toBe('true')
      $(this).bootstrapModal('hide')
    }).on('hidden.bs.modal', function () {
      expect($('#modal-test').is('[aria-modal]')).toBe(false)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should add role="dialog" attribute when shown, remove it again when hidden', () => new Promise(resolve => {
    expect.assertions(3)
    $('<div id="modal-test"/>').on('shown.bs.modal', function () {
      expect($('#modal-test').is('[role]')).toBe(true)
      expect($('#modal-test').attr('role')).toBe('dialog')
      $(this).bootstrapModal('hide')
    }).on('hidden.bs.modal', function () {
      expect($('#modal-test').is('[role]')).toBe(false)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should close reopened modal with [data-dismiss="modal"] click', () => new Promise(resolve => {
    expect.assertions(2)
    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>').one('shown.bs.modal', function () {
      $('#close').trigger('click')
    }).one('hidden.bs.modal', function () {
      // After one open-close cycle
      expect($('#modal-test').is(':visible')).toBe(false)
      $(this).one('shown.bs.modal', function () {
        $('#close').trigger('click')
      }).one('hidden.bs.modal', function () {
        expect($('#modal-test').is(':visible')).toBe(false)
        resolve()
      }).bootstrapModal('show')
    }).bootstrapModal('show')
  }))
  it('should restore focus to toggling element when modal is hidden after having been opened via data-api', () => new Promise(resolve => {
    expect.assertions(1)
    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')
    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>').on('hidden.bs.modal', function () {
      setTimeout(function () {
        expect($(document.activeElement).is($toggleBtn)).toBe(true)
        resolve()
      }, 0)
    }).on('shown.bs.modal', function () {
      $('#close').trigger('click')
    }).appendTo('#qunit-fixture')
    $toggleBtn.trigger('click')
  }))
  it('should not restore focus to toggling element if the associated show event gets prevented', () => new Promise(resolve => {
    expect.assertions(1)
    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')
    var $otherBtn = $('<button id="other-btn"/>').appendTo('#qunit-fixture')
    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div>').one('show.bs.modal', function (e) {
      e.preventDefault()
      $otherBtn.trigger('focus')
      setTimeout(() => {
        $(this).bootstrapModal('show')
      }, 0)
    }).on('hidden.bs.modal', function () {
      setTimeout(function () {
        expect($(document.activeElement).is($otherBtn)).toBe(true)
        resolve()
      }, 0)
    }).on('shown.bs.modal', function () {
      $('#close').trigger('click')
    }).appendTo('#qunit-fixture')
    $toggleBtn.trigger('click')
  }))
  it('should adjust the inline padding of the modal when opening', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div id="modal-test"/>').on('shown.bs.modal', function () {
      var expectedPadding = $(this).getScrollbarWidth() + 'px'
      var currentPadding = $(this).css('padding-right')
      expect(currentPadding).toBe(expectedPadding)
      resolve()
    }).bootstrapModal('show')
  }))
  it.skip('should adjust the inline body padding when opening and restore when closing', () => new Promise(resolve => {
    expect.assertions(2)
    var $body = $(document.body)
    var originalPadding = $body.css('padding-right')
    $('<div id="modal-test"/>').on('hidden.bs.modal', function () {
      var currentPadding = $body.css('padding-right')
      expect(currentPadding).toBe(originalPadding)
      $body.removeAttr('style')
      resolve()
    }).on('shown.bs.modal', function () {
      var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
      var currentPadding = $body.css('padding-right')
      expect(currentPadding).toBe(expectedPadding)
      $(this).bootstrapModal('hide')
    }).bootstrapModal('show')
  }))
  it('should store the original body padding in data-padding-right before showing', () => new Promise(resolve => {
    expect.assertions(2)
    var $body = $(document.body)
    var originalPadding = '0px'
    $body.css('padding-right', originalPadding)
    $('<div id="modal-test"/>').on('hidden.bs.modal', function () {
      expect(typeof $body.data('padding-right')).toBe('undefined')
      $body.removeAttr('style')
      resolve()
    }).on('shown.bs.modal', function () {
      expect($body.data('padding-right')).toBe(originalPadding)
      $(this).bootstrapModal('hide')
    }).bootstrapModal('show')
  }))
  it('should not adjust the inline body padding when it does not overflow', () => new Promise(resolve => {
    expect.assertions(1)
    var $body = $(document.body)
    var originalPadding = $body.css('padding-right')

    // Hide scrollbars to prevent the body overflowing
    $body.css('overflow', 'hidden') // Real scrollbar (for in-browser testing)
    $('html').css('padding-right', '0px') // Simulated scrollbar (for PhantomJS)

    $('<div id="modal-test"/>').on('shown.bs.modal', function () {
      var currentPadding = $body.css('padding-right')
      expect(currentPadding).toBe(originalPadding)
      $(this).bootstrapModal('hide')

      // Restore scrollbars
      $body.css('overflow', 'auto')
      $('html').css('padding-right', '16px')
      resolve()
    }).bootstrapModal('show')
  }))
  it.skip('should adjust the inline padding of fixed elements when opening and restore when closing', () => new Promise(resolve => {
    expect.assertions(2)
    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = $element.css('padding-right')
    $('<div id="modal-test"/>').on('hidden.bs.modal', function () {
      var currentPadding = $element.css('padding-right')
      expect(currentPadding).toBe(originalPadding)
      $element.remove()
      resolve()
    }).on('shown.bs.modal', function () {
      var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
      var currentPadding = $element.css('padding-right')
      expect(currentPadding).toBe(expectedPadding)
      $(this).bootstrapModal('hide')
    }).bootstrapModal('show')
  }))
  it('should store the original padding of fixed elements in data-padding-right before showing', () => new Promise(resolve => {
    expect.assertions(2)
    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = '0px'
    $element.css('padding-right', originalPadding)
    $('<div id="modal-test"/>').on('hidden.bs.modal', function () {
      expect(typeof $element.data('padding-right')).toBe('undefined')
      $element.remove()
      resolve()
    }).on('shown.bs.modal', function () {
      expect($element.data('padding-right')).toBe(originalPadding)
      $(this).bootstrapModal('hide')
    }).bootstrapModal('show')
  }))
  it.skip('should adjust the inline margin of sticky elements when opening and restore when closing', () => new Promise(resolve => {
    expect.assertions(2)
    var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = $element.css('margin-right')
    $('<div id="modal-test"/>').on('hidden.bs.modal', function () {
      var currentPadding = $element.css('margin-right')
      expect(currentPadding).toBe(originalPadding)
      $element.remove()
      resolve()
    }).on('shown.bs.modal', function () {
      var expectedPadding = parseFloat(originalPadding) - $(this).getScrollbarWidth() + 'px'
      var currentPadding = $element.css('margin-right')
      expect(currentPadding).toBe(expectedPadding)
      $(this).bootstrapModal('hide')
    }).bootstrapModal('show')
  }))
  it('should store the original margin of sticky elements in data-margin-right before showing', () => new Promise(resolve => {
    expect.assertions(2)
    var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = '0px'
    $element.css('margin-right', originalPadding)
    $('<div id="modal-test"/>').on('hidden.bs.modal', function () {
      expect(typeof $element.data('margin-right')).toBe('undefined')
      $element.remove()
      resolve()
    }).on('shown.bs.modal', function () {
      expect($element.data('margin-right')).toBe(originalPadding)
      $(this).bootstrapModal('hide')
    }).bootstrapModal('show')
  }))
  it('should ignore values set via CSS when trying to restore body padding after closing', () => new Promise(resolve => {
    expect.assertions(1)
    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')
    $('<div id="modal-test"/>').on('hidden.bs.modal', function () {
      expect($body.attr('style').indexOf('padding-right')).toBe(-1)
      $style.remove()
      resolve()
    }).on('shown.bs.modal', function () {
      $(this).bootstrapModal('hide')
    }).bootstrapModal('show')
  }))
  it('should ignore other inline styles when trying to restore body padding after closing', () => new Promise(resolve => {
    expect.assertions(2)
    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')
    $body.css('color', 'red')
    $('<div id="modal-test"/>').on('hidden.bs.modal', function () {
      expect($body[0].style.paddingRight).toBe('')
      expect($body[0].style.color).toBe('red')
      $body.removeAttr('style')
      $style.remove()
      resolve()
    }).on('shown.bs.modal', function () {
      $(this).bootstrapModal('hide')
    }).bootstrapModal('show')
  }))
  it('should properly restore non-pixel inline body padding after closing', () => new Promise(resolve => {
    expect.assertions(1)
    var $body = $(document.body)
    $body.css('padding-right', '5%')
    $('<div id="modal-test"/>').on('hidden.bs.modal', function () {
      expect($body[0].style.paddingRight).toBe('5%')
      $body.removeAttr('style')
      resolve()
    }).on('shown.bs.modal', function () {
      $(this).bootstrapModal('hide')
    }).bootstrapModal('show')
  }))
  it('should not follow link in area tag', () => new Promise(resolve => {
    expect.assertions(2)
    $('<map><area id="test" shape="default" data-toggle="modal" data-target="#modal-test" href="demo.html"/></map>').appendTo('#qunit-fixture')
    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>').appendTo('#qunit-fixture')
    $('#test').on('click.bs.modal.data-api', function (event) {
      expect(event.isDefaultPrevented()).toBe(false)
      setTimeout(function () {
        expect(event.isDefaultPrevented()).toBe(true)
        resolve()
      }, 1)
    }).trigger('click')
  }))
  it('should not parse target as html', () => new Promise(resolve => {
    expect.assertions(1)
    var $toggleBtn = $('<button data-toggle="modal" data-target="&lt;div id=&quot;modal-test&quot;&gt;&lt;div class=&quot;contents&quot;&lt;div&lt;div id=&quot;close&quot; data-dismiss=&quot;modal&quot;/&gt;&lt;/div&gt;&lt;/div&gt;"/>').appendTo('#qunit-fixture')
    $toggleBtn.trigger('click')
    setTimeout(function () {
      expect($('#modal-test').length).toBe(0)
      resolve()
    }, 0)
  }))
  it('should not execute js from target', () => new Promise(resolve => {
    // This toggle button contains XSS payload in its data-target
    // Note: it uses the onerror handler of an img element to execute the js, because a simple script element does not work here
    //       a script element works in manual tests though, so here it is likely blocked by the qunit framework
    var $toggleBtn = $('<button data-toggle="modal" data-target="&lt;div&gt;&lt;image src=&quot;missing.png&quot; onerror=&quot;$(&apos;#qunit-fixture button.control&apos;).trigger(&apos;click&apos;)&quot;&gt;&lt;/div&gt;"/>').appendTo('#qunit-fixture')
    // The XSS payload above does not have a closure over this function and cannot access the assert object directly
    // However, it can send a click event to the following control button, which will then fail the assert
    $('<button>').addClass('control').on('click', function () {
      expect(true).toBeFalsy()
    }).appendTo('#qunit-fixture')
    $toggleBtn.trigger('click')
    setTimeout(resolve, 500)
  }))
  it('should not try to open a modal which is already visible', () => new Promise(resolve => {
    expect.assertions(1)
    var count = 0
    $('<div id="modal-test"/>').on('shown.bs.modal', function () {
      count++
    }).on('hidden.bs.modal', function () {
      expect(count).toBe(1)
      resolve()
    }).bootstrapModal('show').bootstrapModal('show').bootstrapModal('hide')
  }))
  it.skip('transition duration should be the modal-dialog duration before triggering shown event', () => new Promise(resolve => {
    expect.assertions(1)
    var style = ['<style>', '  .modal.fade .modal-dialog {', '    transition: -webkit-transform .3s ease-out;', '    transition: transform .3s ease-out;', '    transition: transform .3s ease-out,-webkit-transform .3s ease-out;', '    -webkit-transform: translate(0,-50px);', '    transform: translate(0,-50px);', '  }', '</style>'].join('')
    var $style = $(style).appendTo('head')
    var modalHTML = ['<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">', '  <div class="modal-dialog" role="document">', '    <div class="modal-content">', '      <div class="modal-body">...</div>', '    </div>', '  </div>', '</div>'].join('')
    var $modal = $(modalHTML).appendTo('#qunit-fixture')
    var expectedTransitionDuration = 300
    var spy = sinon.spy(Util, 'getTransitionDurationFromElement')
    $modal.on('shown.bs.modal', function () {
      expect(spy.returned(expectedTransitionDuration)).toBe(true)
      $style.remove()
      spy.restore()
      resolve()
    }).bootstrapModal('show')
  }))
  it('should dispose modal', () => new Promise(resolve => {
    expect.assertions(3)
    var $modal = $(['<div id="modal-test">', '  <div class="modal-dialog">', '    <div class="modal-content">', '      <div class="modal-body" />', '    </div>', '  </div>', '</div>'].join('')).appendTo('#qunit-fixture')
    $modal.on('shown.bs.modal', function () {
      var spy = sinon.spy($.fn, 'off')
      $(this).bootstrapModal('dispose')
      var modalDataApiEvent = []
      $._data(document, 'events').click.forEach(function (e) {
        if (e.namespace === 'bs.data-api.modal') {
          modalDataApiEvent.push(e)
        }
      })
      expect(typeof $(this).data('bs.modal')).toBe('undefined')
      expect(spy.callCount).toBe(4)
      expect(modalDataApiEvent.length).toBe(1)
      $.fn.off.restore()
      resolve()
    }).bootstrapModal('show')
  }))
  it('should not adjust the inline body padding when it does not overflow, even on a scaled display', () => new Promise(resolve => {
    expect.assertions(1)
    var $modal = $(['<div id="modal-test">', '  <div class="modal-dialog">', '    <div class="modal-content">', '      <div class="modal-body" />', '    </div>', '  </div>', '</div>'].join('')).appendTo('#qunit-fixture')
    var originalPadding = globalThis.getComputedStyle(document.body).paddingRight

    // Remove body margins as would be done by Bootstrap css
    document.body.style.margin = '0'

    // Hide scrollbars to prevent the body overflowing
    document.body.style.overflow = 'hidden'

    // Simulate a discrepancy between exact, i.e. floating point body width, and rounded body width
    // as it can occur when zooming or scaling the display to something else than 100%
    document.documentElement.style.paddingRight = '.48px'
    $modal.on('shown.bs.modal', function () {
      var currentPadding = globalThis.getComputedStyle(document.body).paddingRight
      expect(currentPadding).toBe(originalPadding)

      // Restore overridden css
      document.body.style.removeProperty('margin')
      document.body.style.removeProperty('overflow')
      document.documentElement.style.paddingRight = '16px'
      resolve()
    }).bootstrapModal('show')
  }))
  it('should enforce focus', () => new Promise(resolve => {
    expect.assertions(4)
    var $modal = $(['<div id="modal-test" data-show="false">', '  <div class="modal-dialog">', '    <div class="modal-content">', '      <div class="modal-body" />', '    </div>', '  </div>', '</div>'].join('')).bootstrapModal().appendTo('#qunit-fixture')
    var modal = $modal.data('bs.modal')
    var spy = sinon.spy(modal, '_enforceFocus')
    var spyDocOff = sinon.spy($(document), 'off')
    var spyDocOn = sinon.spy($(document), 'on')
    $modal.one('shown.bs.modal', function () {
      expect(spy.called).toBe(true)
      expect(spyDocOff.withArgs('focusin.bs.modal')).toBeTruthy()
      expect(spyDocOn.withArgs('focusin.bs.modal')).toBeTruthy()
      var spyFocus = sinon.spy(modal._element, 'focus')
      var event = $.Event('focusin', {
        target: $('#qunit-fixture')[0]
      })
      $(document).one('focusin', function () {
        expect(spyFocus.called).toBe(true)
        resolve()
      })
      $(document).trigger(event)
    }).bootstrapModal('show')
  }))
  it('should scroll to top of the modal body if the modal has .modal-dialog-scrollable class', () => new Promise(resolve => {
    expect.assertions(3)
    var $modal = $(['<div id="modal-test">', '  <div class="modal-dialog modal-dialog-scrollable">', '    <div class="modal-content">', '      <div class="modal-body" style="height: 100px; overflow-y: auto;">', '        <div style="height: 200px" />', '      </div>', '    </div>', '  </div>', '</div>'].join('')).appendTo('#qunit-fixture')
    var $modalBody = $('.modal-body')
    $modalBody.scrollTop(100)
    expect($modalBody.scrollTop() > 95).toBe(true)
    expect($modalBody.scrollTop() <= 100).toBe(true)
    $modal.on('shown.bs.modal', function () {
      expect($modalBody.scrollTop()).toBe(0)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should set .modal\'s scroll top to 0 if .modal-dialog-scrollable and modal body do not exists', () => new Promise(resolve => {
    expect.assertions(1)
    var $modal = $(['<div id="modal-test">', '  <div class="modal-dialog modal-dialog-scrollable">', '    <div class="modal-content">', '    </div>', '  </div>', '</div>'].join('')).appendTo('#qunit-fixture')
    $modal.on('shown.bs.modal', function () {
      expect($modal.scrollTop()).toBe(0)
      resolve()
    }).bootstrapModal('show')
  }))
  it('should not close modal when clicking outside of modal-content if backdrop = static', () => new Promise(resolve => {
    expect.assertions(1)
    var $modal = $('<div class="modal" data-backdrop="static"><div class="modal-dialog" /></div>').appendTo('#qunit-fixture')
    $modal.on('shown.bs.modal', function () {
      $modal.trigger('click')
      setTimeout(function () {
        var modal = $modal.data('bs.modal')
        expect(modal._isShown).toBe(true)
        resolve()
      }, 10)
    }).on('hidden.bs.modal', function () {
      expect(false).toBe(true)
    }).bootstrapModal({
      backdrop: 'static'
    })
  }))
  it('should close modal when escape key is pressed with keyboard = true and backdrop is static', () => new Promise(resolve => {
    expect.assertions(1)
    var $modal = $('<div class="modal" data-backdrop="static" data-keyboard="true"><div class="modal-dialog" /></div>').appendTo('#qunit-fixture')
    $modal.on('shown.bs.modal', function () {
      $modal.trigger($.Event('keydown', {
        which: 27
      }))
      setTimeout(function () {
        var modal = $modal.data('bs.modal')
        expect(modal._isShown).toBe(false)
        resolve()
      }, 10)
    }).bootstrapModal({
      backdrop: 'static',
      keyboard: true
    })
  }))
  it('should not close modal when escape key is pressed with keyboard = false', () => new Promise(resolve => {
    expect.assertions(1)
    var $modal = $('<div class="modal"><div class="modal-dialog" /></div>').appendTo('#qunit-fixture')
    $modal.on('shown.bs.modal', function () {
      $modal.trigger($.Event('keydown', {
        which: 27
      }))
      setTimeout(function () {
        var modal = $modal.data('bs.modal')
        expect(modal._isShown).toBe(true)
        resolve()
      }, 10)
    }).on('hidden.bs.modal', function () {
      expect(true).toBe(false)
    }).bootstrapModal({
      keyboard: false
    })
  }))
  it('should not overflow when clicking outside of modal-content if backdrop = static', () => new Promise(resolve => {
    expect.assertions(1)
    var $modal = $('<div class="modal" data-backdrop="static"><div class="modal-dialog" style="transition-duration: 20ms;"/></div>').appendTo('#qunit-fixture')
    $modal.on('shown.bs.modal', function () {
      $modal.trigger('click')
      setTimeout(function () {
        expect($modal[0].clientHeight).toBe($modal[0].scrollHeight)
        resolve()
      }, 20)
    }).bootstrapModal({
      backdrop: 'static'
    })
  }))
  it('should get modal-static class when clicking outside of modal-content if backdrop = static', () => new Promise(resolve => {
    expect.assertions(1)
    var $modal = $('<div class="modal" data-backdrop="static"><div class="modal-dialog" style="transition-duration: 20ms;"/></div>').appendTo('#qunit-fixture')
    $modal.on('shown.bs.modal', function () {
      $modal.trigger('click')
      setTimeout(function () {
        expect($modal.hasClass('modal-static')).toBe(true)
        resolve()
      }, 0)
    }).bootstrapModal({
      backdrop: 'static'
    })
  }))
  it('should not get modal-static class when clicking outside of modal-content if backdrop = static and event is prevented', () => new Promise(resolve => {
    expect.assertions(2)
    var $modal = $('<div class="modal" data-backdrop="static"><div class="modal-dialog" style="transition-duration: 20ms;"/></div>').appendTo('#qunit-fixture')
    $modal.on('hidePrevented.bs.modal', function (e) {
      expect(true).toBeTruthy()
      e.preventDefault()
    })
    $modal.on('shown.bs.modal', function () {
      $modal.trigger('click')
      setTimeout(function () {
        expect($modal.hasClass('modal-static')).toBe(false)
        resolve()
      }, 0)
    }).bootstrapModal({
      backdrop: 'static'
    })
  }))
})
