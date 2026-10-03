import {
  describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi
} from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import ScrollSpy from '../../js/src/scrollspy'
describe('scrollspy plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
    expect($(document.body).scrollspy).toBeTruthy()
  })
})
describe('scrollspy', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
    $.fn.bootstrapScrollspy = $.fn.scrollspy.noConflict()
  })
  afterEach(() => {
    $.fn.scrollspy = $.fn.bootstrapScrollspy
    delete $.fn.bootstrapScrollspy
    clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
    expect(typeof $.fn.scrollspy).toBe('undefined')
  })
  it('should throw explicit error on undefined method', () => {
    expect.assertions(1)
    var $el = $('<div/>').appendTo('#qunit-fixture')
    $el.bootstrapScrollspy()
    try {
      $el.bootstrapScrollspy('noMethod')
    } catch (error) {
      expect(error.message).toBe('No method named "noMethod"')
    }
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
    var $el = $('<div/>').appendTo('#qunit-fixture')
    var $scrollspy = $el.bootstrapScrollspy()
    expect($scrollspy instanceof $).toBe(true)
    expect($scrollspy[0]).toBe($el[0])
  })
  it.skip('should only switch "active" class on current target', () => new Promise(resolve => {
    expect.assertions(1)
    var sectionHTML = '<div id="root" class="active">' + '<div class="topbar">' + '<div class="topbar-inner">' + '<div class="container" id="ss-target">' + '<ul class="nav">' + '<li class="nav-item"><a href="#masthead">Overview</a></li>' + '<li class="nav-item"><a href="#detail">Detail</a></li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '<div id="scrollspy-example" style="height: 100px; overflow: auto;">' + '<div style="height: 200px;">' + '<h4 id="masthead">Overview</h4>' + '<p style="height: 200px">' + 'Ad leggings keytar, brunch id art party dolor labore.' + '</p>' + '</div>' + '<div style="height: 200px;">' + '<h4 id="detail">Detail</h4>' + '<p style="height: 200px">' + 'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.' + '</p>' + '</div>' + '</div>' + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')
    var $scrollspy = $section.show().find('#scrollspy-example').bootstrapScrollspy({
      target: '#ss-target'
    })
    $scrollspy.one('scroll', function () {
      expect($section.hasClass('active')).toBe(true)
      resolve()
    })
    $scrollspy.scrollTop(350)
  }))
  it.skip('should only switch "active" class on current target specified w element', () => new Promise(resolve => {
    expect.assertions(1)
    var sectionHTML = '<div id="root" class="active">' + '<div class="topbar">' + '<div class="topbar-inner">' + '<div class="container" id="ss-target">' + '<ul class="nav">' + '<li class="nav-item"><a href="#masthead">Overview</a></li>' + '<li class="nav-item"><a href="#detail">Detail</a></li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '<div id="scrollspy-example" style="height: 100px; overflow: auto;">' + '<div style="height: 200px;">' + '<h4 id="masthead">Overview</h4>' + '<p style="height: 200px">' + 'Ad leggings keytar, brunch id art party dolor labore.' + '</p>' + '</div>' + '<div style="height: 200px;">' + '<h4 id="detail">Detail</h4>' + '<p style="height: 200px">' + 'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.' + '</p>' + '</div>' + '</div>' + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')
    var $scrollspy = $section.show().find('#scrollspy-example').bootstrapScrollspy({
      target: document.getElementById('ss-target')
    })
    $scrollspy.one('scroll', function () {
      expect($section.hasClass('active')).toBe(true)
      resolve()
    })
    $scrollspy.scrollTop(350)
  }))
  it.skip('should only switch "active" class on current target specified w jQuery element', () => new Promise(resolve => {
    expect.assertions(1)
    var sectionHTML = '<div id="root" class="active">' + '<div class="topbar">' + '<div class="topbar-inner">' + '<div class="container" id="ss-target">' + '<ul class="nav">' + '<li class="nav-item"><a href="#masthead">Overview</a></li>' + '<li class="nav-item"><a href="#detail">Detail</a></li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '<div id="scrollspy-example" style="height: 100px; overflow: auto;">' + '<div style="height: 200px;">' + '<h4 id="masthead">Overview</h4>' + '<p style="height: 200px">' + 'Ad leggings keytar, brunch id art party dolor labore.' + '</p>' + '</div>' + '<div style="height: 200px;">' + '<h4 id="detail">Detail</h4>' + '<p style="height: 200px">' + 'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.' + '</p>' + '</div>' + '</div>' + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')
    var $scrollspy = $section.show().find('#scrollspy-example').bootstrapScrollspy({
      target: $('#ss-target')
    })
    $scrollspy.one('scroll', function () {
      expect($section.hasClass('active')).toBe(true)
      resolve()
    })
    $scrollspy.scrollTop(350)
  }))
  it.skip('should only switch "active" class on current target specified without ID', () => new Promise(resolve => {
    expect.assertions(2)
    var sectionHTML = '<div id="root" class="active">' + '<div class="topbar">' + '<div class="topbar-inner">' + '<div class="container">' + '<ul class="nav">' + '<li class="nav-item"><a href="#masthead">Overview</a></li>' + '<li class="nav-item"><a href="#detail">Detail</a></li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '<div id="scrollspy-example" style="height: 100px; overflow: auto;">' + '<div style="height: 200px;">' + '<h4 id="masthead">Overview</h4>' + '<p style="height: 200px">' + 'Ad leggings keytar, brunch id art party dolor labore.' + '</p>' + '</div>' + '<div style="height: 200px;">' + '<h4 id="detail">Detail</h4>' + '<p style="height: 200px">' + 'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.' + '</p>' + '</div>' + '</div>' + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')
    var $scrollspy = $section.show().find('#scrollspy-example').bootstrapScrollspy({
      target: $('.container')
    })
    expect($('.container').attr('id').length).not.toBe(0)
    $scrollspy.one('scroll', function () {
      expect($section.hasClass('active')).toBe(true)
      resolve()
    })
    $scrollspy.scrollTop(350)
  }))
  it.skip('should correctly select middle navigation option when large offset is used', () => new Promise(resolve => {
    expect.assertions(3)
    var sectionHTML = '<div id="header" style="height: 500px;"></div>' + '<nav id="navigation" class="navbar">' + '<ul class="navbar-nav">' + '<li class="nav-item active"><a class="nav-link" id="one-link" href="#one">One</a></li>' + '<li class="nav-item"><a class="nav-link" id="two-link" href="#two">Two</a></li>' + '<li class="nav-item"><a class="nav-link" id="three-link" href="#three">Three</a></li>' + '</ul>' + '</nav>' + '<div id="content" style="height: 200px; overflow-y: auto;">' + '<div id="one" style="height: 500px;"></div>' + '<div id="two" style="height: 300px;"></div>' + '<div id="three" style="height: 10px;"></div>' + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')
    var $scrollspy = $section.show().filter('#content')
    $scrollspy.bootstrapScrollspy({
      target: '#navigation',
      offset: $scrollspy.position().top
    })
    $scrollspy.one('scroll', function () {
      expect($section.find('#one-link').hasClass('active')).toBe(false)
      expect($section.find('#two-link').hasClass('active')).toBe(true)
      expect($section.find('#three-link').hasClass('active')).toBe(false)
      resolve()
    })
    $scrollspy.scrollTop(550)
  }))
  it.skip('should add the active class to the correct element', () => new Promise(resolve => {
    expect.assertions(2)
    var navbarHtml = '<nav class="navbar">' + '<ul class="nav">' + '<li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">div 1</a></li>' + '<li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">div 2</a></li>' + '</ul>' + '</nav>'
    var contentHtml = '<div class="content" style="overflow: auto; height: 50px">' + '<div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>' + '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' + '</div>'
    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml).appendTo('#qunit-fixture').bootstrapScrollspy({
      offset: 0,
      target: '.navbar'
    })
    var testElementIsActiveAfterScroll = function (element, target) {
      var deferred = $.Deferred()
      // add top padding to fix Chrome on Android failures
      var paddingTop = 5
      var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top) + paddingTop
      $content.one('scroll', function () {
        expect($(element).hasClass('active')).toBe(true)
        deferred.resolve()
      })
      $content.scrollTop(scrollHeight)
      return deferred.promise()
    }

    $.when(testElementIsActiveAfterScroll('#a-1', '#div-1')).then(function () {
      return testElementIsActiveAfterScroll('#a-2', '#div-2')
    }).then(function () {
      resolve()
    })
  }))
  it.skip('should add the active class to the correct element (nav markup)', () => new Promise(resolve => {
    expect.assertions(2)
    var navbarHtml = '<nav class="navbar">' + '<nav class="nav">' + '<a class="nav-link" id="a-1" href="#div-1">div 1</a>' + '<a class="nav-link" id="a-2" href="#div-2">div 2</a>' + '</nav>' + '</nav>'
    var contentHtml = '<div class="content" style="overflow: auto; height: 50px">' + '<div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>' + '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' + '</div>'
    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml).appendTo('#qunit-fixture').bootstrapScrollspy({
      offset: 0,
      target: '.navbar'
    })
    var testElementIsActiveAfterScroll = function (element, target) {
      var deferred = $.Deferred()
      // add top padding to fix Chrome on Android failures
      var paddingTop = 5
      var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top) + paddingTop
      $content.one('scroll', function () {
        expect($(element).hasClass('active')).toBe(true)
        deferred.resolve()
      })
      $content.scrollTop(scrollHeight)
      return deferred.promise()
    }

    $.when(testElementIsActiveAfterScroll('#a-1', '#div-1')).then(function () {
      return testElementIsActiveAfterScroll('#a-2', '#div-2')
    }).then(function () {
      resolve()
    })
  }))
  it.skip('should add the active class to the correct element (list-group markup)', () => new Promise(resolve => {
    expect.assertions(2)
    var navbarHtml = '<nav class="navbar">' + '<div class="list-group">' + '<a class="list-group-item" id="a-1" href="#div-1">div 1</a>' + '<a class="list-group-item" id="a-2" href="#div-2">div 2</a>' + '</div>' + '</nav>'
    var contentHtml = '<div class="content" style="overflow: auto; height: 50px">' + '<div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>' + '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' + '</div>'
    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml).appendTo('#qunit-fixture').bootstrapScrollspy({
      offset: 0,
      target: '.navbar'
    })
    var testElementIsActiveAfterScroll = function (element, target) {
      var deferred = $.Deferred()
      // add top padding to fix Chrome on Android failures
      var paddingTop = 5
      var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top) + paddingTop
      $content.one('scroll', function () {
        expect($(element).hasClass('active')).toBe(true)
        deferred.resolve()
      })
      $content.scrollTop(scrollHeight)
      return deferred.promise()
    }

    $.when(testElementIsActiveAfterScroll('#a-1', '#div-1')).then(function () {
      return testElementIsActiveAfterScroll('#a-2', '#div-2')
    }).then(function () {
      resolve()
    })
  }))
  it.skip('should add the active class correctly when there are nested elements at 0 scroll offset', () => new Promise(resolve => {
    expect.assertions(6)
    var times = 0
    var navbarHtml = '<nav id="navigation" class="navbar">' + '<ul class="nav">' + '<li class="nav-item"><a id="a-1" class="nav-link" href="#div-1">div 1</a>' + '<ul class="nav">' + '<li class="nav-item"><a id="a-2" class="nav-link" href="#div-2">div 2</a></li>' + '</ul>' + '</li>' + '</ul>' + '</nav>'
    var contentHtml = '<div class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">' + '<div id="div-1" style="padding: 0; margin: 0">' + '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' + '</div>' + '</div>'
    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml).appendTo('#qunit-fixture').bootstrapScrollspy({
      offset: 0,
      target: '#navigation'
    })
    function testActiveElements() {
      if (++times > 3) {
        return resolve()
      }

      $content.one('scroll', function () {
        expect($('#a-1').hasClass('active')).toBe(true)
        expect($('#a-2').hasClass('active')).toBe(true)
        testActiveElements()
      })
      $content.scrollTop($content.scrollTop() + 10)
    }

    testActiveElements()
  }))
  it.skip('should add the active class correctly when there are nested elements (nav markup)', () => new Promise(resolve => {
    expect.assertions(6)
    var times = 0
    var navbarHtml = '<nav id="navigation" class="navbar">' + '<nav class="nav">' + '<a id="a-1" class="nav-link" href="#div-1">div 1</a>' + '<nav class="nav">' + '<a id="a-2" class="nav-link" href="#div-2">div 2</a>' + '</nav>' + '</nav>' + '</nav>'
    var contentHtml = '<div class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">' + '<div id="div-1" style="padding: 0; margin: 0">' + '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' + '</div>' + '</div>'
    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml).appendTo('#qunit-fixture').bootstrapScrollspy({
      offset: 0,
      target: '#navigation'
    })
    function testActiveElements() {
      if (++times > 3) {
        return resolve()
      }

      $content.one('scroll', function () {
        expect($('#a-1').hasClass('active')).toBe(true)
        expect($('#a-2').hasClass('active')).toBe(true)
        testActiveElements()
      })
      $content.scrollTop($content.scrollTop() + 10)
    }

    testActiveElements()
  }))
  it.skip('should add the active class correctly when there are nested elements (nav nav-item markup)', () => new Promise(resolve => {
    expect.assertions(6)
    var times = 0
    var navbarHtml = '<nav id="navigation" class="navbar">' + '<ul class="nav">' + '<li class="nav-item"><a id="a-1" class="nav-link" href="#div-1">div 1</a></li>' + '<ul class="nav">' + '<li class="nav-item"><a id="a-2" class="nav-link" href="#div-2">div 2</a></li>' + '</ul>' + '</ul>' + '</nav>'
    var contentHtml = '<div class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">' + '<div id="div-1" style="padding: 0; margin: 0">' + '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' + '</div>' + '</div>'
    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml).appendTo('#qunit-fixture').bootstrapScrollspy({
      offset: 0,
      target: '#navigation'
    })
    function testActiveElements() {
      if (++times > 3) {
        return resolve()
      }

      $content.one('scroll', function () {
        expect($('#a-1').hasClass('active')).toBe(true)
        expect($('#a-2').hasClass('active')).toBe(true)
        testActiveElements()
      })
      $content.scrollTop($content.scrollTop() + 10)
    }

    testActiveElements()
  }))
  it.skip('should add the active class correctly when there are nested elements (list-group markup)', () => new Promise(resolve => {
    expect.assertions(6)
    var times = 0
    var navbarHtml = '<nav id="navigation" class="navbar">' + '<div class="list-group">' + '<a id="a-1" class="list-group-item" href="#div-1">div 1</a>' + '<div class="list-group">' + '<a id="a-2" class="list-group-item" href="#div-2">div 2</a>' + '</div>' + '</div>' + '</nav>'
    var contentHtml = '<div class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">' + '<div id="div-1" style="padding: 0; margin: 0">' + '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' + '</div>' + '</div>'
    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml).appendTo('#qunit-fixture').bootstrapScrollspy({
      offset: 0,
      target: '#navigation'
    })
    function testActiveElements() {
      if (++times > 3) {
        return resolve()
      }

      $content.one('scroll', function () {
        expect($('#a-1').hasClass('active')).toBe(true)
        expect($('#a-2').hasClass('active')).toBe(true)
        testActiveElements()
      })
      $content.scrollTop($content.scrollTop() + 10)
    }

    testActiveElements()
  }))
  it.skip('should clear selection if above the first section', () => new Promise(resolve => {
    expect.assertions(3)
    var sectionHTML = '<div id="header" style="height: 500px;"></div>' + '<nav id="navigation" class="navbar">' + '<ul class="navbar-nav">' + '<li class="nav-item"><a id="one-link"   class="nav-link active" href="#one">One</a></li>' + '<li class="nav-item"><a id="two-link"   class="nav-link" href="#two">Two</a></li>' + '<li class="nav-item"><a id="three-link" class="nav-link" href="#three">Three</a></li>' + '</ul>' + '</nav>'
    $(sectionHTML).appendTo('#qunit-fixture')
    var scrollspyHTML = '<div id="content" style="height: 200px; overflow-y: auto;">' + '<div id="spacer" style="height: 100px;"></div>' + '<div id="one" style="height: 100px;"></div>' + '<div id="two" style="height: 100px;"></div>' + '<div id="three" style="height: 100px;"></div>' + '<div id="spacer" style="height: 100px;"></div>' + '</div>'
    var $scrollspy = $(scrollspyHTML).appendTo('#qunit-fixture')
    $scrollspy.bootstrapScrollspy({
      target: '#navigation',
      offset: $scrollspy.position().top
    }).one('scroll', function () {
      expect($('.active').length).toBe(1)
      expect($('.active').is('#two-link')).toBe(true)
      $scrollspy.one('scroll', function () {
        expect($('.active').length).toBe(0)
        resolve()
      }).scrollTop(0)
    }).scrollTop(201)
  }))
  it.skip('should NOT clear selection if above the first section and first section is at the top', () => new Promise(resolve => {
    expect.assertions(4)
    var sectionHTML = '<div id="header" style="height: 500px;"></div>' + '<nav id="navigation" class="navbar">' + '<ul class="navbar-nav">' + '<li class="nav-item"><a id="one-link"   class="nav-link active" href="#one">One</a></li>' + '<li class="nav-item"><a id="two-link"   class="nav-link" href="#two">Two</a></li>' + '<li class="nav-item"><a id="three-link" class="nav-link" href="#three">Three</a></li>' + '</ul>' + '</nav>'
    $(sectionHTML).appendTo('#qunit-fixture')
    var negativeHeight = -10
    var startOfSectionTwo = 101
    var scrollspyHTML = '<div id="content" style="height: 200px; overflow-y: auto;">' + '<div id="one" style="height: 100px;"></div>' + '<div id="two" style="height: 100px;"></div>' + '<div id="three" style="height: 100px;"></div>' + '<div id="spacer" style="height: 100px;"></div>' + '</div>'
    var $scrollspy = $(scrollspyHTML).appendTo('#qunit-fixture')
    $scrollspy.bootstrapScrollspy({
      target: '#navigation',
      offset: $scrollspy.position().top
    }).one('scroll', function () {
      expect($('.active').length).toBe(1)
      expect($('.active').is('#two-link')).toBe(true)
      $scrollspy.one('scroll', function () {
        expect($('.active').length).toBe(1)
        expect($('.active').is('#one-link')).toBe(true)
        resolve()
      }).scrollTop(negativeHeight)
    }).scrollTop(startOfSectionTwo)
  }))
  it.skip('should correctly select navigation element on backward scrolling when each target section height is 100%', () => new Promise(resolve => {
    expect.assertions(5)
    var navbarHtml = '<nav class="navbar">' + '<ul class="nav">' + '<li class="nav-item"><a id="li-100-1" class="nav-link" href="#div-100-1">div 1</a></li>' + '<li class="nav-item"><a id="li-100-2" class="nav-link" href="#div-100-2">div 2</a></li>' + '<li class="nav-item"><a id="li-100-3" class="nav-link" href="#div-100-3">div 3</a></li>' + '<li class="nav-item"><a id="li-100-4" class="nav-link" href="#div-100-4">div 4</a></li>' + '<li class="nav-item"><a id="li-100-5" class="nav-link" href="#div-100-5">div 5</a></li>' + '</ul>' + '</nav>'
    var contentHtml = '<div class="content" style="position: relative; overflow: auto; height: 100px">' + '<div id="div-100-1" style="position: relative; height: 100%; padding: 0; margin: 0">div 1</div>' + '<div id="div-100-2" style="position: relative; height: 100%; padding: 0; margin: 0">div 2</div>' + '<div id="div-100-3" style="position: relative; height: 100%; padding: 0; margin: 0">div 3</div>' + '<div id="div-100-4" style="position: relative; height: 100%; padding: 0; margin: 0">div 4</div>' + '<div id="div-100-5" style="position: relative; height: 100%; padding: 0; margin: 0">div 5</div>' + '</div>'
    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml).appendTo('#qunit-fixture').bootstrapScrollspy({
      offset: 0,
      target: '.navbar'
    })
    var testElementIsActiveAfterScroll = function (element, target) {
      var deferred = $.Deferred()
      // add top padding to fix Chrome on Android failures
      var paddingTop = 5
      var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top) + paddingTop
      $content.one('scroll', function () {
        expect($(element).hasClass('active')).toBe(true)
        deferred.resolve()
      })
      $content.scrollTop(scrollHeight)
      return deferred.promise()
    }

    $.when(testElementIsActiveAfterScroll('#li-100-5', '#div-100-5')).then(function () {
      return testElementIsActiveAfterScroll('#li-100-4', '#div-100-4')
    }).then(function () {
      return testElementIsActiveAfterScroll('#li-100-3', '#div-100-3')
    }).then(function () {
      return testElementIsActiveAfterScroll('#li-100-2', '#div-100-2')
    }).then(function () {
      return testElementIsActiveAfterScroll('#li-100-1', '#div-100-1')
    }).then(function () {
      resolve()
    })
  }))
  it.skip('should allow passed in option offset method: offset', () => {
    expect.assertions(4)
    var testOffsetMethod = function (type) {
      var $navbar = $('<nav class="navbar"' + (type === 'data' ? ' id="navbar-offset-method-menu"' : '') + '>' + '<ul class="nav">' + '<li class="nav-item"><a id="li-' + type + 'm-1" class="nav-link" href="#div-' + type + 'm-1">div 1</a></li>' + '<li class="nav-item"><a id="li-' + type + 'm-2" class="nav-link" href="#div-' + type + 'm-2">div 2</a></li>' + '<li class="nav-item"><a id="li-' + type + 'm-3" class="nav-link" href="#div-' + type + 'm-3">div 3</a></li>' + '</ul>' + '</nav>')
      var $content = $('<div class="content"' + (type === 'data' ? ' data-spy="scroll" data-target="#navbar-offset-method-menu" data-offset="0" data-method="offset"' : '') + ' style="position: relative; overflow: auto; height: 100px">' + '<div id="div-' + type + 'm-1" style="position: relative; height: 200px; padding: 0; margin: 0">div 1</div>' + '<div id="div-' + type + 'm-2" style="position: relative; height: 150px; padding: 0; margin: 0">div 2</div>' + '<div id="div-' + type + 'm-3" style="position: relative; height: 250px; padding: 0; margin: 0">div 3</div>' + '</div>')
      $navbar.appendTo('#qunit-fixture')
      $content.appendTo('#qunit-fixture')
      if (type === 'js') {
        $content.bootstrapScrollspy({
          target: '.navbar',
          offset: 0,
          method: 'offset'
        })
      } else if (type === 'data') {
        $(globalThis).trigger('load')
      }

      var $target = $('#div-' + type + 'm-2')
      var scrollspy = $content.data('bs.scrollspy')
      expect(scrollspy._offsets[1]).toBe($target.offset().top)
      expect(scrollspy._offsets[1]).not.toBe($target.position().top)
      $navbar.remove()
      $content.remove()
    }

    testOffsetMethod('js')
    testOffsetMethod('data')
  })
  it.skip('should allow passed in option offset method: position', () => {
    expect.assertions(4)
    var testOffsetMethod = function (type) {
      var $navbar = $('<nav class="navbar"' + (type === 'data' ? ' id="navbar-offset-method-menu"' : '') + '>' + '<ul class="nav">' + '<li class="nav-item"><a class="nav-link" id="li-' + type + 'm-1" href="#div-' + type + 'm-1">div 1</a></li>' + '<li class="nav-item"><a class="nav-link" id="li-' + type + 'm-2" href="#div-' + type + 'm-2">div 2</a></li>' + '<li class="nav-item"><a class="nav-link" id="li-' + type + 'm-3" href="#div-' + type + 'm-3">div 3</a></li>' + '</ul>' + '</nav>')
      var $content = $('<div class="content"' + (type === 'data' ? ' data-spy="scroll" data-target="#navbar-offset-method-menu" data-offset="0" data-method="position"' : '') + ' style="position: relative; overflow: auto; height: 100px">' + '<div id="div-' + type + 'm-1" style="position: relative; height: 200px; padding: 0; margin: 0">div 1</div>' + '<div id="div-' + type + 'm-2" style="position: relative; height: 150px; padding: 0; margin: 0">div 2</div>' + '<div id="div-' + type + 'm-3" style="position: relative; height: 250px; padding: 0; margin: 0">div 3</div>' + '</div>')
      $navbar.appendTo('#qunit-fixture')
      $content.appendTo('#qunit-fixture')
      if (type === 'js') {
        $content.bootstrapScrollspy({
          target: '.navbar',
          offset: 0,
          method: 'position'
        })
      } else if (type === 'data') {
        $(globalThis).trigger('load')
      }

      var $target = $('#div-' + type + 'm-2')
      var scrollspy = $content.data('bs.scrollspy')
      expect(scrollspy._offsets[1]).not.toBe($target.offset().top)
      expect(scrollspy._offsets[1]).toBe($target.position().top)
      $navbar.remove()
      $content.remove()
    }

    testOffsetMethod('js')
    testOffsetMethod('data')
  })
  it.skip('should raise exception to avoid xss on target', () => {
    expect.assertions(1)
    expect(function () {
      var templateHTML = '<div id="root" class="active">' + '<div class="topbar">' + '<div class="topbar-inner">' + '<div class="container" id="ss-target">' + '<ul class="nav">' + '<li class="nav-item"><a href="#masthead">Overview</a></li>' + '<li class="nav-item"><a href="#detail">Detail</a></li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '<div id="scrollspy-example" style="height: 100px; overflow: auto;">' + '<div style="height: 200px;">' + '<h4 id="masthead">Overview</h4>' + '<p style="height: 200px">' + 'Ad leggings keytar, brunch id art party dolor labore.' + '</p>' + '</div>' + '<div style="height: 200px;">' + '<h4 id="detail">Detail</h4>' + '<p style="height: 200px">' + 'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.' + '</p>' + '</div>' + '</div>' + '</div>'
      $(templateHTML).appendTo(document.body)
      $('#ss-target').bootstrapScrollspy({
        target: '<img src=1 onerror=\'alert(0)\'>'
      })
    }).toThrow(/SyntaxError/)
  })
})
