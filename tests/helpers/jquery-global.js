// Registers jQuery on globalThis so plugin modules imported afterwards run
// defineJQueryPlugin and attach their jQueryInterface to $.fn.
import jQuery from 'jquery'

globalThis.jQuery = jQuery

globalThis.$ = jQuery
