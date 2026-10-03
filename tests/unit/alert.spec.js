import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import sinon from 'sinon'
import $ from 'jquery'
import { clearFixture, setFixture } from './helpers.js'
import Alert from '../../js/src/alert'

describe('alert plugin', () => {
  it('should be defined on jquery object', () => {
    expect.assertions(1)
        expect($(document.body).alert).toBeTruthy()
  })
})

describe('alert', () => {
  beforeEach(() => {
    // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
          $.fn.bootstrapAlert = $.fn.alert.noConflict()
  })
  afterEach(() => {
    $.fn.alert = $.fn.bootstrapAlert
          delete $.fn.bootstrapAlert
          clearFixture()
  })
  it('should provide no conflict', () => {
    expect.assertions(1)
        expect(typeof $.fn.alert).toBe('undefined')
  })
  it('should return jquery collection containing the element', () => {
    expect.assertions(2)
        var $el = $('<div/>')
        var $alert = $el.bootstrapAlert()
        expect($alert instanceof $).toBe(true)
        expect($alert[0]).toBe($el[0])
  })
  it('should fade element out on clicking .close', () => {
    expect.assertions(1)
        var alertHTML = '<div class="alert alert-danger fade show">' +
            '<a class="close" href="#" data-dismiss="alert">×</a>' +
            '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
            '</div>'

        var $alert = $(alertHTML).bootstrapAlert().appendTo($('#qunit-fixture'))

        $alert.find('.close').trigger('click')

        expect($alert.hasClass('show')).toBe(false)
  })
  it('should remove element when clicking .close', done => {
    expect.assertions(2)
        var alertHTML = '<div class="alert alert-danger fade show">' +
            '<a class="close" href="#" data-dismiss="alert">×</a>' +
            '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
            '</div>'
        var $alert = $(alertHTML).appendTo('#qunit-fixture').bootstrapAlert()

        expect($('#qunit-fixture').find('.alert').length).not.toBe(0)

        $alert
          .one('closed.bs.alert', function () {
            expect($('#qunit-fixture').find('.alert').length).toBe(0)
            done()
          })
          .find('.close')
          .trigger('click')
  })
  it('should not fire closed when close is prevented', done => {
    expect.assertions(1)
        $('<div class="alert"/>')
          .on('close.bs.alert', function (e) {
            e.preventDefault()
            expect(true).toBeTruthy()
            done()
          })
          .on('closed.bs.alert', function () {
            expect(false).toBeTruthy()
          })
          .bootstrapAlert('close')
  })
  it('close should use internal _element if no element provided', done => {
    expect.assertions(1)

        var $el = $('<div/>')
        var $alert = $el.bootstrapAlert()
        var alertInstance = $alert.data('bs.alert')

        $alert.one('closed.bs.alert', function () {
          expect('alert closed').toBeTruthy()
          done()
        })

        alertInstance.close()
  })
  it('dispose should remove data and the element', () => {
    expect.assertions(2)

        var $el = $('<div/>')
        var $alert = $el.bootstrapAlert()

        expect(typeof $alert.data('bs.alert')).not.toBe('undefined')

        $alert.data('bs.alert').dispose()

        expect(typeof $alert.data('bs.button')).toBe('undefined')
  })
  it('should return alert version', () => {
    expect.assertions(1)

        expect(typeof Alert.VERSION).toBe('string')
  })
})
