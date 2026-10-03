import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Dropdown from '../../js/src/dropdown'

describe('dropdowns plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
        expect($(document.body).dropdown).toBeTruthy()
  })
})

describe('dropdowns', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
          $.fn.bootstrapDropdown = $.fn.dropdown.noConflict()
  })
  afterEach(() => {
    $.fn.dropdown = $.fn.bootstrapDropdown
          delete $.fn.bootstrapDropdown
          clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
        expect(typeof $.fn.dropdown).toBe('undefined')
  })
  it('should throw explicit error on undefined method', () => {
    expect.assertions(1)
        var $el = $('<div/>')
        $el.bootstrapDropdown()
        try {
          $el.bootstrapDropdown('noMethod')
        } catch (error) {
          expect(error.message).toBe('No method named "noMethod"')
        }
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
        var $el = $('<div/>')
        var $dropdown = $el.bootstrapDropdown()
        expect($dropdown instanceof $).toBe(true)
        expect($dropdown[0]).toBe($el[0])
  })
  it('should not open dropdown if target is disabled via attribute', done => {
    expect.assertions(1)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        $(dropdownHTML).appendTo('#qunit-fixture')
        var $dropdown = $('#qunit-fixture').find('[data-toggle="dropdown"]').bootstrapDropdown()
        $dropdown.on('click', function () {
          expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
          done()
        })
        $dropdown.trigger($.Event('click'))
  })
  it('should not open dropdown if escape key was pressed on the toggle', done => {
    expect.assertions(1)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        $(dropdownHTML).appendTo('#qunit-fixture')
        var $dropdown = $('#qunit-fixture').find('[data-toggle="dropdown"]').bootstrapDropdown()
        var $button = $('button[data-toggle="dropdown"]')
        // Key escape
        $button.trigger('focus').trigger($.Event('keydown', {
          which: 27
        }))
        expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
        done()
  })
  it('should not add class position-static to dropdown if boundary not set', done => {
    expect.assertions(1)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').bootstrapDropdown()
        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect($dropdown.parent('.dropdown').hasClass('position-static')).toBe(false)
            done()
          })
        $dropdown.trigger('click')
  })
  it('should add class position-static to dropdown if boundary not scrollParent', done => {
    expect.assertions(1)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-boundary="viewport">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').bootstrapDropdown()
        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect($dropdown.parent('.dropdown').hasClass('position-static')).toBe(true)
            done()
          })
        $dropdown.trigger('click')
  })
  // UNABLE TO PARSE TEST ARGS: 'should set aria-expanded="true" on target when dropdown menu is shown', functio
  // UNABLE TO PARSE TEST ARGS: 'should set aria-expanded="false" on target when dropdown menu is hidden', funct
  it('should not open dropdown if target is disabled via class', done => {
    expect.assertions(1)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'

        $(dropdownHTML).appendTo('#qunit-fixture')
        var $dropdown = $('#qunit-fixture').find('[data-toggle="dropdown"]').bootstrapDropdown()
        $dropdown.on('click', function () {
          expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
          done()
        })
        $dropdown.trigger($.Event('click'))
  })
  it('should add class show to menu if clicked', done => {
    expect.assertions(1)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').bootstrapDropdown()
        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
            done()
          })
        $dropdown.trigger('click')
  })
  // UNABLE TO PARSE TEST ARGS: 'should remove "show" class if body is clicked', function (assert) {
    assert.
  // UNABLE TO PARSE TEST ARGS: 'should remove "show" class if tabbing outside of menu', function (assert) {
   
  // UNABLE TO PARSE TEST ARGS: 'should remove "show" class if body is clicked, with multiple dropdowns', functi
  // UNABLE TO PARSE TEST ARGS: 'should remove "show" class if body if tabbing outside of menu, with multiple dr
  it('should fire show and hide event', done => {
    expect.assertions(2)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        $dropdown
          .parent('.dropdown')
          .on('show.bs.dropdown', function () {
            expect(true).toBeTruthy()
          })
          .on('hide.bs.dropdown', function () {
            expect(true).toBeTruthy()
            done()
          })

        $dropdown.trigger('click')
        $(document.body).trigger('click')
  })
  it('should fire shown and hidden event', done => {
    expect.assertions(2)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect(true).toBeTruthy()
          })
          .on('hidden.bs.dropdown', function () {
            expect(true).toBeTruthy()
            done()
          })

        $dropdown.trigger('click')
        $(document.body).trigger('click')
  })
  it('should fire shown and hidden event with a relatedTarget', done => {
    expect.assertions(2)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()
        $dropdown.parent('.dropdown')
          .on('hidden.bs.dropdown', function (e) {
            expect(e.relatedTarget).toBe($dropdown[0])
            done()
          })
          .on('shown.bs.dropdown', function (e) {
            expect(e.relatedTarget).toBe($dropdown[0])
            $(document.body).trigger('click')
          })

        $dropdown.trigger('click')
  })
  it('should fire hide and hidden event with a clickEvent', () => {
    expect.assertions(3)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        $dropdown.parent('.dropdown')
          .on('hide.bs.dropdown', function (e) {
            expect(e.clickEvent).not.toBe('undefined')
          })
          .on('hidden.bs.dropdown', function (e) {
            expect(e.clickEvent).not.toBe('undefined')
          })
          .on('shown.bs.dropdown', function () {
            expect(true).toBeTruthy()
            $(document.body).trigger('click')
          })

        $dropdown.trigger('click')
  })
  it('should fire hide and hidden event without a clickEvent if event type is not click', () => {
    expect.assertions(3)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        $dropdown.parent('.dropdown')
          .on('hide.bs.dropdown', function (e) {
            expect(typeof e.clickEvent).toBe('undefined')
          })
          .on('hidden.bs.dropdown', function (e) {
            expect(typeof e.clickEvent).toBe('undefined')
          })
          .on('shown.bs.dropdown', function () {
            expect(true).toBeTruthy()
            $dropdown.trigger($.Event('keydown', {
              which: 27
            }))
          })

        $dropdown.trigger('click')
  })
  it('should ignore keyboard events within <input>s and <textarea>s', done => {
    expect.assertions(3)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '<input type="text" id="input">' +
            '<textarea id="textarea"/>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var $input = $('#input')
        var $textarea = $('#textarea')

        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect(true).toBeTruthy()

            $input.trigger('focus').trigger($.Event('keydown', {
              which: 38
            }))
            expect($(document.activeElement).is($input)).toBe(true)

            $textarea.trigger('focus').trigger($.Event('keydown', {
              which: 38
            }))
            expect($(document.activeElement).is($textarea)).toBe(true)

            done()
          })

        $dropdown.trigger('click')
  })
  it('should skip disabled element when using keyboard navigation', done => {
    expect.assertions(3)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item disabled" href="#">Disabled link</a>' +
            '<button class="dropdown-item" type="button" disabled>Disabled button</button>' +
            '<a id="item1" class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect(true).toBeTruthy()
            $dropdown.trigger($.Event('keydown', {
              which: 40
            }))
            $dropdown.trigger($.Event('keydown', {
              which: 40
            }))
            expect($(document.activeElement).is('.disabled')).toBe(false)
            expect($(document.activeElement).is(':disabled')).toBe(false)
            done()
          })
        $dropdown.trigger('click')
  })
  it('should focus next/previous element when using keyboard navigation', done => {
    expect.assertions(4)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a id="item1" class="dropdown-item" href="#">A link</a>' +
            '<a id="item2" class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect(true).toBeTruthy()
            $dropdown.trigger($.Event('keydown', {
              which: 40
            }))
            expect($(document.activeElement).is($('#item1'))).toBe(true)

            $(document.activeElement).trigger($.Event('keydown', {
              which: 40
            }))
            expect($(document.activeElement).is($('#item2'))).toBe(true)

            $(document.activeElement).trigger($.Event('keydown', {
              which: 38
            }))
            expect($(document.activeElement).is($('#item1'))).toBe(true)
            done()
          })
        $dropdown.trigger('click')
  })
  it('should not close the dropdown if the user clicks on a text field', done => {
    expect.assertions(2)
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" data-toggle="dropdown">Dropdown</button>' +
            '<div class="dropdown-menu">' +
            '<input id="textField" type="text" />' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var $textfield = $('#textField')
        $textfield.on('click', function () {
          expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
          done()
        })

        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
            $textfield.trigger($.Event('click'))
          })
        $dropdown.trigger('click')
  })
  it('should not close the dropdown if the user clicks on a textarea', done => {
    expect.assertions(2)
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" data-toggle="dropdown">Dropdown</button>' +
            '<div class="dropdown-menu">' +
            '<textarea id="textArea"></textarea>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var $textarea = $('#textArea')
        $textarea.on('click', function () {
          expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
          done()
        })

        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
            $textarea.trigger($.Event('click'))
          })
        $dropdown.trigger('click')
  })
  it('Dropdown should not use Popper in navbar', done => {
    expect.assertions(1)
        var html = '<nav class="navbar navbar-expand-md navbar-light bg-light">' +
            '<div class="dropdown">' +
            '  <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">Dropdown</a>' +
            '  <div class="dropdown-menu">' +
            '    <a class="dropdown-item" href="#">Action</a>' +
            '    <a class="dropdown-item" href="#">Another action</a>' +
            '    <a class="dropdown-item" href="#">Something else here</a>' +
            '  </div>' +
            '</div>' +
            '</nav>'

        $(html).appendTo('#qunit-fixture')
        var $triggerDropdown = $('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()
        var $dropdownMenu = $triggerDropdown.next()

        $triggerDropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            expect(typeof $dropdownMenu.attr('style')).toBe('undefined')
            done()
          })
        $triggerDropdown.trigger($.Event('click'))
  })
  it('should close dropdown and set focus back to toggle when escape is pressed while focused on a dropdown item', done => {
    expect.assertions(3)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" id="toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" id="item" href="#">Menu item</a>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var $item = $('#item')
        var $toggle = $('#toggle')

        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            // Forcibly focus first item
            $item[0].focus()
            expect($(document.activeElement)[0]).toBe($item[0])

            // Key escape
            $item.trigger('focus').trigger($.Event('keydown', {
              which: 27
            }))

            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
            expect($(document.activeElement)[0]).toBe($toggle[0])
            done()
          })

        $dropdown.trigger($.Event('click'))
  })
  it('should ignore keyboard events for <input>s and <textarea>s within dropdown-menu, except for escape key', done => {
    expect.assertions(7)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '<input type="text" id="input">' +
            '<textarea id="textarea"/>' +
            '</div>' +
            '</div>' +
            '</div>'
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var $input = $('#input')
        var $textarea = $('#textarea')

        $dropdown
          .parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            // Space key
            $input.trigger('focus').trigger($.Event('keydown', {
              which: 32
            }))
            expect($(document.activeElement)[0]).toBe($input[0])
            $textarea.trigger('focus').trigger($.Event('keydown', {
              which: 32
            }))
            expect($(document.activeElement)[0]).toBe($textarea[0])

            // Key up
            $input.trigger('focus').trigger($.Event('keydown', {
              which: 38
            }))
            expect($(document.activeElement)[0]).toBe($input[0])
            $textarea.trigger('focus').trigger($.Event('keydown', {
              which: 38
            }))
            expect($(document.activeElement)[0]).toBe($textarea[0])

            // Key down
            $input.trigger('focus').trigger($.Event('keydown', {
              which: 40
            }))
            expect($(document.activeElement)[0]).toBe($input[0])
            $textarea.trigger('focus').trigger($.Event('keydown', {
              which: 40
            }))
            expect($(document.activeElement)[0]).toBe($textarea[0])

            // Key escape
            $input.trigger('focus').trigger($.Event('keydown', {
              which: 27
            }))
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
            done()
          })

        $dropdown.trigger('click')
  })
  it('should ignore space key events for <input>s within dropdown, and accept up, down and escape', done => {
    expect.assertions(6)
        var dropdownHTML =
            '<ul class="nav tabs">' +
            '  <li class="dropdown">' +
            '    <input type="text" id="input" data-toggle="dropdown">' +
            '    <div class="dropdown-menu" role="menu">' +
            '      <a id="item1" class="dropdown-item" href="#">Secondary link</a>' +
            '      <a id="item2" class="dropdown-item" href="#">Something else here</a>' +
            '      <div class="divider"></div>' +
            '      <a class="dropdown-item" href="#">Another link</a>' +
            '    </div>' +
            '  </li>' +
            '</ul>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var $input = $('#input')

        $dropdown
          .parent('.dropdown')
          .one('shown.bs.dropdown', function () {
            expect(true).toBeTruthy()

            // Key space
            $input.trigger('focus').trigger($.Event('keydown', {
              which: 32
            }))
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
            expect($(document.activeElement).is($input)).toBe(true)

            // Key escape
            $input.trigger('focus').trigger($.Event('keydown', {
              which: 27
            }))
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)

            $dropdown
              .parent('.dropdown')
              .one('shown.bs.dropdown', function () {
                // Key down
                $input.trigger('focus').trigger($.Event('keydown', {
                  which: 40
                }))
                expect(document.activeElement).toBe($('#item1')[0])

                $dropdown
                  .parent('.dropdown')
                  .one('shown.bs.dropdown', function () {
                    // Key up
                    $input.trigger('focus').trigger($.Event('keydown', {
                      which: 38
                    }))
                    expect(document.activeElement).toBe($('#item1')[0])
                    done()
                  }).bootstrapDropdown('toggle')
                $input.trigger('click')
              })
            $input.trigger('click')
          })
        $input.trigger('click')
  })
  it('should ignore space key events for <textarea>s within dropdown, and accept up, down and escape', done => {
    expect.assertions(6)
        var dropdownHTML =
            '<ul class="nav tabs">' +
            '  <li class="dropdown">' +
            '    <textarea id="textarea" data-toggle="dropdown"></textarea>' +
            '    <div class="dropdown-menu" role="menu">' +
            '      <a id="item1" class="dropdown-item" href="#">Secondary link</a>' +
            '      <a id="item2" class="dropdown-item" href="#">Something else here</a>' +
            '      <div class="divider"></div>' +
            '      <a class="dropdown-item" href="#">Another link</a>' +
            '    </div>' +
            '  </li>' +
            '</ul>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var $textarea = $('#textarea')

        $dropdown
          .parent('.dropdown')
          .one('shown.bs.dropdown', function () {
            expect(true).toBeTruthy()

            // Key space
            $textarea.trigger('focus').trigger($.Event('keydown', {
              which: 32
            }))
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
            expect($(document.activeElement).is($textarea)).toBe(true)

            // Key escape
            $textarea.trigger('focus').trigger($.Event('keydown', {
              which: 27
            }))
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)

            $dropdown
              .parent('.dropdown')
              .one('shown.bs.dropdown', function () {
                // Key down
                $textarea.trigger('focus').trigger($.Event('keydown', {
                  which: 40
                }))
                expect(document.activeElement).toBe($('#item1')[0])

                $dropdown
                  .parent('.dropdown')
                  .one('shown.bs.dropdown', function () {
                    // Key up
                    $textarea.trigger('focus').trigger($.Event('keydown', {
                      which: 38
                    }))
                    expect(document.activeElement).toBe($('#item1')[0])
                    done()
                  }).bootstrapDropdown('toggle')
                $textarea.trigger('click')
              })
            $textarea.trigger('click')
          })
        $textarea.trigger('click')
  })
  it('should not stop key event propagation when dropdown is disabled', done => {
    expect.assertions(1)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" id="toggle" data-toggle="dropdown" disabled>Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" id="item" href="#">Menu item</a>' +
            '</div>' +
            '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var $body = $('body')

        $(document).on('keydown', function () {
          $body.addClass('event-handled')
        })

        // Key escape
        $dropdown.trigger('focus').trigger($.Event('keydown', {
          which: 27
        }))

        expect($body.hasClass('event-handled')).toBe(true)
        done()
  })
  it('should not stop ESC key event propagation when dropdown is not active', done => {
    expect.assertions(1)
        var dropdownHTML = '<div class="tabs">' +
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" id="toggle" data-toggle="dropdown">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" id="item" href="#">Menu item</a>' +
            '</div>' +
            '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var $body = $('body')

        $(document).on('keydown', function () {
          $body.addClass('event-handled')
        })

        // Key escape
        $dropdown.trigger('focus').trigger($.Event('keydown', {
          which: 27
        }))

        expect($body.hasClass('event-handled')).toBe(true)
        done()
  })
  it('should not use Popper if display set to static', done => {
    expect.assertions(1)
        var dropdownHTML =
            '<div class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-display="static">Dropdown</a>' +
            '<div class="dropdown-menu">' +
            '<a class="dropdown-item" href="#">Secondary link</a>' +
            '<a class="dropdown-item" href="#">Something else here</a>' +
            '<div class="divider"/>' +
            '<a class="dropdown-item" href="#">Another link</a>' +
            '</div>' +
            '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()
        var dropdownMenu = $dropdown.next()[0]

        $dropdown.parent('.dropdown')
          .on('shown.bs.dropdown', function () {
            // Popper adds this attribute when we use it
            expect(dropdownMenu.getAttribute('x-placement')).toBe(null)
            done()
          })

        $dropdown.trigger('click')
  })
  it('should call Popper and detect navbar on update', () => {
    expect.assertions(3)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')
        dropdown.toggle()
        expect(dropdown._popper).not.toBe(null)

        var spyPopper = sinon.spy(dropdown._popper, 'scheduleUpdate')
        var spyDetectNavbar = sinon.spy(dropdown, '_detectNavbar')
        dropdown.update()

        expect(spyPopper.called).toBe(true)
        expect(spyDetectNavbar.called).toBe(true)
  })
  it('should just detect navbar on update', () => {
    expect.assertions(2)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')
        var spyDetectNavbar = sinon.spy(dropdown, '_detectNavbar')

        dropdown.update()

        expect(dropdown._popper).toBe(null)
        expect(spyDetectNavbar.called).toBe(true)
  })
  it('should dispose dropdown with Popper', () => {
    expect.assertions(6)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')
        dropdown.toggle()

        expect(dropdown._popper).not.toBe(null)
        expect(dropdown._menu).not.toBe(null)
        expect(dropdown._element).not.toBe(null)
        var spyDestroy = sinon.spy(dropdown._popper, 'destroy')

        dropdown.dispose()

        expect(spyDestroy.called).toBe(true)
        expect(dropdown._menu).toBe(null)
        expect(dropdown._element).toBe(null)
  })
  it('should dispose dropdown', () => {
    expect.assertions(5)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')

        expect(dropdown._popper).toBe(null)
        expect(dropdown._menu).not.toBe(null)
        expect(dropdown._element).not.toBe(null)

        dropdown.dispose()

        expect(dropdown._menu).toBe(null)
        expect(dropdown._element).toBe(null)
  })
  it('should show dropdown', done => {
    expect.assertions(3)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')
        $dropdown
          .parent('.dropdown')
          .on('show.bs.dropdown', function () {
            expect(dropdown._popper).toBe(null)
            expect(true).toBeTruthy()
          })
          .on('shown.bs.dropdown', function () {
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
            done()
          })

        dropdown.show()
  })
  it('should hide dropdown', done => {
    expect.assertions(2)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')
        $dropdown.trigger('click')

        $dropdown
          .parent('.dropdown')
          .on('hide.bs.dropdown', function () {
            expect(true).toBeTruthy()
          })
          .on('hidden.bs.dropdown', function () {
            expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
            done()
          })

        dropdown.hide()
  })
  it('should not hide dropdown', () => {
    expect.assertions(1)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')
        $dropdown.trigger('click')
        dropdown.show()

        expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
  })
  it('should not show dropdown', () => {
    expect.assertions(1)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')
        dropdown.hide()
        expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
  })
  it('should prevent default event on show method call', done => {
    expect.assertions(1)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')
        $dropdown
          .parent('.dropdown')
          .on('show.bs.dropdown', function (event) {
            event.preventDefault()
            done()
          })

        dropdown.show()
        expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
  })
  it('should prevent default event on hide method call', done => {
    expect.assertions(1)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        var dropdown = $dropdown.data('bs.dropdown')
        $dropdown.trigger('click')

        $dropdown
          .parent('.dropdown')
          .on('hide.bs.dropdown', function (event) {
            event.preventDefault()
            done()
          })

        dropdown.hide()
        expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
  })
  it('should not open dropdown via show method if target is disabled via attribute', () => {
    expect.assertions(1)
        var dropdownHTML =
            '<div class="dropdown">' +
            '  <button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>' +
            '  <div class="dropdown-menu">' +
            '    <a class="dropdown-item" href="#">Another link</a>' +
            '  </div>' +
            '</div>'
        $(dropdownHTML).appendTo('#qunit-fixture')
        var $dropdown = $('#qunit-fixture').find('[data-toggle="dropdown"]').bootstrapDropdown()
        $dropdown.show()
        expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
  })
  it('should not open dropdown via show method if target is disabled via class', () => {
    expect.assertions(1)
        var dropdownHTML =
            '<div class="dropdown">' +
            '  <button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>' +
            '  <div class="dropdown-menu">' +
            '    <a class="dropdown-item" href="#">Another link</a>' +
            '  </div>' +
            '</div>'

        $(dropdownHTML).appendTo('#qunit-fixture')
        var $dropdown = $('#qunit-fixture').find('[data-toggle="dropdown"]').bootstrapDropdown()
        $dropdown.show()
        expect($dropdown.parent('.dropdown').hasClass('show')).toBe(false)
  })
  it('should not hide dropdown via hide method if target is disabled via attribute', () => {
    expect.assertions(1)
        var dropdownHTML =
            '<div class="dropdown show">' +
            '  <button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>' +
            '  <div class="dropdown-menu">' +
            '    <a class="dropdown-item" href="#">Another link</a>' +
            '  </div>' +
            '</div>'
        $(dropdownHTML).appendTo('#qunit-fixture')
        var $dropdown = $('#qunit-fixture').find('[data-toggle="dropdown"]').bootstrapDropdown()
        $dropdown.hide()
        expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
  })
  it('should not hide dropdown via hide method if target is disabled via class', () => {
    expect.assertions(1)
        var dropdownHTML =
            '<div class="dropdown show">' +
            '  <button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>' +
            '  <div class="dropdown-menu">' +
            '    <a class="dropdown-item" href="#">Another link</a>' +
            '  </div>' +
            '</div>'

        $(dropdownHTML).appendTo('#qunit-fixture')
        var $dropdown = $('#qunit-fixture').find('[data-toggle="dropdown"]').bootstrapDropdown()
        $dropdown.hide()
        expect($dropdown.parent('.dropdown').hasClass('show')).toBe(true)
  })
  it('should create offset modifier correctly when offset option is a function', () => {
    expect.assertions(2)

        var getOffset = function (offsets) {
          return offsets
        }

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown({
            offset: getOffset
          })

        var dropdown = $dropdown.data('bs.dropdown')
        var offset = dropdown._getOffset()

        expect(typeof offset.offset).toBe('undefined')
        expect(typeof offset.fn).toBe('function')
  })
  it('should create offset modifier correctly when offset option is not a function', () => {
    expect.assertions(2)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var myOffset = 42
        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown({
            offset: myOffset
          })

        var dropdown = $dropdown.data('bs.dropdown')
        var offset = dropdown._getOffset()

        expect(offset.offset).toBe(myOffset)
        expect(typeof offset.fn).toBe('undefined')
  })
  it('should allow to pass config to Popper with `popperConfig`', () => {
    expect.assertions(1)

        var dropdownHTML =
          '<div class="dropdown">' +
          '  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
          '  <div class="dropdown-menu">' +
          '    <a class="dropdown-item" href="#">Another link</a>' +
          '  </div>' +
          '</div>'

        var $dropdown = $(dropdownHTML)
          .appendTo('#qunit-fixture')
          .find('[data-toggle="dropdown"]')
          .bootstrapDropdown({
            popperConfig: {
              placement: 'left'
            }
          })

        var dropdown = $dropdown.data('bs.dropdown')
        var popperConfig = dropdown._getPopperConfig()

        expect(popperConfig.placement).toBe('left')
  })
  it('should destroy old popper references on toggle', done => {
    expect.assertions(3)
        var fixtureHtml = [
          '<div class="first dropdown">',
          '  <button href="#" class="firstBtn btn" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>',
          '<div class="second dropdown">',
          '  <button href="#" class="secondBtn btn" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        $(fixtureHtml).appendTo('#qunit-fixture')

        var $btnDropdown1 = $('.firstBtn').bootstrapDropdown()
        var $btnDropdown2 = $('.secondBtn').bootstrapDropdown()
        var $firstDropdownEl = $('.first')
        var $secondDropdownEl = $('.second')
        var dropdown1 = $btnDropdown1.data('bs.dropdown')
        var dropdown2 = $btnDropdown2.data('bs.dropdown')
        var spyPopper

        $firstDropdownEl.one('shown.bs.dropdown', function () {
          expect($firstDropdownEl.hasClass('show')).toBe(true)
          spyPopper = sinon.spy(dropdown1._popper, 'destroy')
          dropdown2.toggle()
        })

        $secondDropdownEl.one('shown.bs.dropdown', function () {
          expect($secondDropdownEl.hasClass('show')).toBe(true)
          expect(spyPopper.called).toBe(true)
          done()
        })

        dropdown1.toggle()
  })
  it('should hide a dropdown and destroy popper', done => {
    expect.assertions(1)
        var fixtureHtml = [
          '<div class="dropdown">',
          '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        $(fixtureHtml).appendTo('#qunit-fixture')

        var $dropdownEl = $('.dropdown')
        var dropdown = $('[data-toggle="dropdown"]')
          .bootstrapDropdown()
          .data('bs.dropdown')
        var spyPopper

        $dropdownEl.one('shown.bs.dropdown', function () {
          spyPopper = sinon.spy(dropdown._popper, 'destroy')
          dropdown.hide()
        })

        $dropdownEl.one('hidden.bs.dropdown', function () {
          expect(spyPopper.called).toBe(true)
          done()
        })

        dropdown.show(true)
  })
  it('it should skip hidden element when using keyboard navigation', done => {
    expect.assertions(3)
        var fixtureHtml = [
          '<style>',
          '  .d-none {',
          '    display: none;',
          '  }',
          '</style>',
          '<div class="dropdown">',
          '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <button class="dropdown-item d-none" type="button">Hidden button by class</button>',
          '    <a class="dropdown-item" href="#sub1" style="display: none">Hidden link</a>',
          '    <a class="dropdown-item" href="#sub1" style="visibility: hidden">Hidden link</a>',
          '    <a id="item1" class="dropdown-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        $(fixtureHtml).appendTo('#qunit-fixture')

        var $dropdownEl = $('.dropdown')
        var $dropdown = $('[data-toggle="dropdown"]')
          .bootstrapDropdown()

        $dropdownEl.one('shown.bs.dropdown', function () {
          $dropdown.trigger($.Event('keydown', {
            which: 40
          }))

          expect($(document.activeElement).hasClass('d-none')).toBe(false)
          expect($(document.activeElement).css('display')).not.toBe('none')
          expect(document.activeElement.style.visibility).not.toBe('hidden')
          done()
        })

        $dropdown.trigger('click')
  })
})
