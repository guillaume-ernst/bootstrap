import '../helpers/jquery-global.js'

import Alert from '../../js/src/alert.js'
import Button from '../../js/src/button.js'
import Carousel from '../../js/src/carousel.js'
import Collapse from '../../js/src/collapse.js'
import Dropdown from '../../js/src/dropdown.js'
import Modal from '../../js/src/modal.js'
import Offcanvas from '../../js/src/offcanvas.js'
import Popover from '../../js/src/popover.js'
import ScrollSpy from '../../js/src/scrollspy.js'
import Tab from '../../js/src/tab.js'
import Toast from '../../js/src/toast.js'
import Tooltip from '../../js/src/tooltip.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('jQuery', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should add all plugins in jQuery', () => {
    expect(Alert.jQueryInterface).toEqual(jQuery.fn.alert)
    expect(Button.jQueryInterface).toEqual(jQuery.fn.button)
    expect(Carousel.jQueryInterface).toEqual(jQuery.fn.carousel)
    expect(Collapse.jQueryInterface).toEqual(jQuery.fn.collapse)
    expect(Dropdown.jQueryInterface).toEqual(jQuery.fn.dropdown)
    expect(Modal.jQueryInterface).toEqual(jQuery.fn.modal)
    expect(Offcanvas.jQueryInterface).toEqual(jQuery.fn.offcanvas)
    expect(Popover.jQueryInterface).toEqual(jQuery.fn.popover)
    expect(ScrollSpy.jQueryInterface).toEqual(jQuery.fn.scrollspy)
    expect(Tab.jQueryInterface).toEqual(jQuery.fn.tab)
    expect(Toast.jQueryInterface).toEqual(jQuery.fn.toast)
    expect(Tooltip.jQueryInterface).toEqual(jQuery.fn.tooltip)
  })

  it('should use jQuery event system', () => new Promise(resolve => {
    fixtureEl.innerHTML = [
      '<div class="alert">',
      '  <button type="button" data-bs-dismiss="alert">x</button>',
      '</div>'
    ].join('')

    $(fixtureEl).find('.alert')
        .one('closed.bs.alert', () => {
          expect($(fixtureEl).find('.alert')).toHaveSize(0)
          resolve()
        })

    $(fixtureEl).find('button').trigger('click')
  }))
})
