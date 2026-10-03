import {
  describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi
} from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Carousel from '../../js/src/carousel'
const originWinPointerEvent = globalThis.PointerEvent
globalThis.MSPointerEvent = null
const supportPointerEvent = Boolean(globalThis.PointerEvent || globalThis.MSPointerEvent)
function clearPointerEvents() {
  globalThis.PointerEvent = null
}

function restorePointerEvents() {
  globalThis.PointerEvent = originWinPointerEvent
}

const stylesCarousel = ['<style>', '  .carousel.pointer-event { -ms-touch-action: none; touch-action: none; }', '</style>'].join('')
describe('carousel plugin', () => {
  it('should be defined on jQuery object', () => {
    expect.assertions(1)
    expect($(document.body).carousel).toBeTruthy()
  })
})
describe('carousel', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
    $.fn.bootstrapCarousel = $.fn.carousel.noConflict()
  })
  afterEach(() => {
    $.fn.carousel = $.fn.bootstrapCarousel
    delete $.fn.bootstrapCarousel
    clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
    expect(typeof $.fn.carousel).toBe('undefined')
  })
  it('should return version', () => {
    expect.assertions(1)
    expect(typeof Carousel.VERSION).toBe('string')
  })
  it('should return default parameters', () => {
    expect.assertions(1)
    var defaultConfig = Carousel.Default
    expect(defaultConfig.touch).toBe(true)
  })
  it('should throw explicit error on undefined method', () => {
    expect.assertions(1)
    var $el = $('<div/>')
    $el.bootstrapCarousel()
    try {
      $el.bootstrapCarousel('noMethod')
    } catch (error) {
      expect(error.message).toBe('No method named "noMethod"')
    }
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
    var $el = $('<div/>')
    var $carousel = $el.bootstrapCarousel()
    expect($carousel instanceof $).toBe(true)
    expect($carousel[0]).toBe($el[0])
  })
  it('should type check config options', () => {
    expect.assertions(2)
    var message
    var expectedMessage = 'CAROUSEL: Option "interval" provided type "string" but expected type "(number|boolean)".'
    var config = {
      interval: 'fat sux'
    }
    try {
      $('<div/>').bootstrapCarousel(config)
    } catch (error) {
      message = error.message
    }

    expect(message).toBe(expectedMessage)
    config = {
      keyboard: document.createElement('div')
    }
    expectedMessage = 'CAROUSEL: Option "keyboard" provided type "element" but expected type "boolean".'
    try {
      $('<div/>').bootstrapCarousel(config)
    } catch (error) {
      message = error.message
    }

    expect(message).toBe(expectedMessage)
  })
  it('should not fire slid when slide is prevented', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div class="carousel"/>').on('slide.bs.carousel', function (e) {
      e.preventDefault()
      expect(true).toBeTruthy()
      resolve()
    }).on('slid.bs.carousel', function () {
      expect(false).toBeTruthy()
    }).bootstrapCarousel('next')
  }))
  it('should reset when slide is prevented', () => new Promise(resolve => {
    expect.assertions(6)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide">' + '<ol class="carousel-indicators">' + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' + '<li data-target="#carousel-example-generic" data-slide-to="1"/>' + '<li data-target="#carousel-example-generic" data-slide-to="2"/>' + '</ol>' + '<div class="carousel-inner">' + '<div class="carousel-item active">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item">' + '<div class="carousel-caption"></div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' + '</div>'
    var $carousel = $(carouselHTML)
    $carousel.one('slide.bs.carousel', function (e) {
      e.preventDefault()
      setTimeout(function () {
        expect($carousel.find('.carousel-item:nth-child(1)').is('.active')).toBe(true)
        expect($carousel.find('.carousel-indicators li:nth-child(1)').is('.active')).toBe(true)
        $carousel.bootstrapCarousel('next')
      }, 0)
    }).one('slid.bs.carousel', function () {
      setTimeout(function () {
        expect($carousel.find('.carousel-item:nth-child(1)').is('.active')).toBe(false)
        expect($carousel.find('.carousel-indicators li:nth-child(1)').is('.active')).toBe(false)
        expect($carousel.find('.carousel-item:nth-child(2)').is('.active')).toBe(true)
        expect($carousel.find('.carousel-indicators li:nth-child(2)').is('.active')).toBe(true)
        resolve()
      }, 0)
    }).bootstrapCarousel('next')
  }))
  it('should fire slide event with direction', () => new Promise(resolve => {
    expect.assertions(4)
    var carouselHTML = '<div id="myCarousel" class="carousel slide">' + '<div class="carousel-inner">' + '<div class="carousel-item active">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>First Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Second Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Third Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' + '</div>'
    var $carousel = $(carouselHTML)
    $carousel.one('slide.bs.carousel', function (e) {
      expect(e.direction).not.toBe('undefined')
      expect(e.direction).toBe('left')
      $carousel.one('slide.bs.carousel', function (e) {
        expect(e.direction).not.toBe('undefined')
        expect(e.direction).toBe('right')
        resolve()
      }).bootstrapCarousel('prev')
    }).bootstrapCarousel('next')
  }))
  it('should fire slid event with direction', () => new Promise(resolve => {
    expect.assertions(4)
    var carouselHTML = '<div id="myCarousel" class="carousel slide">' + '<div class="carousel-inner">' + '<div class="carousel-item active">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>First Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Second Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Third Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' + '</div>'
    var $carousel = $(carouselHTML)
    $carousel.one('slid.bs.carousel', function (e) {
      expect(e.direction).not.toBe('undefined')
      expect(e.direction).toBe('left')
      $carousel.one('slid.bs.carousel', function (e) {
        expect(e.direction).not.toBe('undefined')
        expect(e.direction).toBe('right')
        resolve()
      }).bootstrapCarousel('prev')
    }).bootstrapCarousel('next')
  }))
  it('should fire slide event with relatedTarget', () => new Promise(resolve => {
    expect.assertions(2)
    var template = '<div id="myCarousel" class="carousel slide">' + '<div class="carousel-inner">' + '<div class="carousel-item active">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>First Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Second Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Third Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' + '</div>'
    $(template).on('slide.bs.carousel', function (e) {
      expect(e.relatedTarget).not.toBe('undefined')
      expect($(e.relatedTarget).hasClass('carousel-item')).toBe(true)
      resolve()
    }).bootstrapCarousel('next')
  }))
  it('should fire slid event with relatedTarget', () => new Promise(resolve => {
    expect.assertions(2)
    var template = '<div id="myCarousel" class="carousel slide">' + '<div class="carousel-inner">' + '<div class="carousel-item active">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>First Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Second Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Third Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' + '</div>'
    $(template).on('slid.bs.carousel', function (e) {
      expect(e.relatedTarget).not.toBe('undefined')
      expect($(e.relatedTarget).hasClass('carousel-item')).toBe(true)
      resolve()
    }).bootstrapCarousel('next')
  }))
  it('should fire slid and slide events with from and to', () => new Promise(resolve => {
    expect.assertions(4)
    var template = '<div id="myCarousel" class="carousel slide">' + '<div class="carousel-inner">' + '<div class="carousel-item active">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>First Thumbnail label</h4>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Second Thumbnail label</h4>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Third Thumbnail label</h4>' + '</div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' + '</div>'
    $(template).on('slid.bs.carousel', function (e) {
      expect(typeof e.from).not.toBe('undefined')
      expect(typeof e.to).not.toBe('undefined')
      $(this).off()
      resolve()
    }).on('slide.bs.carousel', function (e) {
      expect(typeof e.from).not.toBe('undefined')
      expect(typeof e.to).not.toBe('undefined')
      $(this).off('slide.bs.carousel')
    }).bootstrapCarousel('next')
  }))
  it.skip('should set interval from data attribute', () => {
    expect.assertions(4)
    var templateHTML = '<div id="myCarousel" class="carousel slide">' + '<div class="carousel-inner">' + '<div class="carousel-item active">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>First Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Second Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Third Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' + '</div>'
    var $carousel = $(templateHTML)
    $carousel.attr('data-interval', 1814)
    $carousel.appendTo('body')
    $('[data-slide]').first().trigger('click')
    expect($carousel.data('bs.carousel')._config.interval).toBe(1814)
    $carousel.remove()
    $carousel.appendTo('body').attr('data-modal', 'foobar')
    $('[data-slide]').first().trigger('click')
    expect($carousel.data('bs.carousel')._config.interval).toBe(1814)
    $carousel.remove()
    $carousel.appendTo('body')
    $('[data-slide]').first().trigger('click')
    $carousel.attr('data-interval', 1860)
    $('[data-slide]').first().trigger('click')
    expect($carousel.data('bs.carousel')._config.interval).toBe(1814)
    $carousel.remove()
    $carousel.attr('data-interval', false)
    $carousel.appendTo('body')
    $carousel.bootstrapCarousel(1)
    expect($carousel.data('bs.carousel')._config.interval).toBe(false)
    $carousel.remove()
  })
  it('should set interval from data attribute on individual carousel-item', () => {
    expect.assertions(4)
    var templateHTML = '<div id="myCarousel" class="carousel slide" data-interval="1814">' + '<div class="carousel-inner">' + '<div class="carousel-item active" data-interval="2814">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>First Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item" data-interval="3814">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Second Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '<div class="carousel-item">' + '<img alt="">' + '<div class="carousel-caption">' + '<h4>Third Thumbnail label</h4>' + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' + 'ultricies vehicula ut id elit.</p>' + '</div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' + '</div>'
    var $carousel = $(templateHTML)
    $carousel.appendTo('body')
    $carousel.bootstrapCarousel()
    expect($carousel.data('bs.carousel')._config.interval).toBe(1814)
    $carousel.remove()
    $carousel.appendTo('body')
    $carousel.bootstrapCarousel(0)
    $carousel.data('bs.carousel').cycle()
    expect($carousel.data('bs.carousel')._config.interval).toBe(2814)
    $carousel.remove()
    $carousel.appendTo('body')
    $carousel.bootstrapCarousel(1)
    $carousel.data('bs.carousel').cycle()
    expect($carousel.data('bs.carousel')._config.interval).toBe(3814)
    $carousel.remove()
    $carousel.appendTo('body')
    $carousel.bootstrapCarousel(2)
    $carousel.data('bs.carousel').cycle()
    expect($carousel.data('bs.carousel')._config.interval).toBe(1814)
    $carousel.remove()
  })
  it('should skip over non-items when using item indices', () => {
    expect.assertions(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="1814">' + '<div class="carousel-inner">' + '<div class="carousel-item active">' + '<img alt="">' + '</div>' + '<script type="text/x-metamorph" id="thingy"></script>' + '<div class="carousel-item">' + '<img alt="">' + '</div>' + '<div class="carousel-item">' + '</div>' + '</div>' + '</div>'
    var $template = $(templateHTML)
    $template.bootstrapCarousel()
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
    $template.bootstrapCarousel(1)
    expect($template.find('.carousel-item')[1]).toBe($template.find('.active')[0])
  })
  it('should skip over non-items when using next/prev methods', () => {
    expect.assertions(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="1814">' + '<div class="carousel-inner">' + '<div class="carousel-item active">' + '<img alt="">' + '</div>' + '<script type="text/x-metamorph" id="thingy"></script>' + '<div class="carousel-item">' + '<img alt="">' + '</div>' + '<div class="carousel-item">' + '</div>' + '</div>' + '</div>'
    var $template = $(templateHTML)
    $template.bootstrapCarousel()
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
    $template.bootstrapCarousel('next')
    expect($template.find('.carousel-item')[1]).toBe($template.find('.active')[0])
  })
  it('should go to previous item if left arrow key is pressed', () => {
    expect.assertions(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' + '<div class="carousel-inner">' + '<div id="first" class="carousel-item">' + '<img alt="">' + '</div>' + '<div id="second" class="carousel-item active">' + '<img alt="">' + '</div>' + '<div id="third" class="carousel-item">' + '<img alt="">' + '</div>' + '</div>' + '</div>'
    var $template = $(templateHTML)
    $template.bootstrapCarousel()
    expect($template.find('.carousel-item')[1]).toBe($template.find('.active')[0])
    $template.trigger($.Event('keydown', {
      which: 37
    }))
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
  })
  it('should go to next item if right arrow key is pressed', () => {
    expect.assertions(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' + '<div class="carousel-inner">' + '<div id="first" class="carousel-item active">' + '<img alt="">' + '</div>' + '<div id="second" class="carousel-item">' + '<img alt="">' + '</div>' + '<div id="third" class="carousel-item">' + '<img alt="">' + '</div>' + '</div>' + '</div>'
    var $template = $(templateHTML)
    $template.bootstrapCarousel()
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
    $template.trigger($.Event('keydown', {
      which: 39
    }))
    expect($template.find('.carousel-item')[1]).toBe($template.find('.active')[0])
  })
  it('should not prevent keydown if key is not ARROW_LEFT or ARROW_RIGHT', () => new Promise(resolve => {
    expect.assertions(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' + '<div class="carousel-inner">' + '<div id="first" class="carousel-item active">' + '<img alt="">' + '</div>' + '</div>' + '</div>'
    var $template = $(templateHTML)
    $template.bootstrapCarousel()
    var eventArrowDown = $.Event('keydown', {
      which: 40
    })
    var eventArrowUp = $.Event('keydown', {
      which: 38
    })
    $template.one('keydown', function (event) {
      expect(event.isDefaultPrevented()).toBe(false)
    })
    $template.trigger(eventArrowDown)
    $template.one('keydown', function (event) {
      expect(event.isDefaultPrevented()).toBe(false)
      resolve()
    })
    $template.trigger(eventArrowUp)
  }))
  it('should support disabling the keyboard navigation', () => {
    expect.assertions(3)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false" data-keyboard="false">' + '<div class="carousel-inner">' + '<div id="first" class="carousel-item active">' + '<img alt="">' + '</div>' + '<div id="second" class="carousel-item">' + '<img alt="">' + '</div>' + '<div id="third" class="carousel-item">' + '<img alt="">' + '</div>' + '</div>' + '</div>'
    var $template = $(templateHTML)
    $template.bootstrapCarousel()
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
    $template.trigger($.Event('keydown', {
      which: 39
    }))
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
    $template.trigger($.Event('keydown', {
      which: 37
    }))
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
  })
  it('should ignore keyboard events within <input>s and <textarea>s', () => {
    expect.assertions(7)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' + '<div class="carousel-inner">' + '<div id="first" class="carousel-item active">' + '<img alt="">' + '<input type="text" id="in-put">' + '<textarea id="text-area"></textarea>' + '</div>' + '<div id="second" class="carousel-item">' + '<img alt="">' + '</div>' + '<div id="third" class="carousel-item">' + '<img alt="">' + '</div>' + '</div>' + '</div>'
    var $template = $(templateHTML)
    var $input = $template.find('#in-put')
    var $textarea = $template.find('#text-area')
    expect($input.length).toBe(1)
    expect($textarea.length).toBe(1)
    $template.bootstrapCarousel()
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
    $input.trigger($.Event('keydown', {
      which: 39
    }))
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
    $input.trigger($.Event('keydown', {
      which: 37
    }))
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
    $textarea.trigger($.Event('keydown', {
      which: 39
    }))
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
    $textarea.trigger($.Event('keydown', {
      which: 37
    }))
    expect($template.find('.carousel-item')[0]).toBe($template.find('.active')[0])
  })
  it('should wrap around from end to start when wrap option is true', () => new Promise(resolve => {
    expect.assertions(3)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="true">' + '<ol class="carousel-indicators">' + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' + '<li data-target="#carousel-example-generic" data-slide-to="1"/>' + '<li data-target="#carousel-example-generic" data-slide-to="2"/>' + '</ol>' + '<div class="carousel-inner">' + '<div class="carousel-item active" id="one">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item" id="two">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item" id="three">' + '<div class="carousel-caption"></div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' + '</div>'
    var $carousel = $(carouselHTML)
    var getActiveId = function () {
      return $carousel.find('.carousel-item.active').attr('id')
    }

    $carousel.one('slid.bs.carousel', function () {
      expect(getActiveId()).toBe('two')
      $carousel.one('slid.bs.carousel', function () {
        expect(getActiveId()).toBe('three')
        $carousel.one('slid.bs.carousel', function () {
          expect(getActiveId()).toBe('one')
          resolve()
        }).bootstrapCarousel('next')
      }).bootstrapCarousel('next')
    }).bootstrapCarousel('next')
  }))
  it('should wrap around from start to end when wrap option is true', () => new Promise(resolve => {
    expect.assertions(1)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="true">' + '<ol class="carousel-indicators">' + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' + '<li data-target="#carousel-example-generic" data-slide-to="1"/>' + '<li data-target="#carousel-example-generic" data-slide-to="2"/>' + '</ol>' + '<div class="carousel-inner">' + '<div class="carousel-item active" id="one">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item" id="two">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item" id="three">' + '<div class="carousel-caption"></div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' + '</div>'
    var $carousel = $(carouselHTML)
    $carousel.on('slid.bs.carousel', function () {
      expect($carousel.find('.carousel-item.active').attr('id')).toBe('three')
      resolve()
    }).bootstrapCarousel('prev')
  }))
  it('should stay at the end when the next method is called and wrap is false', () => new Promise(resolve => {
    expect.assertions(3)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="false">' + '<ol class="carousel-indicators">' + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' + '<li data-target="#carousel-example-generic" data-slide-to="1"/>' + '<li data-target="#carousel-example-generic" data-slide-to="2"/>' + '</ol>' + '<div class="carousel-inner">' + '<div class="carousel-item active" id="one">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item" id="two">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item" id="three">' + '<div class="carousel-caption"></div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' + '</div>'
    var $carousel = $(carouselHTML)
    var getActiveId = function () {
      return $carousel.find('.carousel-item.active').attr('id')
    }

    $carousel.one('slid.bs.carousel', function () {
      expect(getActiveId()).toBe('two')
      $carousel.one('slid.bs.carousel', function () {
        expect(getActiveId()).toBe('three')
        $carousel.one('slid.bs.carousel', function () {
          expect(false).toBeTruthy()
        }).bootstrapCarousel('next')
        expect(getActiveId()).toBe('three')
        resolve()
      }).bootstrapCarousel('next')
    }).bootstrapCarousel('next')
  }))
  it('should stay at the start when the prev method is called and wrap is false', () => {
    expect.assertions(1)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="false">' + '<ol class="carousel-indicators">' + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' + '<li data-target="#carousel-example-generic" data-slide-to="1"/>' + '<li data-target="#carousel-example-generic" data-slide-to="2"/>' + '</ol>' + '<div class="carousel-inner">' + '<div class="carousel-item active" id="one">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item" id="two">' + '<div class="carousel-caption"></div>' + '</div>' + '<div class="carousel-item" id="three">' + '<div class="carousel-caption"></div>' + '</div>' + '</div>' + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' + '</div>'
    var $carousel = $(carouselHTML)
    $carousel.on('slid.bs.carousel', function () {
      expect(false).toBeTruthy()
    }).bootstrapCarousel('prev')
    expect($carousel.find('.carousel-item.active').attr('id')).toBe('one')
  })
  it('should not prevent keydown for inputs and textareas', () => new Promise(resolve => {
    expect.assertions(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' + '<div class="carousel-inner">' + '<div id="first" class="carousel-item">' + '<input type="text" id="inputText" />' + '</div>' + '<div id="second" class="carousel-item active">' + '<textarea id="txtArea"></textarea>' + '</div>' + '</div>' + '</div>'
    var $template = $(templateHTML)
    $template.appendTo('#qunit-fixture')
    var $inputText = $template.find('#inputText')
    var $textArea = $template.find('#txtArea')
    $template.bootstrapCarousel()
    var eventKeyDown = $.Event('keydown', {
      which: 65
    }) // 65 for "a"
    $inputText.on('keydown', function (event) {
      expect(event.isDefaultPrevented()).toBe(false)
    })
    $inputText.trigger(eventKeyDown)
    $textArea.on('keydown', function (event) {
      expect(event.isDefaultPrevented()).toBe(false)
      resolve()
    })
    $textArea.trigger(eventKeyDown)
  }))
  it('should not go to the next item when the carousel is not visible', () => new Promise(resolve => {
    expect.assertions(2)
    var html = '<div id="myCarousel" class="carousel slide" data-interval="50" style="display: none;">' + '  <div class="carousel-inner">' + '    <div id="firstItem" class="carousel-item active">' + '      <img alt="">' + '    </div>' + '    <div class="carousel-item">' + '      <img alt="">' + '    </div>' + '    <div class="carousel-item">' + '      <img alt="">' + '    </div>' + '  <a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' + '  <a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' + '</div>'
    var $html = $(html)
    $html.appendTo('#qunit-fixture').bootstrapCarousel()
    var $firstItem = $('#firstItem')
    setTimeout(function () {
      expect($firstItem.hasClass('active')).toBe(true)
      $html.bootstrapCarousel('dispose').attr('style', 'visibility: hidden;').bootstrapCarousel()
      setTimeout(function () {
        expect($firstItem.hasClass('active')).toBe(true)
        resolve()
      }, 80)
    }, 80)
  }))
  it('should not go to the next item when the parent of the carousel is not visible', () => new Promise(resolve => {
    expect.assertions(2)
    var html = '<div id="parent" style="display: none;">' + '  <div id="myCarousel" class="carousel slide" data-interval="50" style="display: none;">' + '    <div class="carousel-inner">' + '      <div id="firstItem" class="carousel-item active">' + '        <img alt="">' + '      </div>' + '      <div class="carousel-item">' + '        <img alt="">' + '      </div>' + '      <div class="carousel-item">' + '        <img alt="">' + '      </div>' + '    <a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' + '    <a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' + '  </div>' + '</div>'
    var $html = $(html)
    $html.appendTo('#qunit-fixture')
    var $parent = $html.find('#parent')
    var $carousel = $html.find('#myCarousel')
    $carousel.bootstrapCarousel()
    var $firstItem = $('#firstItem')
    setTimeout(function () {
      expect($firstItem.hasClass('active')).toBe(true)
      $carousel.bootstrapCarousel('dispose')
      $parent.attr('style', 'visibility: hidden;')
      $carousel.bootstrapCarousel()
      setTimeout(function () {
        expect($firstItem.hasClass('active')).toBe(true)
        resolve()
      }, 80)
    }, 80)
  }))
  // Skipped: depends on the QUnit-only Simulator global for touch gesture simulation.
  it.skip('should allow swiperight and call prev with pointer events', done => {
    if (!supportPointerEvent) {
      return
    }

    document.documentElement.ontouchstart = $.noop
    Simulator.setType('pointer')
    expect.assertions(3)
    var $styles = $(stylesCarousel).appendTo('head')
    var carouselHTML = '<div class="carousel" data-interval="false">' + '  <div class="carousel-inner">' + '    <div id="item" class="carousel-item">' + '      <img alt="">' + '    </div>' + '    <div class="carousel-item active">' + '      <img alt="">' + '    </div>' + '  </div>' + '</div>'
    var $carousel = $(carouselHTML).appendTo('#qunit-fixture')
    var $item = $('#item')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, 'prev')
    $carousel.one('slid.bs.carousel', function () {
      expect(true).toBeTruthy()
      expect($item.hasClass('active')).toBe(true)
      expect(spy.called).toBe(true)
      $styles.remove()
      delete document.documentElement.ontouchstart
      done()
    })
    Simulator.gestures.swipe($carousel[0], {
      deltaX: 300,
      deltaY: 0
    })
  })
  // Skipped: depends on the QUnit-only Simulator global for touch gesture simulation.
  it.skip('should allow swiperight and call prev with touch events', done => {
    Simulator.setType('touch')
    clearPointerEvents()
    expect.assertions(3)
    document.documentElement.ontouchstart = $.noop
    var carouselHTML = '<div class="carousel" data-interval="false">' + '  <div class="carousel-inner">' + '    <div id="item" class="carousel-item">' + '      <img alt="">' + '    </div>' + '    <div class="carousel-item active">' + '      <img alt="">' + '    </div>' + '  </div>' + '</div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    var $item = $('#item')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, 'prev')
    $carousel.one('slid.bs.carousel', function () {
      expect(true).toBeTruthy()
      expect($item.hasClass('active')).toBe(true)
      expect(spy.called).toBe(true)
      delete document.documentElement.ontouchstart
      restorePointerEvents()
      done()
    })
    Simulator.gestures.swipe($carousel[0], {
      deltaX: 300,
      deltaY: 0
    })
  })
  // Skipped: depends on the QUnit-only Simulator global for touch gesture simulation.
  it.skip('should allow swipeleft and call next with pointer events', done => {
    if (!supportPointerEvent) {
      return
    }

    document.documentElement.ontouchstart = $.noop
    expect.assertions(4)
    Simulator.setType('pointer')
    var $styles = $(stylesCarousel).appendTo('head')
    var carouselHTML = '<div class="carousel" data-interval="false">' + '  <div class="carousel-inner">' + '    <div id="item" class="carousel-item active">' + '      <img alt="">' + '    </div>' + '    <div class="carousel-item">' + '      <img alt="">' + '    </div>' + '  </div>' + '</div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    var $item = $('#item')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, 'next')
    $carousel.one('slid.bs.carousel', function () {
      expect(true).toBeTruthy()
      expect($item.hasClass('active')).toBe(false)
      expect(spy.called).toBe(true)
      expect(carousel.touchDeltaX).toBe(0)
      $styles.remove()
      delete document.documentElement.ontouchstart
      done()
    })
    Simulator.gestures.swipe($carousel[0], {
      pos: [300, 10],
      deltaX: -300,
      deltaY: 0
    })
  })
  // Skipped: depends on the QUnit-only Simulator global for touch gesture simulation.
  it.skip('should allow swipeleft and call next with touch events', done => {
    expect.assertions(4)
    clearPointerEvents()
    Simulator.setType('touch')
    document.documentElement.ontouchstart = $.noop
    var carouselHTML = '<div class="carousel" data-interval="false">' + '  <div class="carousel-inner">' + '    <div id="item" class="carousel-item active">' + '      <img alt="">' + '    </div>' + '    <div class="carousel-item">' + '      <img alt="">' + '    </div>' + '  </div>' + '</div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    var $item = $('#item')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, 'next')
    $carousel.one('slid.bs.carousel', function () {
      expect(true).toBeTruthy()
      expect($item.hasClass('active')).toBe(false)
      expect(spy.called).toBe(true)
      expect(carousel.touchDeltaX).toBe(0)
      restorePointerEvents()
      delete document.documentElement.ontouchstart
      done()
    })
    Simulator.gestures.swipe($carousel[0], {
      pos: [300, 10],
      deltaX: -300,
      deltaY: 0
    })
  })
  // Skipped: depends on the QUnit-only Simulator global for touch gesture simulation.
  it.skip('should not allow pinch with touch events', done => {
    clearPointerEvents()
    Simulator.setType('touch')
    document.documentElement.ontouchstart = $.noop
    var carouselHTML = '<div class="carousel" data-interval="false"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()
    Simulator.gestures.swipe($carousel[0], {
      pos: [300, 10],
      deltaX: -300,
      deltaY: 0,
      touches: 2
    }, function () {
      restorePointerEvents()
      delete document.documentElement.ontouchstart
      done()
    })
  })
  it('should not call _slide if the carousel is sliding', () => {
    expect.assertions(1)
    var carouselHTML = '<div class="carousel" data-interval="false"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, '_slide')
    carousel._isSliding = true
    carousel.next()
    expect(spy.called).toBe(false)
  })
  it('should call next when the page is visible', () => {
    expect.assertions(1)
    var carouselHTML = '<div class="carousel" data-interval="false"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, 'next')
    var sandbox = sinon.createSandbox()
    sandbox.replaceGetter(document, 'hidden', function () {
      return false
    })
    sandbox.stub($carousel, 'is').returns(true)
    sandbox.stub($carousel, 'css').returns('block')
    carousel.nextWhenVisible()
    expect(spy.called).toBe(true)
    sandbox.restore()
  })
  it('should not cycle when there is no attribute data-ride', () => {
    expect.assertions(1)
    var spy = sinon.spy(Carousel.prototype, 'cycle')
    var carouselHTML = '<div class="carousel"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()
    expect(spy.called).toBe(false)
    spy.restore()
  })
  it('should cycle when there is data-ride attribute', () => {
    expect.assertions(1)
    var spy = sinon.spy(Carousel.prototype, 'cycle')
    var carouselHTML = '<div class="carousel" data-ride="carousel"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()
    expect(spy.called).toBe(true)
    spy.restore()
  })
  it('should init carousels with data-ride on load event', () => new Promise(resolve => {
    expect.assertions(1)
    var spy = sinon.spy(Carousel, '_jQueryInterface')
    var carouselHTML = '<div class="carousel" data-ride="carousel"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $(globalThis).trigger($.Event('load'))
    setTimeout(function () {
      expect(spy.called).toBe(true)
      spy.restore()
      resolve()
    }, 5)
  }))
  it('should not add touch event listeners when touch option set to false', () => {
    expect.assertions(1)
    var spy = sinon.spy(Carousel.prototype, '_addTouchEventListeners')
    var $carousel = $('<div class="carousel" data-ride="carousel" data-touch="false"></div>')
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()
    expect(spy.called).toBe(false)
    spy.restore()
  })
})
