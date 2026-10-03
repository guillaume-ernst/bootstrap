import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Tab from '../../js/src/tab'

describe('tabs plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
        expect($(document.body).tab).toBeTruthy()
  })
})

describe('tabs', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
          $.fn.bootstrapTab = $.fn.tab.noConflict()
  })
  afterEach(() => {
    $.fn.tab = $.fn.bootstrapTab
          delete $.fn.bootstrapTab
          clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
        expect(typeof $.fn.tab).toBe('undefined')
  })
  it('should throw explicit error on undefined method', () => {
    expect.assertions(1)
        var $el = $('<div/>')
        $el.bootstrapTab()
        try {
          $el.bootstrapTab('noMethod')
        } catch (error) {
          expect(error.message).toBe('No method named "noMethod"')
        }
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
        var $el = $('<div/>')
        var $tab = $el.bootstrapTab()
        expect($tab instanceof $).toBe(true)
        expect($tab[0]).toBe($el[0])
  })
  it('should activate element by tab id (using buttons, the preferred semantic way)', () => {
    expect.assertions(2)
        var tabsHTML = '<ul class="nav" role="tablist">' +
            '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
            '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
            '</ul>'

        $('<ul><li id="home" role="tabpanel"></li><li id="profile" role="tabpanel"></li></ul>').appendTo('#qunit-fixture')

        $(tabsHTML).find('li:last-child button').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('profile')

        $(tabsHTML).find('li:first-child button').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('home')
  })
  it('should activate element by tab id (using links for tabs - not ideal, but still supported)', () => {
    expect.assertions(2)
        var tabsHTML = '<ul class="nav" role="tablist">' +
            '<li><a href="#home" role="tab">Home</a></li>' +
            '<li><a href="#profile" role="tab">Profile</a></li>' +
            '</ul>'

        $('<ul><li id="home" role="tabpanel"/><li id="profile" role="tabpanel"/></ul>').appendTo('#qunit-fixture')

        $(tabsHTML).find('li:last-child a').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('profile')

        $(tabsHTML).find('li:first-child a').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('home')
  })
  it('should activate element by tab id (.nav-pills)', () => {
    expect.assertions(2)
        var pillsHTML = '<ul class="nav nav-pills" role="tablist">' +
            '<li><a href="#home">Home</a></li>' +
            '<li><a href="#profile">Profile</a></li>' +
            '</ul>'

        $('<ul><li id="home"/><li id="profile"/></ul>').appendTo('#qunit-fixture')

        $(pillsHTML).find('li:last-child a').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('profile')

        $(pillsHTML).find('li:first-child a').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('home')
  })
  it('should activate element by tab id in ordered list', () => {
    expect.assertions(2)
        var pillsHTML = '<ol class="nav nav-pills" role="tablist">' +
            '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
            '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
            '</ol>'

        $('<ol><li id="home" role="tabpanel"/><li id="profile" role="tabpanel"/></ol>').appendTo('#qunit-fixture')

        $(pillsHTML).find('li:last-child button').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('profile')

        $(pillsHTML).find('li:first-child button').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('home')
  })
  it('should activate element by tab id in nav list', () => {
    expect.assertions(2)
        var tabsHTML = '<nav class="nav">' +
                          '<button type="button" data-target="#home" role="tab">Home</button>' +
                          '<button type="button" data-target="#profile" role="tab">Profile</button>' +
                        '</nav>'

        $('<div><div id="home" role="tabpanel"/><div id="profile" role="tabpanel"/></div>').appendTo('#qunit-fixture')

        $(tabsHTML).find('button:last-child').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('profile')

        $(tabsHTML).find('button:first-child').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('home')
  })
  it('should activate element by tab id in list group', () => {
    expect.assertions(2)
        var tabsHTML = '<div class="list-group" role="tablist">' +
                          '<button type="button" data-target="#home" role="tab">Home</button>' +
                          '<button type="button" data-target="#profile" role="tab">Profile</button>' +
                        '</div>'

        $('<div><div id="home" role="tabpanel"/><div id="profile" role="tabpanel"/></div>').appendTo('#qunit-fixture')

        $(tabsHTML).find('button:last-child').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('profile')

        $(tabsHTML).find('button:first-child').bootstrapTab('show')
        expect($('#qunit-fixture').find('.active').attr('id')).toBe('home')
  })
  it('should not fire shown when show is prevented', done => {
    expect.assertions(1)
        $('<div class="nav"/>')
          .on('show.bs.tab', function (e) {
            e.preventDefault()
            expect(true).toBeTruthy()
            done()
          })
          .on('shown.bs.tab', function () {
            expect(false).toBeTruthy()
          })
          .bootstrapTab('show')
  })
  it('should not fire shown when tab is already active', () => {
    expect.assertions(0)
        var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
          '<li class="nav-item" role="presentation"><button type="button" data-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>' +
          '<li class="nav-item" role="presentation"><button type="button" data-target="#profile" class="nav-link" role="tab">Profile</button></li>' +
          '</ul>' +
          '<div class="tab-content">' +
          '<div class="tab-pane active" id="home" role="tabpanel"></div>' +
          '<div class="tab-pane" id="profile" role="tabpanel"></div>' +
          '</div>'

        $(tabsHTML)
          .find('button.active')
          .on('shown.bs.tab', function () {
            expect(true).toBeTruthy()
          })
          .bootstrapTab('show')
  })
  it('should not fire shown when tab is disabled', () => {
    expect.assertions(0)
        var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
          '<li class="nav-item"><button type="button" data-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>' +
          '<li class="nav-item"><button type="button" data-target="#profile" class="nav-link" disabled role="tab">Profile</button></li>' +
          '</ul>' +
          '<div class="tab-content">' +
          '<div class="tab-pane active" id="home" role="tabpanel"></div>' +
          '<div class="tab-pane" id="profile" role="tabpanel"></div>' +
          '</div>'

        $(tabsHTML)
          .find('button[disabled]')
          .on('shown.bs.tab', function () {
            expect(true).toBeTruthy()
          })
          .bootstrapTab('show')
  })
  it('show and shown events should reference correct relatedTarget', done => {
    expect.assertions(2)
        var tabsHTML =
            '<ul class="nav nav-tabs" role="tablist">' +
            '  <li class="nav-item" role="presentation"><button type="button" data-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>' +
            '  <li class="nav-item" role="presentation"><button type="button" data-target="#profile" class="nav-link" role="tab" aria-selected="false">Profile</button></li>' +
            '</ul>' +
            '<div class="tab-content">' +
            '  <div class="tab-pane active" id="home" role="tabpanel"/>' +
            '  <div class="tab-pane" id="profile" role="tabpanel"/>' +
            '</div>'

        $(tabsHTML)
          .find('li:last-child button')
          .on('show.bs.tab', function (e) {
            expect(e.relatedTarget.getAttribute('data-target')).toBe('#home')
          })
          .on('shown.bs.tab', function (e) {
            expect(e.relatedTarget.getAttribute('data-target')).toBe('#home')
            done()
          })
          .bootstrapTab('show')
  })
  it('should fire hide and hidden events', done => {
    expect.assertions(2)
        var tabsHTML = '<ul class="nav" role="tablist">' +
            '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
            '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
            '</ul>'

        $(tabsHTML)
          .find('li:first-child button')
          .on('hide.bs.tab', function () {
            expect(true).toBeTruthy()
          })
          .bootstrapTab('show')
          .end()
          .find('li:last-child button')
          .bootstrapTab('show')

        $(tabsHTML)
          .find('li:first-child button')
          .on('hidden.bs.tab', function () {
            expect(true).toBeTruthy()
            done()
          })
          .bootstrapTab('show')
          .end()
          .find('li:last-child button')
          .bootstrapTab('show')
  })
  it('should not fire hidden when hide is prevented', done => {
    expect.assertions(1)
        var tabsHTML = '<ul class="nav" role="tablist">' +
            '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
            '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
            '</ul>'

        $(tabsHTML)
          .find('li:first-child button')
          .on('hide.bs.tab', function (e) {
            e.preventDefault()
            expect(true).toBeTruthy()
            done()
          })
          .on('hidden.bs.tab', function () {
            expect(false).toBeTruthy()
          })
          .bootstrapTab('show')
          .end()
          .find('li:last-child button')
          .bootstrapTab('show')
  })
  it('hide and hidden events contain correct relatedTarget', done => {
    expect.assertions(2)
        var tabsHTML = '<ul class="nav" role="tablist">' +
            '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
            '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
            '</ul>'

        $(tabsHTML)
          .find('li:first-child button')
          .on('hide.bs.tab', function (e) {
            expect(e.relatedTarget.getAttribute('data-target')).toBe('#profile')
          })
          .on('hidden.bs.tab', function (e) {
            expect(e.relatedTarget.getAttribute('data-target')).toBe('#profile')
            done()
          })
          .bootstrapTab('show')
          .end()
          .find('li:last-child button')
          .bootstrapTab('show')
  })
  it('selected tab should have correct aria-selected', () => {
    expect.assertions(8)
        var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
            '<li><button type="button" data-target="#home" role="tab" aria-selected="false">Home</button></li>' +
            '<li><button type="button" data-target="#profile" role="tab" aria-selected="false">Profile</button></li>' +
            '</ul>'
        var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

        $tabs.find('li:first-child button').bootstrapTab('show')
        expect($tabs.find('.active').attr('aria-selected')).toBe('true')
        expect($tabs.find('button:not(.active)').attr('aria-selected')).toBe('false')

        $tabs.find('li:last-child button').trigger('click')
        expect($tabs.find('.active').attr('aria-selected')).toBe('true')
        expect($tabs.find('button:not(.active)').attr('aria-selected')).toBe('false')

        $tabs.find('li:first-child button').bootstrapTab('show')
        expect($tabs.find('.active').attr('aria-selected')).toBe('true')
        expect($tabs.find('button:not(.active)').attr('aria-selected')).toBe('false')

        $tabs.find('li:first-child button').trigger('click')
        expect($tabs.find('.active').attr('aria-selected')).toBe('true')
        expect($tabs.find('button:not(.active)').attr('aria-selected')).toBe('false')
  })
  it('selected tab should deactivate previous selected tab', () => {
    expect.assertions(2)
        var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
            '<li class="nav-item"><button type="button" data-target="#home" role="tab" data-toggle="tab">Home</button></li>' +
            '<li class="nav-item"><button type="button" data-target="#profile" role="tab" data-toggle="tab">Profile</button></li>' +
            '</ul>'
        var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

        $tabs.find('li:last-child button').trigger('click')
        expect($tabs.find('li:first-child button').hasClass('active')).toBe(false)
        expect($tabs.find('li:last-child button').hasClass('active')).toBe(true)
  })
  it('should support li > .dropdown-item', () => {
    expect.assertions(2)
        var tabsHTML = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item"><a class="nav-link active" href="#home" data-toggle="tab">Home</a></li>',
          '  <li class="nav-item"><a class="nav-link" href="#profile" data-toggle="tab">Profile</a></li>',
          '  <li class="nav-item dropdown">',
          '    <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">Dropdown</a>',
          '    <ul class="dropdown-menu">',
          '      <li><a class="dropdown-item" href="#dropdown1" id="dropdown1-tab" data-toggle="tab">@fat</a></li>',
          '      <li><a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-toggle="tab">@mdo</a></li>',
          '    </ul>',
          '  </li>',
          '</ul>'
        ].join('')
        var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

        $tabs.find('.dropdown-item').trigger('click')
        expect($tabs.find('.dropdown-item').hasClass('active')).toBe(true)
        expect($tabs.find('.nav-link:not(.dropdown-toggle)').hasClass('active')).toBe(false)
  })
  it('Nested tabs', done => {
    expect.assertions(2)
        var tabsHTML =
            '<nav class="nav nav-tabs" role="tablist">' +
            '  <button type="button" id="tab1" data-target="#x-tab1" class="nav-link" data-toggle="tab" role="tab" aria-controls="x-tab1">Tab 1</button>' +
            '  <button type="button" data-target="#x-tab2" class="nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab2" aria-selected="true">Tab 2</button>' +
            '  <button type="button" data-target="#x-tab3" class="nav-link" data-toggle="tab" role="tab" aria-controls="x-tab3">Tab 3</button>' +
            '</nav>' +
            '<div class="tab-content">' +
            '  <div class="tab-pane" id="x-tab1" role="tabpanel">' +
            '    <nav class="nav nav-tabs" role="tablist">' +
            '      <a href="#nested-tab1" class="nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab1" aria-selected="true">Nested Tab 1</a>' +
            '      <a id="tabNested2" href="#nested-tab2" class="nav-link" data-toggle="tab" role="tab" aria-controls="x-profile">Nested Tab2</a>' +
            '    </nav>' +
            '    <div class="tab-content">' +
            '      <div class="tab-pane active" id="nested-tab1" role="tabpanel">Nested Tab1 Content</div>' +
            '      <div class="tab-pane" id="nested-tab2" role="tabpanel">Nested Tab2 Content</div>' +
            '    </div>' +
            '  </div>' +
            '  <div class="tab-pane active" id="x-tab2" role="tabpanel">Tab2 Content</div>' +
            '  <div class="tab-pane" id="x-tab3" role="tabpanel">Tab3 Content</div>' +
            '</div>'

        $(tabsHTML).appendTo('#qunit-fixture')

        $('#tabNested2').on('shown.bs.tab', function () {
          expect($('#x-tab1').hasClass('active')).toBe(true)
          done()
        })

        $('#tab1').on('shown.bs.tab', function () {
          expect($('#x-tab1').hasClass('active')).toBe(true)
          $('#tabNested2').trigger($.Event('click'))
        })
          .trigger($.Event('click'))
  })
  it('should not remove fade class if no active pane is present', done => {
    expect.assertions(6)
        var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
          '<li class="nav-item" role="presentation"><button type="button" id="tab-home" data-target="#home" class="nav-link" data-toggle="tab" role="tab">Home</button></li>' +
          '<li class="nav-item" role="presentation"><button type="button" id="tab-profile" data-target="#profile" class="nav-link" data-toggle="tab" role="tab">Profile</button></li>' +
          '</ul>' +
          '<div class="tab-content">' +
          '<div class="tab-pane fade" id="home" role="tabpanel"></div>' +
          '<div class="tab-pane fade" id="profile" role="tabpanel"></div>' +
          '</div>'

        $(tabsHTML).appendTo('#qunit-fixture')
        $('#tab-profile')
          .on('shown.bs.tab', function () {
            expect($('#profile').hasClass('fade')).toBe(true)
            expect($('#profile').hasClass('show')).toBe(true)

            $('#tab-home')
              .on('shown.bs.tab', function () {
                expect($('#profile').hasClass('fade')).toBe(true)
                expect($('#profile').hasClass('show')).toBe(false)
                expect($('#home').hasClass('fade')).toBe(true)
                expect($('#home').hasClass('show')).toBe(true)

                done()
              })
              .trigger($.Event('click'))
          })
          .trigger($.Event('click'))
  })
  it('should handle removed tabs', done => {
    expect.assertions(1)
        var html = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation">',
          '    <a class="nav-link nav-tab" href="#profile" role="tab" data-toggle="tab">',
          '      <button class="close"><span aria-hidden="true">&times;</span></button>',
          '    </a>',
          '  </li>',
          '  <li class="nav-item" role="presentation">',
          '    <a id="secondNav" class="nav-link nav-tab" href="#buzz" role="tab" data-toggle="tab">',
          '      <button class="close"><span aria-hidden="true">&times;</span></button>',
          '    </a>',
          '  </li>',
          '  <li class="nav-item" role="presentation">',
          '    <a class="nav-link nav-tab" href="#references" role="tab" data-toggle="tab">',
          '      <button id="btnClose" class="close"><span aria-hidden="true">&times;</span></button>',
          '    </a>',
          '  </li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div role="tabpanel" class="tab-pane fade show active" id="profile">test 1</div>',
          '  <div role="tabpanel" class="tab-pane fade" id="buzz">test 2</div>',
          '  <div role="tabpanel" class="tab-pane fade" id="references">test 3</div>',
          '</div>'
        ].join('')

        $(html).appendTo('#qunit-fixture')

        $('#secondNav').on('shown.bs.tab', function () {
          expect($('.nav-tab').length).toBe(2)
          done()
        })

        $('#btnClose').one('click', function () {
          var tabId = $(this).parents('a').attr('href')
          $(this).parents('li').remove()
          $(tabId).remove()
          $('.nav-tabs a:last').bootstrapTab('show')
        })
          .trigger($.Event('click'))
  })
  it('should not add show class to tab panes if there is no `.fade` class', done => {
    expect.assertions(1)
        var html = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation">',
          '    <button type="button" class="nav-link nav-tab" data-target="#home" role="tab" data-toggle="tab">Home</button>',
          '  </li>',
          '  <li class="nav-item" role="presentation">',
          '    <button type="button" id="secondNav" class="nav-link nav-tab" data-target="#profile" role="tab" data-toggle="tab">Profile</button>',
          '  </li>',
          '</ul>',
          '<div class="tab-content" role="presentation">',
          '  <div role="tabpanel" class="tab-pane" id="home">test 1</div>',
          '  <div role="tabpanel" class="tab-pane" id="profile">test 2</div>',
          '</div>'
        ].join('')

        $(html).appendTo('#qunit-fixture')

        $('#secondNav').on('shown.bs.tab', function () {
          expect($('.show').length).toBe(0)
          done()
        })
          .trigger($.Event('click'))
  })
  it('should add show class to tab panes if there is a `.fade` class', done => {
    expect.assertions(1)
        var html = [
          '<ul class="nav nav-tabs" role="tablist">',
          '  <li class="nav-item" role="presentation">',
          '    <button type="button" class="nav-link nav-tab" data-target="#home" role="tab" data-toggle="tab">Home</button>',
          '  </li>',
          '  <li class="nav-item" role="presentation">',
          '    <button type="button" id="secondNav" class="nav-link nav-tab" data-target="#profile" role="tab" data-toggle="tab">Profile</button>',
          '  </li>',
          '</ul>',
          '<div class="tab-content">',
          '  <div role="tabpanel" class="tab-pane fade" id="home">test 1</div>',
          '  <div role="tabpanel" class="tab-pane fade" id="profile">test 2</div>',
          '</div>'
        ].join('')

        $(html).appendTo('#qunit-fixture')

        $('#secondNav').on('shown.bs.tab', function () {
          expect($('.show').length).toBe(1)
          done()
        })
          .trigger($.Event('click'))
  })
})
