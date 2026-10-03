import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Button from '../../js/src/button'

describe('button plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
        expect($(document.body).button).toBeTruthy()
  })
})

describe('button', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
          $.fn.bootstrapButton = $.fn.button.noConflict()
  })
  afterEach(() => {
    $.fn.button = $.fn.bootstrapButton
          delete $.fn.bootstrapButton
          clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
        expect(typeof $.fn.button).toBe('undefined')
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
        var $el = $('<div/>')
        var $button = $el.bootstrapButton()
        expect($button instanceof $).toBe(true)
        expect($button[0]).toBe($el[0])
  })
  it('should toggle active', () => {
    expect.assertions(2)
        var $btn = $('<button class="btn" data-toggle="button">mdo</button>')
        expect($btn.hasClass('active')).toBe(false)
        $btn.bootstrapButton('toggle')
        expect($btn.hasClass('active')).toBe(true)
  })
  it('should toggle active when btn children are clicked', () => {
    expect.assertions(2)
        var $btn = $('<button class="btn" data-toggle="button">mdo</button>')
        var $inner = $('<i/>')
        $btn
          .append($inner)
          .appendTo('#qunit-fixture')
        expect($btn.hasClass('active')).toBe(false)
        $inner.trigger('click')
        expect($btn.hasClass('active')).toBe(true)
  })
  it('should toggle aria-pressed', () => {
    expect.assertions(2)
        var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>')
        expect($btn.attr('aria-pressed')).toBe('false')
        $btn.bootstrapButton('toggle')
        expect($btn.attr('aria-pressed')).toBe('true')
  })
  it('should not toggle aria-pressed on buttons with disabled class', () => {
    expect.assertions(2)
        var $btn = $('<button class="btn disabled" data-toggle="button" aria-pressed="false">redux</button>')
        expect($btn.attr('aria-pressed')).toBe('false')
        $btn.bootstrapButton('toggle')
        expect($btn.attr('aria-pressed')).toBe('false')
  })
  it('should not toggle aria-pressed on buttons that are disabled', () => {
    expect.assertions(2)
        var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false" disabled>redux</button>')
        expect($btn.attr('aria-pressed')).toBe('false')
        $btn.bootstrapButton('toggle')
        expect($btn.attr('aria-pressed')).toBe('false')
  })
  it('should toggle aria-pressed on buttons with container', () => {
    expect.assertions(1)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
            '<button id="btn1" class="btn btn-secondary" type="button">One</button>' +
            '<button class="btn btn-secondary" type="button">Two</button>' +
          '</div>'
        $('#qunit-fixture').append(groupHTML)
        $('#btn1').bootstrapButton('toggle')
        expect($('#btn1').attr('aria-pressed')).toBe('true')
  })
  it('should toggle aria-pressed when btn children are clicked', () => {
    expect.assertions(2)
        var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>')
        var $inner = $('<i/>')
        $btn
          .append($inner)
          .appendTo('#qunit-fixture')
        expect($btn.attr('aria-pressed')).toBe('false')
        $inner.trigger('click')
        expect($btn.attr('aria-pressed')).toBe('true')
  })
  // UNABLE TO PARSE TEST ARGS: 'should assign active class on page load to buttons with aria-pressed="true"', f
  it('should assign active class on page load to button checkbox with checked attribute', done => {
    expect.assertions(1)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn btn-primary">' +
          '<input type="checkbox" id="radio" checked> Checkbox' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')
        var $btn = $group.children().eq(0)

        $(window).trigger($.Event('load'))
        setTimeout(function () {
          expect($btn.hasClass('active')).toBe(true)
          done()
        }, 5)
  })
  // UNABLE TO PARSE TEST ARGS: 'should remove active class on page load from buttons without aria-pressed="true
  it('should remove active class on page load from button checkbox without checked attribute', done => {
    expect.assertions(1)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn btn-primary active">' +
          '<input type="checkbox" id="radio"> Checkbox' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')
        var $btn = $group.children().eq(0)

        $(window).trigger($.Event('load'))
        setTimeout(function () {
          expect($btn.hasClass('active')).toBe(false)
          done()
        }, 5)
  })
  it('should trigger input change event when toggled button has input field', done => {
    expect.assertions(1)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn btn-primary">' +
          '<input type="radio" id="radio">Radio' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        $group.find('input').on('change', function (e) {
          e.preventDefault()
          expect(true).toBeTruthy()
          done()
        })

        $group.find('label').trigger('click')
  })
  it('should trigger label change event only once', done => {
    expect.assertions(1)
        var countChangeEvent = 0

        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn btn-primary">' +
          '<input type="checkbox"><span class="check">✓</span> <i class="far fa-clipboard"></i> <span class="d-none d-lg-inline">checkbox</span>' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $btn = $group.children().eq(0)

        $group.find('label').on('change', function () {
          countChangeEvent++
        })

        setTimeout(function () {
          expect(countChangeEvent).toBe(1)
          done()
        }, 5)

        $btn[0].click()
  })
  it('should check for closest matching toggle', () => {
    expect.assertions(18)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn btn-primary active">' +
          '<input type="radio" name="options" id="option1" checked="true"> Option 1' +
          '</label>' +
          '<label class="btn btn-primary">' +
          '<input type="radio" name="options" id="option2"> Option 2' +
          '</label>' +
          '<label class="btn btn-primary">' +
          '<input type="radio" name="options" id="option3"> Option 3' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $btn1 = $group.children().eq(0)
        var $btn2 = $group.children().eq(1)

        expect($btn1.hasClass('active')).toBe(true)
        expect($btn1.find('input').prop('checked')).toBe(true)
        expect($btn2.hasClass('active')).toBe(false)
        expect($btn2.find('input').prop('checked')).toBe(false)
        $btn2.find('input').trigger('click')
        expect($btn1.hasClass('active')).toBe(false)
        expect($btn1.find('input').prop('checked')).toBe(false)
        expect($btn2.hasClass('active')).toBe(true)
        expect($btn2.find('input').prop('checked')).toBe(true)

        $btn2.find('input').trigger('click') // Clicking an already checked radio should not un-check it
        expect($btn1.hasClass('active')).toBe(false)
        expect($btn1.find('input').prop('checked')).toBe(false)
        expect($btn2.hasClass('active')).toBe(true)
        expect($btn2.find('input').prop('checked')).toBe(true)
        $btn1.bootstrapButton('toggle')
        expect($btn1.hasClass('active')).toBe(true)
        expect($btn1.find('input').prop('checked')).toBe(true)
        expect($btn1.find('input')[0].checked).toBe(true)
        expect($btn2.hasClass('active')).toBe(false)
        expect($btn2.find('input').prop('checked')).toBe(false)
        expect($btn2.find('input')[0].checked).toBe(false)
  })
  it('should fire click event on input', done => {
    expect.assertions(1)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn btn-primary active">' +
          '<input type="checkbox" id="option1"> Option 1' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $btn = $group.children().eq(0)
        $group.find('input').on('click', function (e) {
          e.preventDefault()
          expect(true).toBeTruthy()
          done()
        })

        $btn[0].click()
  })
  it('should fire click event on label', done => {
    expect.assertions(1)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn btn-primary active">' +
          '<input type="checkbox" id="option1"> Option 1' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $btn = $group.children().eq(0)
        $group.find('label').on('click', function (e) {
          e.preventDefault()
          expect(true).toBeTruthy()
          done()
        })

        $btn[0].click()
  })
  // UNABLE TO PARSE TEST ARGS: 'should not add aria-pressed on labels for radio/checkbox inputs in a data-toggl
  it('should handle disabled attribute on non-button elements', () => {
    expect.assertions(4)
        var groupHTML = '<div class="btn-group disabled" data-toggle="buttons" aria-disabled="true" disabled>' +
          '<label class="btn btn-danger disabled">' +
          '<input type="checkbox" aria-disabled="true" disabled>' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $btn = $group.children().eq(0)
        var $input = $btn.children().eq(0)

        expect($btn.is(':not(.active)')).toBe(true)
        expect($input.prop('checked')).toBe(false)
        $btn[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
        expect($btn.is(':not(.active)')).toBe(true)
        expect($input.prop('checked')).toBe(false)
  })
  it('should not set active class if inner hidden checkbox is disabled but author forgot to set disabled class on outer button', () => {
    expect.assertions(4)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn btn-danger">' +
          '<input type="checkbox" disabled>' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $btn = $group.children().eq(0)
        var $input = $btn.children().eq(0)

        expect($btn.is(':not(.active)')).toBe(true)
        expect($input.prop('checked')).toBe(false)
        $btn[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
        expect($btn.is(':not(.active)')).toBe(true)
        expect($input.prop('checked')).toBe(false)
  })
  it('should correctly set checked state on input and active class on label when using <label><input></label> structure', () => {
    expect.assertions(4)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn">' +
          '<input type="checkbox">' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $label = $group.children().eq(0)
        var $input = $label.children().eq(0)

        expect($label.is(':not(.active)')).toBe(true)
        expect($input.prop('checked')).toBe(false)
        $label[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
        expect($label.is('.active')).toBe(true)
        expect($input.prop('checked')).toBe(true)
  })
  it('should correctly set checked state on input and active class on the faked button when using <div><input></div> structure', () => {
    expect.assertions(4)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<div class="btn">' +
          '<input type="checkbox" aria-label="Check">' +
          '</div>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $btn = $group.children().eq(0)
        var $input = $btn.children().eq(0)

        expect($btn.is(':not(.active)')).toBe(true)
        expect($input.prop('checked')).toBe(false)
        $btn[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
        expect($btn.is('.active')).toBe(true)
        expect($input.prop('checked')).toBe(true)
  })
  it('should correctly set checked state on input and active class on the label when using button toggle', () => {
    expect.assertions(6)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
            '<label class="btn">' +
              '<input type="checkbox">' +
            '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $btn = $group.children().eq(0)
        var $input = $btn.children().eq(0)

        expect($btn.is(':not(.active)')).toBe(true)
        expect($input.prop('checked')).toBe(false)
        expect($input[0].checked).toBe(false)
        $btn.bootstrapButton('toggle')
        expect($btn.is('.active')).toBe(true)
        expect($input.prop('checked')).toBe(true)
        expect($input[0].checked).toBe(true)
  })
  it('should not do anything if the click was just sent to the outer container with data-toggle', () => {
    expect.assertions(4)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn">' +
          '<input type="checkbox">' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $label = $group.children().eq(0)
        var $input = $label.children().eq(0)

        expect($label.is(':not(.active)')).toBe(true)
        expect($input.prop('checked')).toBe(false)
        $group[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
        expect($label.is(':not(.active)')).toBe(true)
        expect($input.prop('checked')).toBe(false)
  })
  // UNABLE TO PARSE TEST ARGS: 'should not try and set checked property on an input of type="hidden"', function
  it('should not try and set checked property on an input that is not a radio button or checkbox', () => {
    expect.assertions(2)
        var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn">' +
          '<input type="text">' +
          '</label>' +
          '</div>'
        var $group = $(groupHTML).appendTo('#qunit-fixture')

        var $label = $group.children().eq(0)
        var $input = $label.children().eq(0)

        expect($input.prop('checked')).toBe(false)
        $label[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
        expect($input.prop('checked')).toBe(false)
  })
  it('dispose should remove data and the element', () => {
    expect.assertions(2)

        var $el = $('<div/>')
        var $button = $el.bootstrapButton()

        expect(typeof $button.data('bs.button')).not.toBe('undefined')

        $button.data('bs.button').dispose()

        expect(typeof $button.data('bs.button')).toBe('undefined')
  })
  it('should return button version', () => {
    expect.assertions(1)

        expect(typeof Button.VERSION).toBe('string')
  })
})
