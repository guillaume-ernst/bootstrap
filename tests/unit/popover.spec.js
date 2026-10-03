import {
  describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi
} from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Popover from '../../js/src/popover'
describe('popover plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
    expect($(document.body).popover).toBeTruthy()
  })
})
describe('popover', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
    $.fn.bootstrapPopover = $.fn.popover.noConflict()
  })
  afterEach(() => {
    $.fn.popover = $.fn.bootstrapPopover
    delete $.fn.bootstrapPopover
    $('.popover').remove()
    clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
    expect(typeof $.fn.popover).toBe('undefined')
  })
  it('should throw explicit error on undefined method', () => {
    expect.assertions(1)
    var $el = $('<div/>')
    $el.bootstrapPopover()
    try {
      $el.bootstrapPopover('noMethod')
    } catch (error) {
      expect(error.message).toBe('No method named "noMethod"')
    }
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
    var $el = $('<div/>')
    var $popover = $el.bootstrapPopover()
    expect($popover instanceof $).toBe(true)
    expect($popover[0]).toBe($el[0])
  })
  it('should render popover element', () => new Promise(resolve => {
    expect.assertions(2)
    $('<a href="#" title="mdo" data-content="https://twitter.com/mdo">@mdo</a>').appendTo('#qunit-fixture').on('shown.bs.popover', function () {
      expect($('.popover').length).not.toBe(0)
      $(this).bootstrapPopover('hide')
    }).on('hidden.bs.popover', function () {
      expect($('.popover').length).toBe(0)
      resolve()
    }).bootstrapPopover('show')
  }))
  it.skip('should render popover element with additional classes', () => new Promise(resolve => {
    expect.assertions(2)
    $('<a href="#" title="mdo" data-content="https://twitter.com/mdo" data-custom-class="a b">@mdo</a>').appendTo('#qunit-fixture').on('shown.bs.popover', function () {
      expect($('.popover').hasClass('popover fade bs-popover-right show')).toBe(true)
      expect($('.popover').hasClass('a b')).toBe(true)
      resolve()
    }).bootstrapPopover('show')
  }))
  it('should store popover instance in popover data object', () => {
    expect.assertions(1)
    var $popover = $('<a href="#" title="mdo" data-content="https://twitter.com/mdo">@mdo</a>').bootstrapPopover()
    expect($popover.data('bs.popover')).toBeTruthy()
  })
  it('should store popover trigger in popover instance data object', () => {
    expect.assertions(1)
    var $popover = $('<a href="#" title="ResentedHook">@ResentedHook</a>').appendTo('#qunit-fixture').bootstrapPopover()
    $popover.bootstrapPopover('show')
    expect($('.popover').data('bs.popover')).toBeTruthy()
  })
  it('should get title and content from options', () => new Promise(resolve => {
    expect.assertions(4)
    var $popover = $('<a href="#">@fat</a>').appendTo('#qunit-fixture').bootstrapPopover({
      title: function () {
        return '@fat'
      },
      content: function () {
        return 'loves writing tests （╯°□°）╯︵ ┻━┻'
      }
    })
    $popover.one('shown.bs.popover', function () {
      expect($('.popover').length).not.toBe(0)
      expect($('.popover .popover-header').text()).toBe('@fat')
      expect($('.popover .popover-body').text()).toBe('loves writing tests （╯°□°）╯︵ ┻━┻')
      $popover.bootstrapPopover('hide')
    }).one('hidden.bs.popover', function () {
      expect($('.popover').length).toBe(0)
      resolve()
    }).bootstrapPopover('show')
  }))
  it('should allow DOMElement title and content (html: true)', () => {
    expect.assertions(5)
    var title = document.createTextNode('@glebm <3 writing tests')
    var content = $(String.raw`<i>¯\_(ツ)_/¯</i>`).get(0)
    var $popover = $('<a href="#" rel="tooltip"/>').appendTo('#qunit-fixture').bootstrapPopover({
      html: true,
      title: title,
      content: content
    })
    $popover.bootstrapPopover('show')
    expect($('.popover').length).not.toBe(0)
    expect($('.popover .popover-header').text()).toBe('@glebm <3 writing tests')
    expect($.contains($('.popover').get(0), title)).toBeTruthy()
    // toLowerCase because IE8 will return <I>...</I>
    expect($('.popover .popover-body').html().toLowerCase()).toBe(String.raw`<i>¯\_(ツ)_/¯</i>`)
    expect($.contains($('.popover').get(0), content)).toBeTruthy()
  })
  it('should allow DOMElement title and content (html: false)', () => {
    expect.assertions(5)
    var title = document.createTextNode('@glebm <3 writing tests')
    var content = $(String.raw`<i>¯\_(ツ)_/¯</i>`).get(0)
    var $popover = $('<a href="#" rel="tooltip"/>').appendTo('#qunit-fixture').bootstrapPopover({
      title: title,
      content: content
    })
    $popover.bootstrapPopover('show')
    expect($('.popover').length).not.toBe(0)
    expect($('.popover .popover-header').text()).toBe('@glebm <3 writing tests')
    expect($.contains($('.popover').get(0), title)).toBe(false)
    expect($('.popover .popover-body').html()).toBe(String.raw`¯\_(ツ)_/¯`)
    expect($.contains($('.popover').get(0), content)).toBe(false)
  })
  it('should not duplicate HTML object', () => new Promise(resolve => {
    expect.assertions(6)
    var $div = $('<div/>').html('loves writing tests （╯°□°）╯︵ ┻━┻')
    var $popover = $('<a href="#">@fat</a>').appendTo('#qunit-fixture').bootstrapPopover({
      html: true,
      content: function () {
        return $div
      }
    })
    function popoverInserted() {
      expect($('.popover').length).not.toBe(0)
      expect($('.popover .popover-body').html()).toBe($div[0].outerHTML)
    }

    $popover.one('shown.bs.popover', function () {
      popoverInserted()
      $popover.one('hidden.bs.popover', function () {
        expect($('.popover').length).toBe(0)
        $popover.one('shown.bs.popover', function () {
          popoverInserted()
          $popover.one('hidden.bs.popover', function () {
            expect($('.popover').length).toBe(0)
            resolve()
          }).bootstrapPopover('hide')
        }).bootstrapPopover('show')
      }).bootstrapPopover('hide')
    }).bootstrapPopover('show')
  }))
  it('should get title and content from attributes', () => new Promise(resolve => {
    expect.assertions(4)
    var $popover = $('<a href="#" title="@mdo" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@mdo</a>').appendTo('#qunit-fixture').bootstrapPopover().one('shown.bs.popover', function () {
      expect($('.popover').length).not.toBe(0)
      expect($('.popover .popover-header').text()).toBe('@mdo')
      expect($('.popover .popover-body').text()).toBe('loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻')
      $popover.bootstrapPopover('hide')
    }).one('hidden.bs.popover', function () {
      expect($('.popover').length).toBe(0)
      resolve()
    }).bootstrapPopover('show')
  }))
  it('should get title and content from attributes ignoring options passed via js', () => new Promise(resolve => {
    expect.assertions(4)
    var $popover = $('<a href="#" title="@mdo" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@mdo</a>').appendTo('#qunit-fixture').bootstrapPopover({
      title: 'ignored title option',
      content: 'ignored content option'
    }).one('shown.bs.popover', function () {
      expect($('.popover').length).not.toBe(0)
      expect($('.popover .popover-header').text()).toBe('@mdo')
      expect($('.popover .popover-body').text()).toBe('loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻')
      $popover.bootstrapPopover('hide')
    }).one('hidden.bs.popover', function () {
      expect($('.popover').length).toBe(0)
      resolve()
    }).bootstrapPopover('show')
  }))
  it('should respect custom template', () => new Promise(resolve => {
    expect.assertions(3)
    var $popover = $('<a href="#">@fat</a>').appendTo('#qunit-fixture').bootstrapPopover({
      title: 'Test',
      content: 'Test',
      template: '<div class="popover foobar"><div class="arrow"></div><div class="inner"><h3 class="title"/><div class="content"><p/></div></div></div>'
    }).one('shown.bs.popover', function () {
      expect($('.popover').length).not.toBe(0)
      expect($('.popover').hasClass('foobar')).toBe(true)
      $popover.bootstrapPopover('hide')
    }).one('hidden.bs.popover', function () {
      expect($('.popover').length).toBe(0)
      resolve()
    }).bootstrapPopover('show')
  }))
  it('should destroy popover', () => {
    expect.assertions(9)
    var $popover = $('<div/>').bootstrapPopover({
      trigger: 'hover'
    }).on('click.foo', $.noop)
    expect($popover.data('bs.popover')).toBeTruthy()
    expect($._data($popover[0], 'events').mouseover).toBeTruthy()
    expect($._data($popover[0], 'events').mouseout).toBeTruthy()
    expect($._data($popover[0], 'events').click[0].namespace).toBe('foo')
    $popover.bootstrapPopover('show')
    $popover.bootstrapPopover('dispose')
    expect($popover.hasClass('show')).toBe(false)
    expect(typeof $popover.data('popover')).toBe('undefined')
    expect($._data($popover[0], 'events').click[0].namespace).toBe('foo')
    expect(typeof $._data($popover[0], 'events').mouseover).toBe('undefined')
    expect(typeof $._data($popover[0], 'events').mouseout).toBe('undefined')
  })
  it('should render popover element using delegated selector', () => new Promise(resolve => {
    expect.assertions(2)
    var $div = $('<div><a href="#" title="mdo" data-content="https://twitter.com/mdo">@mdo</a></div>').appendTo('#qunit-fixture').bootstrapPopover({
      selector: 'a',
      trigger: 'click'
    }).one('shown.bs.popover', function () {
      expect($('.popover').length).not.toBe(0)
      $div.find('a').trigger('click')
    }).one('hidden.bs.popover', function () {
      expect($('.popover').length).toBe(0)
      resolve()
    })
    $div.find('a').trigger('click')
  }))
  it('should detach popover content rather than removing it so that event handlers are left intact', () => new Promise(resolve => {
    expect.assertions(1)
    var $content = $('<div class="content-with-handler"><a class="btn btn-warning">Button with event handler</a></div>').appendTo('#qunit-fixture')
    var handlerCalled = false
    $('.content-with-handler .btn').on('click', function () {
      handlerCalled = true
    })
    var $div = $('<div><a href="#">Show popover</a></div>').appendTo('#qunit-fixture').bootstrapPopover({
      html: true,
      trigger: 'manual',
      container: 'body',
      animation: false,
      content: function () {
        return $content
      }
    })
    $div.one('shown.bs.popover', function () {
      $div.one('hidden.bs.popover', function () {
        $div.one('shown.bs.popover', function () {
          $('.content-with-handler .btn').trigger('click')
          expect(handlerCalled).toBe(true)
          $div.bootstrapPopover('dispose')
          resolve()
        }).bootstrapPopover('show')
      }).bootstrapPopover('hide')
    }).bootstrapPopover('show')
  }))
  it('should do nothing when an attempt is made to hide an uninitialized popover', () => {
    expect.assertions(1)
    var $popover = $('<span data-toggle="popover" data-title="some title" data-content="some content">some text</span>').appendTo('#qunit-fixture').on('hidden.bs.popover shown.bs.popover', function () {
      expect(false).toBeTruthy()
    }).bootstrapPopover('hide')
    expect(typeof $popover.data('bs.popover')).toBe('undefined')
  })
  it('should fire inserted event', () => new Promise(resolve => {
    expect.assertions(2)
    $('<a href="#">@Johann-S</a>').appendTo('#qunit-fixture').on('inserted.bs.popover', function () {
      expect($('.popover').length).not.toBe(0)
      expect(true).toBeTruthy()
      resolve()
    }).bootstrapPopover({
      title: 'Test',
      content: 'Test'
    }).bootstrapPopover('show')
  }))
  it('should throw an error when show is called on hidden elements', () => new Promise(resolve => {
    expect.assertions(1)
    try {
      $('<div data-toggle="popover" data-title="some title" data-content="@Johann-S" style="display: none"/>').bootstrapPopover('show')
    } catch (error) {
      expect(error.message).toBe('Please use show on visible elements')
      resolve()
    }
  }))
  it.skip('should hide popovers when their containing modal is closed', () => new Promise(resolve => {
    expect.assertions(1)
    var templateHTML = '<div id="modal-test" class="modal">' + '<div class="modal-dialog" role="document">' + '<div class="modal-content">' + '<div class="modal-body">' + '<button id="popover-test" type="button" class="btn btn-secondary" data-toggle="popover" data-placement="top" data-content="Popover">' + 'Popover on top' + '</button>' + '</div>' + '</div>' + '</div>' + '</div>'
    $(templateHTML).appendTo('#qunit-fixture')
    $('#popover-test').on('shown.bs.popover', function () {
      $('#modal-test').modal('hide')
    }).on('hide.bs.popover', function () {
      expect(true).toBeTruthy()
      resolve()
    })
    $('#modal-test').on('shown.bs.modal', function () {
      $('#popover-test').bootstrapPopover('show')
    }).modal('show')
  }))
  it('should convert number to string without error for content and title', () => new Promise(resolve => {
    expect.assertions(2)
    var $popover = $('<a href="#">@mdo</a>').appendTo('#qunit-fixture').bootstrapPopover({
      title: 5,
      content: 7
    }).on('shown.bs.popover', function () {
      expect($('.popover .popover-header').text()).toBe('5')
      expect($('.popover .popover-body').text()).toBe('7')
      resolve()
    })
    $popover.bootstrapPopover('show')
  }))
  it('popover should be shown right away after the call of disable/enable', () => new Promise(resolve => {
    expect.assertions(2)
    var $popover = $('<a href="#">@mdo</a>').appendTo('#qunit-fixture').bootstrapPopover({
      title: 'Test popover',
      content: 'with disable/enable'
    }).on('shown.bs.popover', function () {
      expect($('.popover').hasClass('show')).toBe(true)
      resolve()
    })
    $popover.bootstrapPopover('disable')
    $popover.trigger($.Event('click'))
    setTimeout(function () {
      expect($('.popover').length).toBe(0)
      $popover.bootstrapPopover('enable')
      $popover.trigger($.Event('click'))
    }, 200)
  }))
  it('popover should call content function only once', () => new Promise(resolve => {
    expect.assertions(1)
    var nbCall = 0
    $('<div id="popover" style="display:none">content</div>').appendTo('#qunit-fixture')
    var $popover = $('<a href="#">@Johann-S</a>').appendTo('#qunit-fixture').bootstrapPopover({
      content: function () {
        nbCall++
        return $('#popover').clone().show().get(0)
      }
    }).on('shown.bs.popover', function () {
      expect(nbCall).toBe(1)
      resolve()
    })
    $popover.trigger($.Event('click'))
  }))
})
