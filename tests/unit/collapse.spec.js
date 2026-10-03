import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Collapse from '../../js/src/collapse'

describe('collapse plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
        expect($(document.body).collapse).toBeTruthy()
  })
})

describe('collapse', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
          $.fn.bootstrapCollapse = $.fn.collapse.noConflict()
  })
  afterEach(() => {
    $.fn.collapse = $.fn.bootstrapCollapse
          delete $.fn.bootstrapCollapse
          clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
        expect(typeof $.fn.collapse).toBe('undefined')
  })
  it('should throw explicit error on undefined method', () => {
    expect.assertions(1)
        var $el = $('<div/>')
        $el.bootstrapCollapse()
        try {
          $el.bootstrapCollapse('noMethod')
        } catch (error) {
          expect(error.message).toBe('No method named "noMethod"')
        }
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
        var $el = $('<div/>')
        var $collapse = $el.bootstrapCollapse()
        expect($collapse instanceof $).toBe(true)
        expect($collapse[0]).toBe($el[0])
  })
  it('should show a collapsed element', done => {
    expect.assertions(2)
        var $el = $('<div class="collapse"/>')

        $el.one('shown.bs.collapse', function () {
          expect($el.hasClass('show')).toBe(true)
          expect(/height/i.test($el.attr('style'))).toBe(false)
          done()
        }).bootstrapCollapse('show')
  })
  it('should show multiple collapsed elements', done => {
    expect.assertions(4)
        var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href=".multi"/>').appendTo('#qunit-fixture')
        var $el = $('<div class="collapse multi"/>').appendTo('#qunit-fixture')
        var $el2 = $('<div class="collapse multi"/>').appendTo('#qunit-fixture')
        $el.one('shown.bs.collapse', function () {
          expect($el.hasClass('show')).toBe(true)
          expect(/height/i.test($el.attr('style'))).toBe(false)
        })
        $el2.one('shown.bs.collapse', function () {
          expect($el2.hasClass('show')).toBe(true)
          expect(/height/i.test($el2.attr('style'))).toBe(false)
          done()
        })
        $target.trigger('click')
  })
  it('should collapse only the first collapse', done => {
    expect.assertions(2)
        var html = [
          '<div class="panel-group" id="accordion1">',
          '<div class="panel">',
          '<div id="collapse1" class="collapse"/>',
          '</div>',
          '</div>',
          '<div class="panel-group" id="accordion2">',
          '<div class="panel">',
          '<div id="collapse2" class="collapse show"/>',
          '</div>',
          '</div>'
        ].join('')
        $(html).appendTo('#qunit-fixture')
        var $el1 = $('#collapse1')
        var $el2 = $('#collapse2')
        $el1.one('shown.bs.collapse', function () {
          expect($el1.hasClass('show')).toBe(true)
          expect($el2.hasClass('show')).toBe(true)
          done()
        }).bootstrapCollapse('show')
  })
  it('should hide a collapsed element', () => {
    expect.assertions(1)
        var $el = $('<div class="collapse"/>').bootstrapCollapse('hide')

        expect($el.hasClass('show')).toBe(false)
  })
  it('should not fire shown when show is prevented', done => {
    expect.assertions(1)
        $('<div class="collapse"/>')
          .on('show.bs.collapse', function (e) {
            e.preventDefault()
            expect(true).toBeTruthy()
            done()
          })
          .on('shown.bs.collapse', function () {
            expect(false).toBeTruthy()
          })
          .bootstrapCollapse('show')
  })
  it('should reset style to auto after finishing opening collapse', done => {
    expect.assertions(2)
        $('<div class="collapse" style="height: 0px"/>')
          .on('show.bs.collapse', function () {
            expect(this.style.height).toBe('0px')
          })
          .on('shown.bs.collapse', function () {
            expect(this.style.height).toBe('')
            done()
          })
          .bootstrapCollapse('show')
  })
  it('should reset style to auto after finishing closing collapse', done => {
    expect.assertions(1)
        $('<div class="collapse"/>')
          .on('shown.bs.collapse', function () {
            $(this).bootstrapCollapse('hide')
          })
          .on('hidden.bs.collapse', function () {
            expect(this.style.height).toBe('')
            done()
          })
          .bootstrapCollapse('show')
  })
  // UNABLE TO PARSE TEST ARGS: 'should remove "collapsed" class from target when collapse is shown', function (
  // UNABLE TO PARSE TEST ARGS: 'should add "collapsed" class to target when collapse is hidden', function (asse
  // UNABLE TO PARSE TEST ARGS: 'should remove "collapsed" class from all triggers targeting the collapse when t
  // UNABLE TO PARSE TEST ARGS: 'should add "collapsed" class to all triggers targeting the collapse when the co
  // UNABLE TO PARSE TEST ARGS: 'should not close a collapse when initialized with "show" option if already show
  // UNABLE TO PARSE TEST ARGS: 'should open a collapse when initialized with "show" option if not already shown
  // UNABLE TO PARSE TEST ARGS: 'should not show a collapse when initialized with "hide" option if already hidde
  // UNABLE TO PARSE TEST ARGS: 'should hide a collapse when initialized with "hide" option if not already hidde
  // UNABLE TO PARSE TEST ARGS: 'should remove "collapsed" class from active accordion target', function (assert
  it('should allow dots in data-parent', done => {
    expect.assertions(3)
        var accordionHTML = '<div class="accordion">' +
            '<div class="card"/>' +
            '<div class="card"/>' +
            '<div class="card"/>' +
            '</div>'
        var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')

        var $target1 = $('<a role="button" data-toggle="collapse" href="#body1"/>').appendTo($groups.eq(0))

        $('<div id="body1" class="show" data-parent=".accordion"/>').appendTo($groups.eq(0))

        var $target2 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body2"/>').appendTo($groups.eq(1))

        $('<div id="body2" data-parent=".accordion"/>').appendTo($groups.eq(1))

        var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3"/>').appendTo($groups.eq(2))

        $('<div id="body3" data-parent=".accordion"/>')
          .appendTo($groups.eq(2))
          .on('shown.bs.collapse', function () {
            expect($target1.hasClass('collapsed')).toBe(true)
            expect($target2.hasClass('collapsed')).toBe(true)
            expect($target3.hasClass('collapsed')).toBe(false)

            done()
          })

        $target3.trigger('click')
  })
  // UNABLE TO PARSE TEST ARGS: 'should set aria-expanded="true" on trigger/control when collapse is shown', fun
  // UNABLE TO PARSE TEST ARGS: 'should set aria-expanded="false" on trigger/control when collapse is hidden', f
  // UNABLE TO PARSE TEST ARGS: 'should set aria-expanded="true" on all triggers targeting the collapse when the
  // UNABLE TO PARSE TEST ARGS: 'should set aria-expanded="false" on all triggers targeting the collapse when th
  // UNABLE TO PARSE TEST ARGS: 'should change aria-expanded from active accordion trigger/control to "false" an
  it('should not fire show event if show is prevented because other element is still transitioning', done => {
    expect.assertions(1)
        var accordionHTML = '<div id="accordion">' +
            '<div class="card"/>' +
            '<div class="card"/>' +
            '</div>'
        var showFired = false
        var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')

        var $target1 = $('<a role="button" data-toggle="collapse" href="#body1"/>').appendTo($groups.eq(0))

        $('<div id="body1" class="collapse" data-parent="#accordion"/>')
          .appendTo($groups.eq(0))
          .on('show.bs.collapse', function () {
            showFired = true
          })

        var $target2 = $('<a role="button" data-toggle="collapse" href="#body2"/>').appendTo($groups.eq(1))
        var $body2 = $('<div id="body2" class="collapse" data-parent="#accordion"/>').appendTo($groups.eq(1))

        $target2.trigger('click')

        $body2
          .toggleClass('show collapsing')
          .data('bs.collapse')._isTransitioning = 1

        $target1.trigger('click')

        setTimeout(function () {
          expect(showFired).toBe(false)
          done()
        }, 1)
  })
  // UNABLE TO PARSE TEST ARGS: 'should add "collapsed" class to target when collapse is hidden via manual invoc
  // UNABLE TO PARSE TEST ARGS: 'should remove "collapsed" class from target when collapse is shown via manual i
  it('should allow accordion to use children other than card', done => {
    expect.assertions(4)
        var accordionHTML = '<div id="accordion">' +
            '<div class="item">' +
            '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' +
            '<div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></div>' +
            '</div>' +
            '<div class="item">' +
            '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' +
            '<div id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></div>' +
            '</div>' +
            '</div>'

        $(accordionHTML).appendTo('#qunit-fixture')
        var $trigger = $('#linkTrigger')
        var $triggerTwo = $('#linkTriggerTwo')
        var $collapseOne = $('#collapseOne')
        var $collapseTwo = $('#collapseTwo')
        $collapseOne.on('shown.bs.collapse', function () {
          expect($collapseOne.hasClass('show')).toBe(true)
          expect($collapseTwo.hasClass('show')).toBe(false)
          $collapseTwo.on('shown.bs.collapse', function () {
            expect($collapseOne.hasClass('show')).toBe(false)
            expect($collapseTwo.hasClass('show')).toBe(true)
            done()
          })
          $triggerTwo.trigger($.Event('click'))
        })
        $trigger.trigger($.Event('click'))
  })
  it('should allow accordion to contain nested elements', done => {
    expect.assertions(4)
        var accordionHTML = '<div id="accordion">' +
            '<div class="row">' +
            '<div class="col-lg-6">' +
            '<div class="item">' +
            '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' +
            '<div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></div>' +
            '</div>' +
            '</div>' +
            '<div class="col-lg-6">' +
            '<div class="item">' +
            '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' +
            '<div id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'

        $(accordionHTML).appendTo('#qunit-fixture')
        var $trigger = $('#linkTrigger')
        var $triggerTwo = $('#linkTriggerTwo')
        var $collapseOne = $('#collapseOne')
        var $collapseTwo = $('#collapseTwo')
        $collapseOne.on('shown.bs.collapse', function () {
          expect($collapseOne.hasClass('show')).toBe(true)
          expect($collapseTwo.hasClass('show')).toBe(false)
          $collapseTwo.on('shown.bs.collapse', function () {
            expect($collapseOne.hasClass('show')).toBe(false)
            expect($collapseTwo.hasClass('show')).toBe(true)
            done()
          })
          $triggerTwo.trigger($.Event('click'))
        })
        $trigger.trigger($.Event('click'))
  })
  it('should allow accordion to target multiple elements', done => {
    expect.assertions(8)
        var accordionHTML = '<div id="accordion">' +
          '<a id="linkTriggerOne" data-toggle="collapse" data-target=".collapseOne" href="#" aria-expanded="false" aria-controls="collapseOne"></a>' +
          '<a id="linkTriggerTwo" data-toggle="collapse" data-target=".collapseTwo" href="#" aria-expanded="false" aria-controls="collapseTwo"></a>' +
          '<div id="collapseOneOne" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></div>' +
          '<div id="collapseOneTwo" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></div>' +
          '<div id="collapseTwoOne" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></div>' +
          '<div id="collapseTwoTwo" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></div>' +
          '</div>'

        $(accordionHTML).appendTo('#qunit-fixture')
        var $trigger = $('#linkTriggerOne')
        var $triggerTwo = $('#linkTriggerTwo')
        var $collapseOneOne = $('#collapseOneOne')
        var $collapseOneTwo = $('#collapseOneTwo')
        var $collapseTwoOne = $('#collapseTwoOne')
        var $collapseTwoTwo = $('#collapseTwoTwo')
        var collapsedElements = {
          one: false,
          two: false
        }

        function firstTest() {
          expect($collapseOneOne.hasClass('show')).toBe(true)
          expect($collapseOneTwo.hasClass('show')).toBe(true)
          expect($collapseTwoOne.hasClass('show')).toBe(false)
          expect($collapseTwoTwo.hasClass('show')).toBe(false)
          $triggerTwo.trigger($.Event('click'))
        }

        function secondTest() {
          expect($collapseOneOne.hasClass('show')).toBe(false)
          expect($collapseOneTwo.hasClass('show')).toBe(false)
          expect($collapseTwoOne.hasClass('show')).toBe(true)
          expect($collapseTwoTwo.hasClass('show')).toBe(true)
          done()
        }

        $collapseOneOne.on('shown.bs.collapse', function () {
          if (collapsedElements.one) {
            firstTest()
          } else {
            collapsedElements.one = true
          }
        })

        $collapseOneTwo.on('shown.bs.collapse', function () {
          if (collapsedElements.one) {
            firstTest()
          } else {
            collapsedElements.one = true
          }
        })

        $collapseTwoOne.on('shown.bs.collapse', function () {
          if (collapsedElements.two) {
            secondTest()
          } else {
            collapsedElements.two = true
          }
        })

        $collapseTwoTwo.on('shown.bs.collapse', function () {
          if (collapsedElements.two) {
            secondTest()
          } else {
            collapsedElements.two = true
          }
        })

        $trigger.trigger($.Event('click'))
  })
  it('should collapse accordion children but not nested accordion children', done => {
    expect.assertions(9)
        $('<div id="accordion">' +
            '<div class="item">' +
            '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' +
            '<div id="collapseOne" data-parent="#accordion" class="collapse" role="tabpanel" aria-labelledby="headingThree">' +
            '<div id="nestedAccordion">' +
            '<div class="item">' +
            '<a id="nestedLinkTrigger" data-toggle="collapse" href="#nestedCollapseOne" aria-expanded="false" aria-controls="nestedCollapseOne"></a>' +
            '<div id="nestedCollapseOne" data-parent="#nestedAccordion" class="collapse" role="tabpanel" aria-labelledby="headingThree">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="item">' +
            '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' +
            '<div id="collapseTwo" data-parent="#accordion" class="collapse show" role="tabpanel" aria-labelledby="headingTwo"></div>' +
            '</div>' +
            '</div>').appendTo('#qunit-fixture')
        var $trigger = $('#linkTrigger')
        var $triggerTwo = $('#linkTriggerTwo')
        var $nestedTrigger = $('#nestedLinkTrigger')
        var $collapseOne = $('#collapseOne')
        var $collapseTwo = $('#collapseTwo')
        var $nestedCollapseOne = $('#nestedCollapseOne')

        $collapseOne.one('shown.bs.collapse', function () {
          expect($collapseOne.hasClass('show')).toBe(true)
          expect($collapseTwo.hasClass('show')).toBe(false)
          expect($('#nestedCollapseOne').hasClass('show')).toBe(false)
          $nestedCollapseOne.one('shown.bs.collapse', function () {
            expect($collapseOne.hasClass('show')).toBe(true)
            expect($collapseTwo.hasClass('show')).toBe(false)
            expect($nestedCollapseOne.hasClass('show')).toBe(true)
            $collapseTwo.one('shown.bs.collapse', function () {
              expect($collapseOne.hasClass('show')).toBe(false)
              expect($collapseTwo.hasClass('show')).toBe(true)
              expect($nestedCollapseOne.hasClass('show')).toBe(true)
              done()
            })
            $triggerTwo.trigger($.Event('click'))
          })
          $nestedTrigger.trigger($.Event('click'))
        })
        $trigger.trigger($.Event('click'))
  })
  it('should not prevent event for input', done => {
    expect.assertions(3)
        var $target = $('<input type="checkbox" data-toggle="collapse" data-target="#collapsediv1" />').appendTo('#qunit-fixture')

        $('<div id="collapsediv1"/>')
          .appendTo('#qunit-fixture')
          .on('shown.bs.collapse', function () {
            expect($(this).hasClass('show')).toBe(true)
            expect($target.attr('aria-expanded')).toBe('true')
            expect($target.prop('checked')).toBe(true)
            done()
          })

        $target.trigger($.Event('click'))
  })
  // UNABLE TO PARSE TEST ARGS: 'should add "collapsed" class to triggers only when all the targeted collapse ar
  // UNABLE TO PARSE TEST ARGS: 'should set aria-expanded="true" to triggers targeting shown collapse and aria-e
  it('should not prevent interactions inside the collapse element', done => {
    expect.assertions(2)
        var $target = $('<input type="checkbox" data-toggle="collapse" data-target="#collapsediv1" />').appendTo('#qunit-fixture')
        var htmlCollapse =
          '<div id="collapsediv1" class="collapse">' +
          ' <input type="checkbox" id="testCheckbox" />' +
          '</div>'

        $(htmlCollapse)
          .appendTo('#qunit-fixture')
          .on('shown.bs.collapse', function () {
            expect($target.prop('checked')).toBe(true)
            var $testCheckbox = $('#testCheckbox')
            $testCheckbox.trigger($.Event('click'))
            setTimeout(function () {
              expect($testCheckbox.prop('checked')).toBe(true)
              done()
            }, 5)
          })

        $target.trigger($.Event('click'))
  })
  it('should allow jquery object in parent config', () => {
    expect.assertions(1)
        var html =
        '<div class="my-collapse">' +
        '  <div class="item">' +
        '    <a data-toggle="collapse" href="#">Toggle item</a>' +
        '    <div class="collapse">Lorem ipsum</div>' +
        '  </div>' +
        '</div>'

        $(html).appendTo('#qunit-fixture')
        try {
          $('[data-toggle="collapse"]').bootstrapCollapse({
            parent: $('.my-collapse')
          })
          expect(true).toBeTruthy()
        } catch (_) {
          expect(false).toBeTruthy()
        }
  })
  it('should allow DOM object in parent config', () => {
    expect.assertions(1)
        var html =
        '<div class="my-collapse">' +
        '  <div class="item">' +
        '    <a data-toggle="collapse" href="#">Toggle item</a>' +
        '    <div class="collapse">Lorem ipsum</div>' +
        '  </div>' +
        '</div>'

        $(html).appendTo('#qunit-fixture')
        try {
          $('[data-toggle="collapse"]').bootstrapCollapse({
            parent: $('.my-collapse')[0]
          })
          expect(true).toBeTruthy()
        } catch (_) {
          expect(false).toBeTruthy()
        }
  })
  it('should find collapse children if they have collapse class too not only data-parent', done => {
    expect.assertions(2)
        var html =
        '<div class="my-collapse">' +
        '  <div class="item">' +
        '    <a data-toggle="collapse" href="#">Toggle item 1</a>' +
        '    <div id="collapse1" class="collapse show">Lorem ipsum 1</div>' +
        '  </div>' +
        '  <div class="item">' +
        '    <a id="triggerCollapse2" data-toggle="collapse" href="#">Toggle item 2</a>' +
        '    <div id="collapse2" class="collapse">Lorem ipsum 2</div>' +
        '  </div>' +
        '</div>'

        $(html).appendTo('#qunit-fixture')

        var $parent = $('.my-collapse')
        var $collapse2 = $('#collapse2')
        $parent.find('.collapse').bootstrapCollapse({
          parent: $parent,
          toggle: false
        })

        $collapse2.on('shown.bs.collapse', function () {
          expect($collapse2.hasClass('show')).toBe(true)
          expect($('#collapse1').hasClass('show')).toBe(false)
          done()
        })

        $collapse2.bootstrapCollapse('toggle')
  })
})
