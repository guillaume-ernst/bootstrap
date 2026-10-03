import {
  describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi
} from 'vitest'
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
  it('should show a collapsed element', () => new Promise(resolve => {
    expect.assertions(2)
    var $el = $('<div class="collapse"/>')
    $el.one('shown.bs.collapse', function () {
      expect($el.hasClass('show')).toBe(true)
      expect(/height/i.test($el.attr('style'))).toBe(false)
      resolve()
    }).bootstrapCollapse('show')
  }))
  it('should show multiple collapsed elements', () => new Promise(resolve => {
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
      resolve()
    })
    $target.trigger('click')
  }))
  it('should collapse only the first collapse', () => new Promise(resolve => {
    expect.assertions(2)
    var html = ['<div class="panel-group" id="accordion1">', '<div class="panel">', '<div id="collapse1" class="collapse"/>', '</div>', '</div>', '<div class="panel-group" id="accordion2">', '<div class="panel">', '<div id="collapse2" class="collapse show"/>', '</div>', '</div>'].join('')
    $(html).appendTo('#qunit-fixture')
    var $el1 = $('#collapse1')
    var $el2 = $('#collapse2')
    $el1.one('shown.bs.collapse', function () {
      expect($el1.hasClass('show')).toBe(true)
      expect($el2.hasClass('show')).toBe(true)
      resolve()
    }).bootstrapCollapse('show')
  }))
  it('should hide a collapsed element', () => {
    expect.assertions(1)
    var $el = $('<div class="collapse"/>').bootstrapCollapse('hide')
    expect($el.hasClass('show')).toBe(false)
  })
  it('should not fire shown when show is prevented', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div class="collapse"/>').on('show.bs.collapse', function (e) {
      e.preventDefault()
      expect(true).toBeTruthy()
      resolve()
    }).on('shown.bs.collapse', function () {
      expect(false).toBeTruthy()
    }).bootstrapCollapse('show')
  }))
  it('should reset style to auto after finishing opening collapse', () => new Promise(resolve => {
    expect.assertions(2)
    $('<div class="collapse" style="height: 0px"/>').on('show.bs.collapse', function () {
      expect(this.style.height).toBe('0px')
    }).on('shown.bs.collapse', function () {
      expect(this.style.height).toBe('')
      resolve()
    }).bootstrapCollapse('show')
  }))
  it('should reset style to auto after finishing closing collapse', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div class="collapse"/>').on('shown.bs.collapse', function () {
      $(this).bootstrapCollapse('hide')
    }).on('hidden.bs.collapse', function () {
      expect(this.style.height).toBe('')
      resolve()
    }).bootstrapCollapse('show')
  }))
  it('should remove "collapsed" class from target when collapse is shown', () => new Promise(resolve => {
    expect.assertions(1)
    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')
    $('<div id="test1"/>').appendTo('#qunit-fixture').on('shown.bs.collapse', function () {
      expect($target.hasClass('collapsed')).toBe(false)
      resolve()
    })
    $target.trigger('click')
  }))
  it('should add "collapsed" class to target when collapse is hidden', () => new Promise(resolve => {
    expect.assertions(1)
    var $target = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    $('<div id="test1" class="show"/>').appendTo('#qunit-fixture').on('hidden.bs.collapse', function () {
      expect($target.hasClass('collapsed')).toBe(true)
      resolve()
    })
    $target.trigger('click')
  }))
  it('should remove "collapsed" class from all triggers targeting the collapse when the collapse is shown', () => new Promise(resolve => {
    expect.assertions(2)
    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')
    $('<div id="test1"/>').appendTo('#qunit-fixture').on('shown.bs.collapse', function () {
      expect($target.hasClass('collapsed')).toBe(false)
      expect($alt.hasClass('collapsed')).toBe(false)
      resolve()
    })
    $target.trigger('click')
  }))
  it('should add "collapsed" class to all triggers targeting the collapse when the collapse is hidden', () => new Promise(resolve => {
    expect.assertions(2)
    var $target = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    $('<div id="test1" class="show"/>').appendTo('#qunit-fixture').on('hidden.bs.collapse', function () {
      expect($target.hasClass('collapsed')).toBe(true)
      expect($alt.hasClass('collapsed')).toBe(true)
      resolve()
    })
    $target.trigger('click')
  }))
  it('should not close a collapse when initialized with "show" option if already shown', () => new Promise(resolve => {
    var $test = $('<div id="test1" class="show"/>').appendTo('#qunit-fixture').on('hide.bs.collapse', function () {
      expect(false).toBeTruthy()
    })
    $test.bootstrapCollapse('show')
    setTimeout(resolve, 0)
  }))
  it('should open a collapse when initialized with "show" option if not already shown', () => new Promise(resolve => {
    expect.assertions(1)
    var $test = $('<div id="test1" />').appendTo('#qunit-fixture').on('show.bs.collapse', function () {
      expect(true).toBeTruthy()
    })
    $test.bootstrapCollapse('show')
    setTimeout(resolve, 0)
  }))
  it('should not show a collapse when initialized with "hide" option if already hidden', () => new Promise(resolve => {
    $('<div class="collapse"></div>').appendTo('#qunit-fixture').on('show.bs.collapse', function () {
      expect(false).toBeTruthy()
    }).bootstrapCollapse('hide')
    setTimeout(resolve, 0)
  }))
  it('should hide a collapse when initialized with "hide" option if not already hidden', () => new Promise(resolve => {
    expect.assertions(1)
    $('<div class="collapse show"></div>').appendTo('#qunit-fixture').on('hide.bs.collapse', function () {
      expect(true).toBeTruthy()
    }).bootstrapCollapse('hide')
    setTimeout(resolve, 0)
  }))
  it('should remove "collapsed" class from active accordion target', () => new Promise(resolve => {
    expect.assertions(3)
    var accordionHTML = '<div id="accordion">' + '<div class="card"/>' + '<div class="card"/>' + '<div class="card"/>' + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')
    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1" />').appendTo($groups.eq(0))
    $('<div id="body1" class="show" data-parent="#accordion"/>').appendTo($groups.eq(0))
    var $target2 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body2" />').appendTo($groups.eq(1))
    $('<div id="body2" data-parent="#accordion"/>').appendTo($groups.eq(1))
    var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3" />').appendTo($groups.eq(2))
    $('<div id="body3" data-parent="#accordion"/>').appendTo($groups.eq(2)).on('shown.bs.collapse', function () {
      expect($target1.hasClass('collapsed')).toBe(true)
      expect($target2.hasClass('collapsed')).toBe(true)
      expect($target3.hasClass('collapsed')).toBe(false)
      resolve()
    })
    $target3.trigger('click')
  }))
  it('should allow dots in data-parent', () => new Promise(resolve => {
    expect.assertions(3)
    var accordionHTML = '<div class="accordion">' + '<div class="card"/>' + '<div class="card"/>' + '<div class="card"/>' + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')
    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1"/>').appendTo($groups.eq(0))
    $('<div id="body1" class="show" data-parent=".accordion"/>').appendTo($groups.eq(0))
    var $target2 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body2"/>').appendTo($groups.eq(1))
    $('<div id="body2" data-parent=".accordion"/>').appendTo($groups.eq(1))
    var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3"/>').appendTo($groups.eq(2))
    $('<div id="body3" data-parent=".accordion"/>').appendTo($groups.eq(2)).on('shown.bs.collapse', function () {
      expect($target1.hasClass('collapsed')).toBe(true)
      expect($target2.hasClass('collapsed')).toBe(true)
      expect($target3.hasClass('collapsed')).toBe(false)
      resolve()
    })
    $target3.trigger('click')
  }))
  it('should set aria-expanded="true" on trigger/control when collapse is shown', () => new Promise(resolve => {
    expect.assertions(1)
    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')
    $('<div id="test1"/>').appendTo('#qunit-fixture').on('shown.bs.collapse', function () {
      expect($target.attr('aria-expanded')).toBe('true')
      resolve()
    })
    $target.trigger('click')
  }))
  it('should set aria-expanded="false" on trigger/control when collapse is hidden', () => new Promise(resolve => {
    expect.assertions(1)
    var $target = $('<a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')
    $('<div id="test1" class="show"/>').appendTo('#qunit-fixture').on('hidden.bs.collapse', function () {
      expect($target.attr('aria-expanded')).toBe('false')
      resolve()
    })
    $target.trigger('click')
  }))
  it('should set aria-expanded="true" on all triggers targeting the collapse when the collapse is shown', () => new Promise(resolve => {
    expect.assertions(2)
    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')
    $('<div id="test1"/>').appendTo('#qunit-fixture').on('shown.bs.collapse', function () {
      expect($target.attr('aria-expanded')).toBe('true')
      expect($alt.attr('aria-expanded')).toBe('true')
      resolve()
    })
    $target.trigger('click')
  }))
  it('should set aria-expanded="false" on all triggers targeting the collapse when the collapse is hidden', () => new Promise(resolve => {
    expect.assertions(2)
    var $target = $('<a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')
    $('<div id="test1" class="show"/>').appendTo('#qunit-fixture').on('hidden.bs.collapse', function () {
      expect($target.attr('aria-expanded')).toBe('false')
      expect($alt.attr('aria-expanded')).toBe('false')
      resolve()
    })
    $target.trigger('click')
  }))
  it('should change aria-expanded from active accordion trigger/control to "false" and set the trigger/control for the newly active one to "true"', () => new Promise(resolve => {
    expect.assertions(3)
    var accordionHTML = '<div id="accordion">' + '<div class="card"/>' + '<div class="card"/>' + '<div class="card"/>' + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')
    var $target1 = $('<a role="button" data-toggle="collapse" aria-expanded="true" href="#body1"/>').appendTo($groups.eq(0))
    $('<div id="body1" class="show" data-parent="#accordion"/>').appendTo($groups.eq(0))
    var $target2 = $('<a role="button" data-toggle="collapse" aria-expanded="false" href="#body2" class="collapsed" aria-expanded="false" />').appendTo($groups.eq(1))
    $('<div id="body2" data-parent="#accordion"/>').appendTo($groups.eq(1))
    var $target3 = $('<a class="collapsed" data-toggle="collapse" aria-expanded="false" role="button" href="#body3"/>').appendTo($groups.eq(2))
    $('<div id="body3" data-parent="#accordion"/>').appendTo($groups.eq(2)).on('shown.bs.collapse', function () {
      expect($target1.attr('aria-expanded')).toBe('false')
      expect($target2.attr('aria-expanded')).toBe('false')
      expect($target3.attr('aria-expanded')).toBe('true')
      resolve()
    })
    $target3.trigger('click')
  }))
  it('should not fire show event if show is prevented because other element is still transitioning', () => new Promise(resolve => {
    expect.assertions(1)
    var accordionHTML = '<div id="accordion">' + '<div class="card"/>' + '<div class="card"/>' + '</div>'
    var showFired = false
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')
    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1"/>').appendTo($groups.eq(0))
    $('<div id="body1" class="collapse" data-parent="#accordion"/>').appendTo($groups.eq(0)).on('show.bs.collapse', function () {
      showFired = true
    })
    var $target2 = $('<a role="button" data-toggle="collapse" href="#body2"/>').appendTo($groups.eq(1))
    var $body2 = $('<div id="body2" class="collapse" data-parent="#accordion"/>').appendTo($groups.eq(1))
    $target2.trigger('click')
    $body2.toggleClass('show collapsing').data('bs.collapse')._isTransitioning = 1
    $target1.trigger('click')
    setTimeout(function () {
      expect(showFired).toBe(false)
      resolve()
    }, 1)
  }))
  it('should add "collapsed" class to target when collapse is hidden via manual invocation', () => new Promise(resolve => {
    expect.assertions(1)
    var $target = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    $('<div id="test1" class="show"/>').appendTo('#qunit-fixture').on('hidden.bs.collapse', function () {
      expect($target.hasClass('collapsed')).toBe(true)
      resolve()
    }).bootstrapCollapse('hide')
  }))
  it('should remove "collapsed" class from target when collapse is shown via manual invocation', () => new Promise(resolve => {
    expect.assertions(1)
    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')
    $('<div id="test1"/>').appendTo('#qunit-fixture').on('shown.bs.collapse', function () {
      expect($target.hasClass('collapsed')).toBe(false)
      resolve()
    }).bootstrapCollapse('show')
  }))
  it('should allow accordion to use children other than card', () => new Promise(resolve => {
    expect.assertions(4)
    var accordionHTML = '<div id="accordion">' + '<div class="item">' + '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' + '<div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></div>' + '</div>' + '<div class="item">' + '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' + '<div id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></div>' + '</div>' + '</div>'
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
        resolve()
      })
      $triggerTwo.trigger($.Event('click'))
    })
    $trigger.trigger($.Event('click'))
  }))
  it('should allow accordion to contain nested elements', () => new Promise(resolve => {
    expect.assertions(4)
    var accordionHTML = '<div id="accordion">' + '<div class="row">' + '<div class="col-lg-6">' + '<div class="item">' + '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' + '<div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></div>' + '</div>' + '</div>' + '<div class="col-lg-6">' + '<div class="item">' + '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' + '<div id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></div>' + '</div>' + '</div>' + '</div>' + '</div>'
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
        resolve()
      })
      $triggerTwo.trigger($.Event('click'))
    })
    $trigger.trigger($.Event('click'))
  }))
  it('should allow accordion to target multiple elements', () => new Promise(resolve => {
    expect.assertions(8)
    var accordionHTML = '<div id="accordion">' + '<a id="linkTriggerOne" data-toggle="collapse" data-target=".collapseOne" href="#" aria-expanded="false" aria-controls="collapseOne"></a>' + '<a id="linkTriggerTwo" data-toggle="collapse" data-target=".collapseTwo" href="#" aria-expanded="false" aria-controls="collapseTwo"></a>' + '<div id="collapseOneOne" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></div>' + '<div id="collapseOneTwo" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></div>' + '<div id="collapseTwoOne" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></div>' + '<div id="collapseTwoTwo" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></div>' + '</div>'
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
      resolve()
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
  }))
  it('should collapse accordion children but not nested accordion children', () => new Promise(resolve => {
    expect.assertions(9)
    $('<div id="accordion">' + '<div class="item">' + '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' + '<div id="collapseOne" data-parent="#accordion" class="collapse" role="tabpanel" aria-labelledby="headingThree">' + '<div id="nestedAccordion">' + '<div class="item">' + '<a id="nestedLinkTrigger" data-toggle="collapse" href="#nestedCollapseOne" aria-expanded="false" aria-controls="nestedCollapseOne"></a>' + '<div id="nestedCollapseOne" data-parent="#nestedAccordion" class="collapse" role="tabpanel" aria-labelledby="headingThree">' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '<div class="item">' + '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' + '<div id="collapseTwo" data-parent="#accordion" class="collapse show" role="tabpanel" aria-labelledby="headingTwo"></div>' + '</div>' + '</div>').appendTo('#qunit-fixture')
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
          resolve()
        })
        $triggerTwo.trigger($.Event('click'))
      })
      $nestedTrigger.trigger($.Event('click'))
    })
    $trigger.trigger($.Event('click'))
  }))
  it('should not prevent event for input', () => new Promise(resolve => {
    expect.assertions(3)
    var $target = $('<input type="checkbox" data-toggle="collapse" data-target="#collapsediv1" />').appendTo('#qunit-fixture')
    $('<div id="collapsediv1"/>').appendTo('#qunit-fixture').on('shown.bs.collapse', function () {
      expect($(this).hasClass('show')).toBe(true)
      expect($target.attr('aria-expanded')).toBe('true')
      expect($target.prop('checked')).toBe(true)
      resolve()
    })
    $target.trigger($.Event('click'))
  }))
  it('should add "collapsed" class to triggers only when all the targeted collapse are hidden', () => new Promise(resolve => {
    expect.assertions(9)
    var $trigger1 = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    var $trigger2 = $('<a role="button" data-toggle="collapse" href="#test2"/>').appendTo('#qunit-fixture')
    var $trigger3 = $('<a role="button" data-toggle="collapse" href=".multi"/>').appendTo('#qunit-fixture')
    var $target1 = $('<div id="test1" class="multi"/>').appendTo('#qunit-fixture')
    var $target2 = $('<div id="test2" class="multi"/>').appendTo('#qunit-fixture')
    $target2.one('shown.bs.collapse', function () {
      expect($trigger1.hasClass('collapsed')).toBe(false)
      expect($trigger2.hasClass('collapsed')).toBe(false)
      expect($trigger3.hasClass('collapsed')).toBe(false)
      $target2.one('hidden.bs.collapse', function () {
        expect($trigger1.hasClass('collapsed')).toBe(false)
        expect($trigger2.hasClass('collapsed')).toBe(true)
        expect($trigger3.hasClass('collapsed')).toBe(false)
        $target1.one('hidden.bs.collapse', function () {
          expect($trigger1.hasClass('collapsed')).toBe(true)
          expect($trigger2.hasClass('collapsed')).toBe(true)
          expect($trigger3.hasClass('collapsed')).toBe(true)
          resolve()
        })
        $trigger1.trigger('click')
      })
      $trigger2.trigger('click')
    })
    $trigger3.trigger('click')
  }))
  it('should set aria-expanded="true" to triggers targeting shown collapse and aria-expanded="false" only when all the targeted collapses are shown', () => new Promise(resolve => {
    expect.assertions(9)
    var $trigger1 = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    var $trigger2 = $('<a role="button" data-toggle="collapse" href="#test2"/>').appendTo('#qunit-fixture')
    var $trigger3 = $('<a role="button" data-toggle="collapse" href=".multi"/>').appendTo('#qunit-fixture')
    var $target1 = $('<div id="test1" class="multi collapse"/>').appendTo('#qunit-fixture')
    var $target2 = $('<div id="test2" class="multi collapse"/>').appendTo('#qunit-fixture')
    $target2.one('shown.bs.collapse', function () {
      expect($trigger1.attr('aria-expanded')).toBe('true')
      expect($trigger2.attr('aria-expanded')).toBe('true')
      expect($trigger3.attr('aria-expanded')).toBe('true')
      $target2.one('hidden.bs.collapse', function () {
        expect($trigger1.attr('aria-expanded')).toBe('true')
        expect($trigger2.attr('aria-expanded')).toBe('false')
        expect($trigger3.attr('aria-expanded')).toBe('true')
        $target1.one('hidden.bs.collapse', function () {
          expect($trigger1.attr('aria-expanded')).toBe('false')
          expect($trigger2.attr('aria-expanded')).toBe('false')
          expect($trigger3.attr('aria-expanded')).toBe('false')
          resolve()
        })
        $trigger1.trigger('click')
      })
      $trigger2.trigger('click')
    })
    $trigger3.trigger('click')
  }))
  it('should not prevent interactions inside the collapse element', () => new Promise(resolve => {
    expect.assertions(2)
    var $target = $('<input type="checkbox" data-toggle="collapse" data-target="#collapsediv1" />').appendTo('#qunit-fixture')
    var htmlCollapse = '<div id="collapsediv1" class="collapse">' + ' <input type="checkbox" id="testCheckbox" />' + '</div>'
    $(htmlCollapse).appendTo('#qunit-fixture').on('shown.bs.collapse', function () {
      expect($target.prop('checked')).toBe(true)
      var $testCheckbox = $('#testCheckbox')
      $testCheckbox.trigger($.Event('click'))
      setTimeout(function () {
        expect($testCheckbox.prop('checked')).toBe(true)
        resolve()
      }, 5)
    })
    $target.trigger($.Event('click'))
  }))
  it('should allow jquery object in parent config', () => {
    expect.assertions(1)
    var html = '<div class="my-collapse">' + '  <div class="item">' + '    <a data-toggle="collapse" href="#">Toggle item</a>' + '    <div class="collapse">Lorem ipsum</div>' + '  </div>' + '</div>'
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
    var html = '<div class="my-collapse">' + '  <div class="item">' + '    <a data-toggle="collapse" href="#">Toggle item</a>' + '    <div class="collapse">Lorem ipsum</div>' + '  </div>' + '</div>'
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
  it('should find collapse children if they have collapse class too not only data-parent', () => new Promise(resolve => {
    expect.assertions(2)
    var html = '<div class="my-collapse">' + '  <div class="item">' + '    <a data-toggle="collapse" href="#">Toggle item 1</a>' + '    <div id="collapse1" class="collapse show">Lorem ipsum 1</div>' + '  </div>' + '  <div class="item">' + '    <a id="triggerCollapse2" data-toggle="collapse" href="#">Toggle item 2</a>' + '    <div id="collapse2" class="collapse">Lorem ipsum 2</div>' + '  </div>' + '</div>'
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
      resolve()
    })
    $collapse2.bootstrapCollapse('toggle')
  }))
})
