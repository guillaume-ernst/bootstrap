import {
  describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi
} from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Tooltip from '../../js/src/tooltip'
import Util from '../../js/src/util'
describe('tooltip plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
    expect($(document.body).tooltip).toBeTruthy()
  })
})
describe('tooltip', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
    $.fn.bootstrapTooltip = $.fn.tooltip.noConflict()
  })
  afterEach(() => {
    $.fn.tooltip = $.fn.bootstrapTooltip
    delete $.fn.bootstrapTooltip
    $('.tooltip').remove()
    clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
    expect(typeof $.fn.tooltip).toBe('undefined')
  })
  it('should throw explicit error on undefined method', () => {
    expect.assertions(1)
    var $el = $('<div/>')
    $el.bootstrapTooltip()
    try {
      $el.bootstrapTooltip('noMethod')
    } catch (error) {
      expect(error.message).toBe('No method named "noMethod"')
    }
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
    var $el = $('<div/>')
    var $tooltip = $el.bootstrapTooltip()
    expect($tooltip instanceof $).toBe(true)
    expect($tooltip[0]).toBe($el[0])
  })
  it('should expose default settings', () => {
    expect.assertions(1)
    expect($.fn.bootstrapTooltip.Constructor.Default).toBeTruthy()
  })
  it('should empty title attribute', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').bootstrapTooltip()
    expect($trigger.attr('title')).toBe('')
  })
  it('should add data attribute for referencing original title', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').bootstrapTooltip()
    expect($trigger.attr('data-original-title')).toBe('Another tooltip')
  })
  it('should add aria-describedby to the trigger on show', () => {
    expect.assertions(3)
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').bootstrapTooltip().appendTo('#qunit-fixture').bootstrapTooltip('show')
    var id = $('.tooltip').attr('id')
    expect($('#' + id).length).toBe(1)
    expect($('.tooltip').attr('aria-describedby')).toBe($trigger.attr('id'))
    expect($trigger[0].hasAttribute('aria-describedby')).toBe(true)
  })
  it('should remove aria-describedby from trigger on hide', () => new Promise(resolve => {
    expect.assertions(2)
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').bootstrapTooltip().appendTo('#qunit-fixture')
    $trigger.one('shown.bs.tooltip', function () {
      expect($trigger[0].hasAttribute('aria-describedby')).toBe(true)
      $trigger.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($trigger[0].hasAttribute('aria-describedby')).toBe(false)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should assign a unique id tooltip element', () => {
    expect.assertions(2)
    $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip('show')
    var id = $('.tooltip').attr('id')
    expect($('#' + id).length).toBe(1)
    expect(id.indexOf('tooltip')).toBe(0)
  })
  it('should place tooltips relative to placement option', () => new Promise(resolve => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      placement: 'bottom'
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($('.tooltip').is('.fade.bs-tooltip-bottom.show')).toBe(true)
      $tooltip.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($tooltip.data('bs.tooltip').tip.parentNode).toBe(null)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should allow html entities', () => new Promise(resolve => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip" title="&lt;b&gt;@fat&lt;/b&gt;"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      html: true
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($('.tooltip b').length).not.toBe(0)
      $tooltip.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($tooltip.data('bs.tooltip').tip.parentNode).toBe(null)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should allow DOMElement title (html: false)', () => new Promise(resolve => {
    expect.assertions(3)
    var title = document.createTextNode('<3 writing tests')
    var $tooltip = $('<a href="#" rel="tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      title: title
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($('.tooltip').length).not.toBe(0)
      expect($('.tooltip').text()).toBe('<3 writing tests')
      expect($.contains($('.tooltip').get(0), title)).toBe(false)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should allow DOMElement title (html: true)', () => new Promise(resolve => {
    expect.assertions(3)
    var title = document.createTextNode('<3 writing tests')
    var $tooltip = $('<a href="#" rel="tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      html: true,
      title: title
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($('.tooltip').length).not.toBe(0)
      expect($('.tooltip').text()).toBe('<3 writing tests')
      expect($.contains($('.tooltip').get(0), title)).toBeTruthy()
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should respect custom classes', () => new Promise(resolve => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($('.tooltip').hasClass('some-class')).toBe(true)
      $tooltip.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($tooltip.data('bs.tooltip').tip.parentNode).toBe(null)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should fire show event', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div title="tooltip title"/>').on('show.bs.tooltip', function () {
      expect(true).toBeTruthy()
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should throw an error when show is called on hidden elements', () => new Promise(resolve => {
    expect.assertions(1)
    try {
      $('<div title="tooltip title" style="display: none"/>').bootstrapTooltip('show')
    } catch (error) {
      expect(error.message).toBe('Please use show on visible elements')
      resolve()
    }
  }))
  it('should fire inserted event', () => new Promise(resolve => {
    expect.assertions(2)
    $('<div title="tooltip title"/>').appendTo('#qunit-fixture').on('inserted.bs.tooltip', function () {
      expect($('.tooltip').length).not.toBe(0)
      expect(true).toBeTruthy()
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should fire shown event', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div title="tooltip title"></div>').appendTo('#qunit-fixture').on('shown.bs.tooltip', function () {
      expect(true).toBeTruthy()
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should not fire shown event when show was prevented', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div title="tooltip title"/>').on('show.bs.tooltip', function (e) {
      e.preventDefault()
      expect(true).toBeTruthy()
      resolve()
    }).on('shown.bs.tooltip', function () {
      expect(false).toBeTruthy()
    }).bootstrapTooltip('show')
  }))
  it('should fire hide event', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div title="tooltip title"/>').appendTo('#qunit-fixture').on('shown.bs.tooltip', function () {
      $(this).bootstrapTooltip('hide')
    }).on('hide.bs.tooltip', function () {
      expect(true).toBeTruthy()
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should fire hidden event', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div title="tooltip title"/>').appendTo('#qunit-fixture').on('shown.bs.tooltip', function () {
      $(this).bootstrapTooltip('hide')
    }).on('hidden.bs.tooltip', function () {
      expect(true).toBeTruthy()
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should not fire hidden event when hide was prevented', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div title="tooltip title"/>').appendTo('#qunit-fixture').on('shown.bs.tooltip', function () {
      $(this).bootstrapTooltip('hide')
    }).on('hide.bs.tooltip', function (e) {
      e.preventDefault()
      expect(true).toBeTruthy()
      resolve()
    }).on('hidden.bs.tooltip', function () {
      expect(false).toBeTruthy()
    }).bootstrapTooltip('show')
  }))
  it('should destroy tooltip', () => {
    expect.assertions(9)
    var $tooltip = $('<div/>').bootstrapTooltip().on('click.foo', function () {})
    expect($tooltip.data('bs.tooltip')).toBeTruthy()
    expect($._data($tooltip[0], 'events').mouseover).toBeTruthy()
    expect($._data($tooltip[0], 'events').mouseout).toBeTruthy()
    expect($._data($tooltip[0], 'events').click[0].namespace).toBe('foo')
    $tooltip.bootstrapTooltip('show')
    $tooltip.bootstrapTooltip('dispose')
    expect($tooltip.hasClass('show')).toBe(false)
    expect(typeof $._data($tooltip[0], 'bs.tooltip')).toBe('undefined')
    expect($._data($tooltip[0], 'events').click[0].namespace).toBe('foo')
    expect(typeof $._data($tooltip[0], 'events').mouseover).toBe('undefined')
    expect(typeof $._data($tooltip[0], 'events').mouseout).toBe('undefined')
  })
  it('should show tooltip when toggle is called', () => {
    expect.assertions(1)
    $('<a href="#" rel="tooltip" title="tooltip on toggle"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      trigger: 'manual'
    }).bootstrapTooltip('toggle')
    expect($('.tooltip').is('.fade.show')).toBe(true)
  })
  it('should hide previously shown tooltip when toggle is called on tooltip', () => {
    expect.assertions(1)
    $('<a href="#" rel="tooltip" title="tooltip on toggle">@ResentedHook</a>').appendTo('#qunit-fixture').bootstrapTooltip({
      trigger: 'manual'
    }).bootstrapTooltip('show')
    $('.tooltip').bootstrapTooltip('toggle')
    expect($('.tooltip').not('.fade.show')).toBeTruthy()
  })
  it('should place tooltips inside body when container is body', () => new Promise(resolve => {
    expect.assertions(3)
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      container: 'body'
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($('body > .tooltip').length).not.toBe(0)
      expect($('#qunit-fixture > .tooltip').length).toBe(0)
      $tooltip.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($('body > .tooltip').length).toBe(0)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should place tooltips inside a specific container when container is an element', () => new Promise(resolve => {
    expect.assertions(3)
    var $container = $('<div></div>').appendTo('#qunit-fixture')
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      container: $container[0]
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($container.find('.tooltip').length).toBe(1)
      expect($('#qunit-fixture > .tooltip').length).toBe(0)
      $tooltip.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($container.find('.tooltip').length).toBe(0)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should place tooltips inside a specific container when container is a selector', () => new Promise(resolve => {
    expect.assertions(3)
    var $container = $('<div id="container"></div>').appendTo('#qunit-fixture')
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      container: '#container'
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($container.find('.tooltip').length).toBe(1)
      expect($('#qunit-fixture > .tooltip').length).toBe(0)
      $tooltip.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($container.find('.tooltip').length).toBe(0)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should add position class before positioning so that position-specific styles are taken into account', () => new Promise(resolve => {
    expect.assertions(2)
    var styles = '<style>' + '.bs-tooltip-right { white-space: nowrap; }' + '.bs-tooltip-right .tooltip-inner { max-width: none; }' + '</style>'
    var $styles = $(styles).appendTo('head')
    var $container = $('<div/>').appendTo('#qunit-fixture')
    $('<a href="#" rel="tooltip" title="very very very very very very very very long tooltip in one line"/>').appendTo($container).bootstrapTooltip({
      placement: 'right',
      trigger: 'manual'
    }).on('inserted.bs.tooltip', function () {
      var $tooltip = $($(this).data('bs.tooltip').tip)
      expect($tooltip.hasClass('bs-tooltip-right')).toBe(true)
      expect(typeof $tooltip.attr('style')).toBe('undefined')
      $styles.remove()
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should use title attribute for tooltip text', () => new Promise(resolve => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip()
    $tooltip.one('shown.bs.tooltip', function () {
      expect($('.tooltip').children('.tooltip-inner').text()).toBe('Simple tooltip')
      $tooltip.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($('.tooltip').length).toBe(0)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should prefer title attribute over title option', () => new Promise(resolve => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      title: 'This is a tooltip with some content'
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($('.tooltip').children('.tooltip-inner').text()).toBe('Simple tooltip')
      $tooltip.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($('.tooltip').length).toBe(0)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should use title option', () => new Promise(resolve => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      title: 'This is a tooltip with some content'
    })
    $tooltip.one('shown.bs.tooltip', function () {
      expect($('.tooltip').children('.tooltip-inner').text()).toBe('This is a tooltip with some content')
      $tooltip.bootstrapTooltip('hide')
    }).one('hidden.bs.tooltip', function () {
      expect($('.tooltip').length).toBe(0)
      resolve()
    }).bootstrapTooltip('show')
  }))
  it('should not error when trying to show an top-placed tooltip that has been removed from the dom', () => {
    expect.assertions(1)
    var passed = true
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').one('show.bs.tooltip', function () {
      $(this).remove()
    }).bootstrapTooltip({
      placement: 'top'
    })
    try {
      $tooltip.bootstrapTooltip('show')
    } catch (_) {
      passed = false
    }

    expect(passed).toBe(true)
  })
  it('should show tooltip if leave event hasn\'t occurred before delay expires', () => new Promise(resolve => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      delay: 150
    })
    setTimeout(function () {
      expect($('.tooltip').is('.fade.show')).toBe(false)
    }, 100)
    setTimeout(function () {
      expect($('.tooltip').is('.fade.show')).toBe(true)
      resolve()
    }, 200)
    $tooltip.trigger('mouseenter')
  }))
  it('should not show tooltip if leave event occurs before delay expires', () => new Promise(resolve => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      delay: 150
    })
    setTimeout(function () {
      expect($('.tooltip').is('.fade.show')).toBe(false)
      $tooltip.trigger('mouseout')
    }, 100)
    setTimeout(function () {
      expect($('.tooltip').is('.fade.show')).toBe(false)
      resolve()
    }, 200)
    $tooltip.trigger('mouseenter')
  }))
  it('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', () => new Promise(resolve => {
    expect.assertions(3)
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      delay: {
        show: 0,
        hide: 150
      }
    })
    setTimeout(function () {
      expect($('.tooltip').is('.fade.show')).toBe(true)
      $tooltip.trigger('mouseout')
      setTimeout(function () {
        expect($('.tooltip').is('.fade.show')).toBe(true)
        $tooltip.trigger('mouseenter')
      }, 100)
      setTimeout(function () {
        expect($('.tooltip').is('.fade.show')).toBe(true)
        resolve()
      }, 200)
    }, 0)
    $tooltip.trigger('mouseenter')
  }))
  it('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', () => new Promise(resolve => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      delay: {
        show: 150,
        hide: 0
      }
    })
    setTimeout(function () {
      expect($('.tooltip').is('.fade.show')).toBe(false)
      $tooltip.trigger('mouseout')
    }, 100)
    setTimeout(function () {
      expect($('.tooltip').is('.fade.show')).toBe(false)
      resolve()
    }, 250)
    $tooltip.trigger('mouseenter')
  }))
  it('should wait 200ms before hiding the tooltip', () => new Promise(resolve => {
    expect.assertions(3)
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      delay: {
        show: 0,
        hide: 150
      }
    })
    setTimeout(function () {
      expect($($tooltip.data('bs.tooltip').tip).is('.fade.show')).toBe(true)
      $tooltip.trigger('mouseout')
      setTimeout(function () {
        expect($($tooltip.data('bs.tooltip').tip).is('.fade.show')).toBe(true)
      }, 100)
      setTimeout(function () {
        expect($($tooltip.data('bs.tooltip').tip).is('.show')).toBe(false)
        resolve()
      }, 200)
    }, 0)
    $tooltip.trigger('mouseenter')
  }))
  it('should not reload the tooltip on subsequent mouseenter events', () => {
    expect.assertions(1)
    var titleHtml = function () {
      var uid = Util.getUID('tooltip')
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }

    var $tooltip = $('<span id="tt-outer" rel="tooltip" data-trigger="hover" data-placement="top">some text</span>').appendTo('#qunit-fixture')
    $tooltip.bootstrapTooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500
      },
      container: $tooltip,
      title: titleHtml
    })
    $('#tt-outer').trigger('mouseenter')
    var currentUid = $('#tt-content').text()
    $('#tt-content').trigger('mouseenter')
    expect(currentUid).toBe($('#tt-content').text())
  })
  it('should not reload the tooltip if the mouse leaves and re-enters before hiding', () => {
    expect.assertions(4)
    var titleHtml = function () {
      var uid = Util.getUID('tooltip')
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }

    var $tooltip = $('<span id="tt-outer" rel="tooltip" data-trigger="hover" data-placement="top">some text</span>').appendTo('#qunit-fixture')
    $tooltip.bootstrapTooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500
      },
      title: titleHtml
    })
    var obj = $tooltip.data('bs.tooltip')
    $('#tt-outer').trigger('mouseenter')
    var currentUid = $('#tt-content').text()
    $('#tt-outer').trigger('mouseleave')
    expect(currentUid).toBe($('#tt-content').text())
    expect(obj._hoverState).toBe('out')
    $('#tt-outer').trigger('mouseenter')
    expect(obj._hoverState).toBe('show')
    expect(currentUid).toBe($('#tt-content').text())
  })
  it('should do nothing when an attempt is made to hide an uninitialized tooltip', () => {
    expect.assertions(1)
    var $tooltip = $('<span data-toggle="tooltip" title="some tip">some text</span>').appendTo('#qunit-fixture').on('hidden.bs.tooltip shown.bs.tooltip', function () {
      expect(false).toBeTruthy()
    }).bootstrapTooltip('hide')
    expect(typeof $tooltip.data('bs.tooltip')).toBe('undefined')
  })
  it('should not remove tooltip if multiple triggers are set and one is still active', () => {
    expect.assertions(41)
    var $el = $('<button>Trigger</button>').appendTo('#qunit-fixture').bootstrapTooltip({
      trigger: 'click hover focus',
      animation: false
    })
    var tooltip = $el.data('bs.tooltip')
    var $tooltip = $(tooltip.getTipElement())
    function showingTooltip() {
      return $tooltip.hasClass('show') || tooltip._hoverState === 'show'
    }

    var tests = [['mouseenter', 'mouseleave'], ['focusin', 'focusout'], ['click', 'click'], ['mouseenter', 'focusin', 'focusout', 'mouseleave'], ['mouseenter', 'focusin', 'mouseleave', 'focusout'], ['focusin', 'mouseenter', 'mouseleave', 'focusout'], ['focusin', 'mouseenter', 'focusout', 'mouseleave'], ['click', 'focusin', 'mouseenter', 'focusout', 'mouseleave', 'click'], ['mouseenter', 'click', 'focusin', 'focusout', 'mouseleave', 'click'], ['mouseenter', 'focusin', 'click', 'click', 'mouseleave', 'focusout']]
    expect(showingTooltip()).toBe(false)
    $.each(tests, function (idx, triggers) {
      for (var i = 0, len = triggers.length; i < len; i++) {
        $el.trigger(triggers[i])
        expect(i < len - 1).toBe(showingTooltip())
      }
    })
  })
  it('should show on first trigger after hide', () => {
    expect.assertions(3)
    var $el = $('<a href="#" rel="tooltip" title="Test tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      trigger: 'click hover focus',
      animation: false
    })
    var tooltip = $el.data('bs.tooltip')
    var $tooltip = $(tooltip.getTipElement())
    function showingTooltip() {
      return $tooltip.hasClass('show') || tooltip._hoverState === 'show'
    }

    $el.trigger('click')
    expect(showingTooltip()).toBe(true)
    $el.bootstrapTooltip('hide')
    expect(showingTooltip()).toBe(false)
    $el.trigger('click')
    expect(showingTooltip()).toBe(true)
  })
  it.skip('should hide tooltip when their containing modal is closed', () => new Promise(resolve => {
    expect.assertions(1)
    var templateHTML = '<div id="modal-test" class="modal">' + '<div class="modal-dialog" role="document">' + '<div class="modal-content">' + '<div class="modal-body">' + '<a id="tooltipTest" href="#" data-toggle="tooltip" title="Some tooltip text!">Tooltip</a>' + '</div>' + '</div>' + '</div>' + '</div>'
    $(templateHTML).appendTo('#qunit-fixture')
    $('#tooltipTest').bootstrapTooltip({
      trigger: 'manuel'
    }).on('shown.bs.tooltip', function () {
      $('#modal-test').modal('hide')
    }).on('hide.bs.tooltip', function () {
      expect(true).toBeTruthy()
      resolve()
    })
    $('#modal-test').on('shown.bs.modal', function () {
      $('#tooltipTest').bootstrapTooltip('show')
    }).modal('show')
  }))
  it.skip('should allow to close modal if the tooltip element is detached', () => new Promise(resolve => {
    expect.assertions(1)
    var templateHTML = ['<div id="modal-test" class="modal">', '  <div class="modal-dialog" role="document">', '    <div class="modal-content">', '      <div class="modal-body">', '        <a id="tooltipTest" href="#" data-toggle="tooltip" title="Some tooltip text!">Tooltip</a>', '      </div>', '    </div>', '  </div>', '</div>'].join('')
    $(templateHTML).appendTo('#qunit-fixture')
    var $tooltip = $('#tooltipTest')
    var $modal = $('#modal-test')
    $tooltip.on('shown.bs.tooltip', function () {
      $tooltip.detach()
      $tooltip.bootstrapTooltip('dispose')
      $modal.modal('hide')
    })
    $modal.on('shown.bs.modal', function () {
      $tooltip.bootstrapTooltip({
        trigger: 'manuel'
      }).bootstrapTooltip('show')
    }).on('hidden.bs.modal', function () {
      expect(true).toBeTruthy()
      resolve()
    }).modal('show')
  }))
  it('should reset tip classes when hidden event triggered', () => new Promise(resolve => {
    expect.assertions(2)
    var $el = $('<a href="#" rel="tooltip" title="Test tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip('show').on('hidden.bs.tooltip', function () {
      var tooltip = $el.data('bs.tooltip')
      var $tooltip = $(tooltip.getTipElement())
      expect($tooltip.hasClass('tooltip')).toBe(true)
      expect($tooltip.hasClass('fade')).toBe(true)
      resolve()
    })
    $el.bootstrapTooltip('hide')
  }))
  it('should convert number in title to string', () => new Promise(resolve => {
    expect.assertions(1)
    var $el = $('<a href="#" rel="tooltip" title="7"/>').appendTo('#qunit-fixture').on('shown.bs.tooltip', function () {
      var tooltip = $el.data('bs.tooltip')
      var $tooltip = $(tooltip.getTipElement())
      expect($tooltip.children().text()).toBe('7')
      resolve()
    })
    $el.bootstrapTooltip('show')
  }))
  it('tooltip should be shown right away after the call of disable/enable', () => new Promise(resolve => {
    expect.assertions(2)
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip().on('shown.bs.tooltip', function () {
      expect($('.tooltip').hasClass('show')).toBe(true)
      resolve()
    })
    $trigger.bootstrapTooltip('disable')
    $trigger.trigger($.Event('click'))
    setTimeout(function () {
      expect($('.tooltip').length).toBe(0)
      $trigger.bootstrapTooltip('enable')
      $trigger.trigger($.Event('click'))
    }, 200)
  }))
  it('should call Popper to update', () => {
    expect.assertions(2)
    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip()
    var tooltip = $tooltip.data('bs.tooltip')
    tooltip.show()
    expect(tooltip._popper).toBeTruthy()
    var spyPopper = sinon.spy(tooltip._popper, 'update')
    tooltip.update()
    expect(spyPopper.called).toBe(true)
  })
  it('should not call Popper to update', () => {
    expect.assertions(1)
    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip()
    var tooltip = $tooltip.data('bs.tooltip')
    tooltip.update()
    expect(tooltip._popper).toBe(null)
  })
  it('should use Popper to get the tip on placement change', () => {
    expect.assertions(1)
    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip()
    var $tipTest = $('<div class="bs-tooltip" />').appendTo('#qunit-fixture')
    var tooltip = $tooltip.data('bs.tooltip')
    tooltip.tip = null
    tooltip._handlePopperPlacementChange({
      instance: {
        state: {
          elements: {
            popper: $tipTest[0]
          }
        }
      },
      placement: 'auto'
    })
    expect(tooltip.tip).toBe($tipTest[0])
  })
  it('should toggle enabled', () => {
    expect.assertions(3)
    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip()
    var tooltip = $tooltip.data('bs.tooltip')
    expect(tooltip._isEnabled).toBe(true)
    tooltip.toggleEnabled()
    expect(tooltip._isEnabled).toBe(false)
    tooltip.toggleEnabled()
    expect(tooltip._isEnabled).toBe(true)
  })
  it('should create offset modifier correctly when offset option is a function', () => {
    expect.assertions(2)
    var getOffset = function (offsets) {
      return offsets
    }

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      offset: getOffset
    })
    var tooltip = $trigger.data('bs.tooltip')
    var offset = tooltip._getOffset()
    expect(typeof offset).toBe('function')
    expect(offset({})).toEqual({})
  })
  it('should create offset modifier correctly when offset option is not a function', () => {
    expect.assertions(2)
    var myOffset = 42
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      offset: myOffset
    })
    var tooltip = $trigger.data('bs.tooltip')
    var offset = tooltip._getOffset()
    expect(offset).toBe(myOffset)
    expect(typeof offset).toBe('number')
  })
  it('should disable sanitizer', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      sanitize: false
    })
    var tooltip = $trigger.data('bs.tooltip')
    expect(tooltip.config.sanitize).toBe(false)
  })
  it('should sanitize template by removing disallowed tags', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      template: ['<div>', '  <script>console.log("oups script inserted")</script>', '  <span>Some content</span>', '</div>'].join('')
    })
    var tooltip = $trigger.data('bs.tooltip')
    expect(tooltip.config.template.indexOf('script')).toBe(-1)
  })
  it('should sanitize template by removing disallowed attributes', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      template: ['<div>', '  <img src="x" onError="alert(\'test\')">Some content</img>', '</div>'].join('')
    })
    var tooltip = $trigger.data('bs.tooltip')
    expect(tooltip.config.template.indexOf('onError')).toBe(-1)
  })
  it('should sanitize template by removing tags with XSS', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      template: ['<div>', '  <a href="javascript:alert(7)">Click me</a>', '  <span>Some content</span>', '</div>'].join('')
    })
    var tooltip = $trigger.data('bs.tooltip')
    expect(tooltip.config.template.indexOf('href="javascript:alert(7)"')).toBe(-1)
  })
  it('should allow custom sanitization rules', () => {
    expect.assertions(2)
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      template: ['<a href="javascript:alert(7)">Click me</a>', '<span>Some content</span>'].join(''),
      whiteList: {
        span: null
      }
    })
    var tooltip = $trigger.data('bs.tooltip')
    expect(tooltip.config.template.indexOf('<a')).toBe(-1)
    expect(tooltip.config.template.indexOf('span')).not.toBe(-1)
  })
  it('should allow passing a custom function for sanitization', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      template: ['<span>Some content</span>'].join(''),
      sanitizeFn: function (input) {
        return input
      }
    })
    var tooltip = $trigger.data('bs.tooltip')
    expect(tooltip.config.template.indexOf('span')).not.toBe(-1)
  })
  it('should allow passing aria attributes', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      template: ['<span aria-pressed="true">Some content</span>'].join('')
    })
    var tooltip = $trigger.data('bs.tooltip')
    expect(tooltip.config.template.indexOf('aria-pressed')).not.toBe(-1)
  })
  it('should not sanitize element content', () => {
    expect.assertions(1)
    var $element = $('<div />').appendTo('#qunit-fixture')
    var content = '<script>var test = 1;</script>'
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      template: ['<span aria-pressed="true">Some content</span>'].join(''),
      html: true,
      sanitize: false
    })
    var tooltip = $trigger.data('bs.tooltip')
    tooltip.setElementContent($element, content)
    expect($element[0].innerHTML).toBe(content)
  })
  it('should not take into account sanitize in data attributes', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" data-sanitize="false" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      template: ['<span aria-pressed="true">Some content</span>'].join('')
    })
    var tooltip = $trigger.data('bs.tooltip')
    expect(tooltip.config.sanitize).toBe(true)
  })
  it('should allow to pass config to Popper with `popperConfig`', () => {
    expect.assertions(1)
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>').appendTo('#qunit-fixture').bootstrapTooltip({
      popperConfig: {
        placement: 'left'
      }
    })
    var tooltip = $trigger.data('bs.tooltip')
    var popperConfig = tooltip._getPopperConfig('top')
    expect(popperConfig.placement).toBe('left')
  })
  it('additional classes can be applied via data attribute', () => {
    expect.assertions(2)
    $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip" data-custom-class="a b"/>').appendTo('#qunit-fixture').bootstrapTooltip().bootstrapTooltip('show')
    var tooltip = $('.tooltip')
    expect(tooltip.hasClass('a b')).toBe(true)
    expect(tooltip.hasClass('tooltip fade bs-tooltip-top show')).toBe(true)
  })
  it('additional classes can be applied via config string', () => {
    expect.assertions(2)
    $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip" />').appendTo('#qunit-fixture').bootstrapTooltip({
      customClass: 'a b'
    }).bootstrapTooltip('show')
    var tooltip = $('.tooltip')
    expect(tooltip.hasClass('a b')).toBe(true)
    expect(tooltip.hasClass('tooltip fade bs-tooltip-top show')).toBe(true)
  })
  it('additional classes can be applied via function', () => {
    expect.assertions(2)
    var getClasses = function () {
      return 'a b'
    }

    $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip" />').appendTo('#qunit-fixture').bootstrapTooltip({
      customClass: getClasses
    }).bootstrapTooltip('show')
    var tooltip = $('.tooltip')
    expect(tooltip.hasClass('a b')).toBe(true)
    expect(tooltip.hasClass('tooltip fade bs-tooltip-top show')).toBe(true)
  })
  it('HTML content can be passed through sanitation multiple times', () => {
    expect.assertions(2)

    // Add the same tooltip twice, so the template will be sanitized twice as well.
    for (var i = 0; i <= 1; i++) {
      $('<a href="#" rel="tooltip" data-trigger="click" title="<img src=\'test.jpg\'>" />').appendTo('#qunit-fixture').bootstrapTooltip({
        html: true
      }).bootstrapTooltip('show')
    }

    var tooltip1Image = $('.tooltip:first img')
    var tooltip2Image = $('.tooltip:last img')
    expect(tooltip1Image.attr('src')).toBe('test.jpg')
    expect(tooltip2Image.attr('src')).toBe('test.jpg')
  })
})
