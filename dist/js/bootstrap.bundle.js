/*!
  * Bootstrap v4.7.0-dev (https://github.com/guillaume-ernst/bootstrap#readme)
  * Copyright 2011-2026 Guillaume Ernst
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.bootstrap = {}, global.jQuery));
})(this, (function (exports, $) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Private TransitionEnd Helpers
   */

  const TRANSITION_END = 'transitionend';
  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;

  // Shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
    if (obj === null || obj === undefined) {
      return `${obj}`;
    }
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }
  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }
        return undefined;
      }
    };
  }
  function transitionEndEmulator(duration) {
    let called = false;
    $(this).one(Util.TRANSITION_END, () => {
      called = true;
    });
    setTimeout(() => {
      if (!called) {
        Util.triggerTransitionEnd(this);
      }
    }, duration);
    return this;
  }
  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  function parseTimeValue(value) {
    if (!value) {
      return 0;
    }
    const floatValue = parseFloat(value);
    if (Number.isNaN(floatValue)) {
      return 0;
    }

    // Return milliseconds directly; convert seconds.
    return value.trim().endsWith('ms') ? floatValue : floatValue * MILLISECONDS_MULTIPLIER;
  }

  /**
   * Public Util API
   */

  const Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));
      return prefix;
    },
    getSelectorFromElement(element) {
      let selector = element.getAttribute('data-target');
      if (!selector || selector === '#') {
        const hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }
      try {
        return document.querySelector(selector) ? selector : null;
      } catch (_) {
        return null;
      }
    },
    getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      }

      // Get transition-duration of the element
      let transitionDuration = $(element).css('transition-duration');
      let transitionDelay = $(element).css('transition-delay');

      // jsdom does not always resolve the CSS `transition` shorthand or
      // transition-* longhands from inline styles; fall back to inline style.
      transitionDuration || (transitionDuration = element.style.transitionDuration || '');
      transitionDelay || (transitionDelay = element.style.transitionDelay || '');
      const floatTransitionDuration = parseFloat(transitionDuration);
      const floatTransitionDelay = parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return parseTimeValue(transitionDuration) + parseTimeValue(transitionDelay);
    },
    reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    },
    supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig(componentName, config, configTypes) {
      for (const property in configTypes) {
        if (Object.hasOwn(configTypes, property)) {
          const expectedTypes = configTypes[property];
          const value = config[property];
          const valueType = value && Util.isElement(value) ? 'element' : toType(value);
          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(`${componentName.toUpperCase()}: ` + `Option "${property}" provided type "${valueType}" ` + `but expected type "${expectedTypes}".`);
          }
        }
      }
    },
    findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      }

      // Can find the shadow root otherwise it'll return the document
      if (typeof element.getRootNode === 'function') {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }
      if (element instanceof ShadowRoot) {
        return element;
      }

      // when we don't find a shadow root
      if (!element.parentNode) {
        return null;
      }
      return Util.findShadowRoot(element.parentNode);
    },
    jQueryDetection() {
      if ($ === undefined) {
        throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
      }
      const version = $.fn.jquery.split(' ')[0].split('.');
      const minMajor = 3;
      const minMinor = 5;
      const minPatch = 0;
      if (version[0] < minMajor || version[0] === minMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch) {
        throw new Error('Bootstrap\'s JavaScript requires at least jQuery v3.5.0');
      }
    }
  };
  Util.jQueryDetection();
  setTransitionEndSupport();

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$a = 'alert';
  const VERSION$a = '4.6.2';
  const DATA_KEY$a = 'bs.alert';
  const EVENT_KEY$a = `.${DATA_KEY$a}`;
  const DATA_API_KEY$7 = '.data-api';
  const JQUERY_NO_CONFLICT$a = $.fn[NAME$a];
  const CLASS_NAME_ALERT = 'alert';
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$7 = 'show';
  const EVENT_CLOSE = `close${EVENT_KEY$a}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$a}`;
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$7}`;
  const SELECTOR_DISMISS = '[data-dismiss="alert"]';

  /**
   * Class definition
   */

  class Alert {
    constructor(element) {
      this._element = element;
    }

    // Getters
    static get VERSION() {
      return VERSION$a;
    }

    // Public
    close(element) {
      let rootElement = this._element;
      if (element) {
        rootElement = this._getRootElement(element);
      }
      const customEvent = this._triggerCloseEvent(rootElement);
      if (customEvent.isDefaultPrevented()) {
        return;
      }
      this._removeElement(rootElement);
    }
    dispose() {
      $.removeData(this._element, DATA_KEY$a);
      this._element = null;
    }

    // Private
    _getRootElement(element) {
      const selector = Util.getSelectorFromElement(element);
      let parent = false;
      if (selector) {
        parent = document.querySelector(selector);
      }
      parent || (parent = $(element).closest(`.${CLASS_NAME_ALERT}`)[0]);
      return parent;
    }
    _triggerCloseEvent(element) {
      const closeEvent = $.Event(EVENT_CLOSE);
      $(element).trigger(closeEvent);
      return closeEvent;
    }
    _removeElement(element) {
      $(element).removeClass(CLASS_NAME_SHOW$7);
      if (!$(element).hasClass(CLASS_NAME_FADE$5)) {
        this._destroyElement(element);
        return;
      }
      const transitionDuration = Util.getTransitionDurationFromElement(element);
      $(element).one(Util.TRANSITION_END, event => this._destroyElement(element, event)).emulateTransitionEnd(transitionDuration);
    }
    _destroyElement(element) {
      $(element).detach().trigger(EVENT_CLOSED).remove();
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $(this);
        let data = $element.data(DATA_KEY$a);
        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY$a, data);
        }
        if (config === 'close') {
          data[config](this);
        }
      });
    }
    static _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }
        alertInstance.close(this);
      };
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API$6, SELECTOR_DISMISS, Alert._handleDismiss(new Alert()));

  /**
   * jQuery
   */

  $.fn[NAME$a] = Alert._jQueryInterface;
  $.fn[NAME$a].Constructor = Alert;
  $.fn[NAME$a].noConflict = () => {
    $.fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Alert._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$9 = 'button';
  const VERSION$9 = '4.6.2';
  const DATA_KEY$9 = 'bs.button';
  const EVENT_KEY$9 = `.${DATA_KEY$9}`;
  const DATA_API_KEY$6 = '.data-api';
  const JQUERY_NO_CONFLICT$9 = $.fn[NAME$9];
  const CLASS_NAME_ACTIVE$3 = 'active';
  const CLASS_NAME_BUTTON = 'btn';
  const CLASS_NAME_FOCUS = 'focus';
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const EVENT_FOCUS_BLUR_DATA_API = `focus${EVENT_KEY$9}${DATA_API_KEY$6} ` + `blur${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]';
  const SELECTOR_DATA_TOGGLES = '[data-toggle="buttons"]';
  const SELECTOR_DATA_TOGGLE$4 = '[data-toggle="button"]';
  const SELECTOR_DATA_TOGGLES_BUTTONS = '[data-toggle="buttons"] .btn';
  const SELECTOR_INPUT = 'input:not([type="hidden"])';
  const SELECTOR_ACTIVE$2 = '.active';
  const SELECTOR_BUTTON = '.btn';

  /**
   * Class definition
   */

  class Button {
    constructor(element) {
      this._element = element;
      this.shouldAvoidTriggerChange = false;
    }

    // Getters
    static get VERSION() {
      return VERSION$9;
    }

    // Public
    toggle() {
      let triggerChangeEvent = true;
      let addAriaPressed = true;
      const rootElement = $(this._element).closest(SELECTOR_DATA_TOGGLES)[0];
      if (rootElement) {
        const input = this._element.querySelector(SELECTOR_INPUT);
        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this._element.classList.contains(CLASS_NAME_ACTIVE$3)) {
              triggerChangeEvent = false;
            } else {
              const activeElement = rootElement.querySelector(SELECTOR_ACTIVE$2);
              if (activeElement) {
                $(activeElement).removeClass(CLASS_NAME_ACTIVE$3);
              }
            }
          }
          if (triggerChangeEvent) {
            // if it's not a radio button or checkbox don't add a pointless/invalid checked property to the input
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = !this._element.classList.contains(CLASS_NAME_ACTIVE$3);
            }
            if (!this.shouldAvoidTriggerChange) {
              $(input).trigger('change');
            }
          }
          input.focus();
          addAriaPressed = false;
        }
      }
      if (!(this._element.hasAttribute('disabled') || this._element.classList.contains('disabled'))) {
        if (addAriaPressed) {
          this._element.setAttribute('aria-pressed', !this._element.classList.contains(CLASS_NAME_ACTIVE$3));
        }
        if (triggerChangeEvent) {
          $(this._element).toggleClass(CLASS_NAME_ACTIVE$3);
        }
      }
    }
    dispose() {
      $.removeData(this._element, DATA_KEY$9);
      this._element = null;
    }

    // Static
    static _jQueryInterface(config, avoidTriggerChange) {
      return this.each(function () {
        const $element = $(this);
        let data = $element.data(DATA_KEY$9);
        if (!data) {
          data = new Button(this);
          $element.data(DATA_KEY$9, data);
        }
        data.shouldAvoidTriggerChange = avoidTriggerChange;
        if (config === 'toggle') {
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API$5, SELECTOR_DATA_TOGGLE_CARROT, event => {
    let button = event.target;
    const initialButton = button;
    if (!$(button).hasClass(CLASS_NAME_BUTTON)) {
      button = $(button).closest(SELECTOR_BUTTON)[0];
    }
    if (!button || button.hasAttribute('disabled') || button.classList.contains('disabled')) {
      event.preventDefault(); // work around Firefox bug #1540995
    } else {
      const inputBtn = button.querySelector(SELECTOR_INPUT);
      if (inputBtn && (inputBtn.hasAttribute('disabled') || inputBtn.classList.contains('disabled'))) {
        event.preventDefault(); // work around Firefox bug #1540995
        return;
      }
      if (initialButton.tagName === 'INPUT' || button.tagName !== 'LABEL') {
        Button._jQueryInterface.call($(button), 'toggle', initialButton.tagName === 'INPUT');
      }
    }
  }).on(EVENT_FOCUS_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
    const button = $(event.target).closest(SELECTOR_BUTTON)[0];
    $(button).toggleClass(CLASS_NAME_FOCUS, /^focus(in)?$/.test(event.type));
  });
  $(globalThis).on(EVENT_LOAD_DATA_API$2, () => {
    // ensure correct active class is set to match the controls' actual values/states

    // find all checkboxes/readio buttons inside data-toggle groups
    let buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLES_BUTTONS));
    for (let i = 0, len = buttons.length; i < len; i++) {
      const button = buttons[i];
      const input = button.querySelector(SELECTOR_INPUT);
      if (input.checked || input.hasAttribute('checked')) {
        button.classList.add(CLASS_NAME_ACTIVE$3);
      } else {
        button.classList.remove(CLASS_NAME_ACTIVE$3);
      }
    }

    // find all button toggles
    buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$4));
    for (let i = 0, len = buttons.length; i < len; i++) {
      const button = buttons[i];
      if (button.getAttribute('aria-pressed') === 'true') {
        button.classList.add(CLASS_NAME_ACTIVE$3);
      } else {
        button.classList.remove(CLASS_NAME_ACTIVE$3);
      }
    }
  });

  /**
   * jQuery
   */

  $.fn[NAME$9] = Button._jQueryInterface;
  $.fn[NAME$9].Constructor = Button;
  $.fn[NAME$9].noConflict = () => {
    $.fn[NAME$9] = JQUERY_NO_CONFLICT$9;
    return Button._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$8 = 'carousel';
  const VERSION$8 = '4.6.2';
  const DATA_KEY$8 = 'bs.carousel';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$5 = '.data-api';
  const JQUERY_NO_CONFLICT$8 = $.fn[NAME$8];
  const ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key
  const ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch
  const SWIPE_THRESHOLD = 40;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_RIGHT = 'carousel-item-right';
  const CLASS_NAME_LEFT = 'carousel-item-left';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const DIRECTION_NEXT = 'next';
  const DIRECTION_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
  const EVENT_SLID = `slid${EVENT_KEY$8}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$8}`;
  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$8}`;
  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$8}`;
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$8}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$8}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$8}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$8}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$8}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const SELECTOR_ACTIVE$1 = '.active';
  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_DATA_SLIDE = '[data-slide], [data-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-ride="carousel"]';
  const Default$7 = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  const DefaultType$7 = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  const PointerType = {
    TOUCH: 'touch',
    PEN: 'pen'
  };

  /**
   * Class definition
   */

  class Carousel {
    constructor(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._element = element;
      this._indicatorsElement = this._element.querySelector(SELECTOR_INDICATORS);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(globalThis.PointerEvent || globalThis.MSPointerEvent);
      this._addEventListeners();
    }

    // Getters
    static get VERSION() {
      return VERSION$8;
    }
    static get Default() {
      return Default$7;
    }

    // Public
    next() {
      if (!this._isSliding) {
        this._slide(DIRECTION_NEXT);
      }
    }
    nextWhenVisible() {
      const $element = $(this._element);
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $element.is(':visible') && $element.css('visibility') !== 'hidden') {
        this.next();
      }
    }
    prev() {
      if (!this._isSliding) {
        this._slide(DIRECTION_PREV);
      }
    }
    pause(event) {
      if (!event) {
        this._isPaused = true;
      }
      if (this._element.querySelector(SELECTOR_NEXT_PREV)) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }
      clearInterval(this._interval);
      this._interval = null;
    }
    cycle(event) {
      if (!event) {
        this._isPaused = false;
      }
      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }
      if (this._config.interval && !this._isPaused) {
        this._updateInterval();
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    }
    to(index) {
      this._activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM);
      const activeIndex = this._getItemIndex(this._activeElement);
      if (index > this._items.length - 1 || index < 0) {
        return;
      }
      if (this._isSliding) {
        $(this._element).one(EVENT_SLID, () => this.to(index));
        return;
      }
      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }
      const direction = index > activeIndex ? DIRECTION_NEXT : DIRECTION_PREV;
      this._slide(direction, this._items[index]);
    }
    dispose() {
      $(this._element).off(EVENT_KEY$8);
      $.removeData(this._element, DATA_KEY$8);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    }

    // Private
    _getConfig(config) {
      config = {
        ...Default$7,
        ...config
      };
      Util.typeCheckConfig(NAME$8, config, DefaultType$7);
      return config;
    }
    _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);
      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }
      const direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0;

      // swipe left
      if (direction > 0) {
        this.prev();
      }

      // swipe right
      if (direction < 0) {
        this.next();
      }
    }
    _addEventListeners() {
      if (this._config.keyboard) {
        $(this._element).on(EVENT_KEYDOWN, event => this._keydown(event));
      }
      if (this._config.pause === 'hover') {
        $(this._element).on(EVENT_MOUSEENTER, event => this.pause(event)).on(EVENT_MOUSELEAVE, event => this.cycle(event));
      }
      if (this._config.touch) {
        this._addTouchEventListeners();
      }
    }
    _addTouchEventListeners() {
      if (!this._touchSupported) {
        return;
      }
      const start = event => {
        if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          this.touchStartX = event.originalEvent.clientX;
        } else if (!this._pointerEvent) {
          this.touchStartX = event.originalEvent.touches[0].clientX;
        }
      };
      const move = event => {
        // ensure swiping with one touch and not pinching
        this.touchDeltaX = event.originalEvent.touches && event.originalEvent.touches.length > 1 ? 0 : event.originalEvent.touches[0].clientX - this.touchStartX;
      };
      const end = event => {
        if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          this.touchDeltaX = event.originalEvent.clientX - this.touchStartX;
        }
        this._handleSwipe();
        if (this._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling

          this.pause();
          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }
          this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
        }
      };
      $(this._element.querySelectorAll(SELECTOR_ITEM_IMG)).on(EVENT_DRAG_START, e => e.preventDefault());
      if (this._pointerEvent) {
        $(this._element).on(EVENT_POINTERDOWN, event => start(event));
        $(this._element).on(EVENT_POINTERUP, event => end(event));
        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        $(this._element).on(EVENT_TOUCHSTART, event => start(event));
        $(this._element).on(EVENT_TOUCHMOVE, event => move(event));
        $(this._element).on(EVENT_TOUCHEND, event => end(event));
      }
    }
    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }
      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          {
            event.preventDefault();
            this.prev();
            break;
          }
        case ARROW_RIGHT_KEYCODE:
          {
            event.preventDefault();
            this.next();
            break;
          }
      }
    }
    _getItemIndex(element) {
      this._items = element && element.parentNode ? [].slice.call(element.parentNode.querySelectorAll(SELECTOR_ITEM)) : [];
      return this._items.indexOf(element);
    }
    _getItemByDirection(direction, activeElement) {
      const isNextDirection = direction === DIRECTION_NEXT;
      const isPrevDirection = direction === DIRECTION_PREV;
      const activeIndex = this._getItemIndex(activeElement);
      const lastItemIndex = this._items.length - 1;
      const isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;
      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }
      const delta = direction === DIRECTION_PREV ? -1 : 1;
      const itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items.at(-1) : this._items[itemIndex];
    }
    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget);
      const fromIndex = this._getItemIndex(this._element.querySelector(SELECTOR_ACTIVE_ITEM));
      const slideEvent = $.Event(EVENT_SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $(this._element).trigger(slideEvent);
      return slideEvent;
    }
    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const indicators = [].slice.call(this._indicatorsElement.querySelectorAll(SELECTOR_ACTIVE$1));
        $(indicators).removeClass(CLASS_NAME_ACTIVE$2);
        const nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];
        if (nextIndicator) {
          $(nextIndicator).addClass(CLASS_NAME_ACTIVE$2);
        }
      }
    }
    _updateInterval() {
      const element = this._activeElement || this._element.querySelector(SELECTOR_ACTIVE_ITEM);
      if (!element) {
        return;
      }
      const elementInterval = parseInt(element.getAttribute('data-interval'), 10);
      if (elementInterval) {
        var _this$_config;
        (_this$_config = this._config).defaultInterval || (_this$_config.defaultInterval = this._config.interval);
        this._config.interval = elementInterval;
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval;
      }
    }
    _slide(direction, element) {
      const activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM);
      const activeElementIndex = this._getItemIndex(activeElement);
      const nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);
      const nextElementIndex = this._getItemIndex(nextElement);
      const isCycling = Boolean(this._interval);
      let directionalClassName;
      let orderClassName;
      let eventDirectionName;
      if (direction === DIRECTION_NEXT) {
        directionalClassName = CLASS_NAME_LEFT;
        orderClassName = CLASS_NAME_NEXT;
        eventDirectionName = DIRECTION_LEFT;
      } else {
        directionalClassName = CLASS_NAME_RIGHT;
        orderClassName = CLASS_NAME_PREV;
        eventDirectionName = DIRECTION_RIGHT;
      }
      if (nextElement && $(nextElement).hasClass(CLASS_NAME_ACTIVE$2)) {
        this._isSliding = false;
        return;
      }
      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
      if (slideEvent.isDefaultPrevented()) {
        return;
      }
      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }
      this._isSliding = true;
      if (isCycling) {
        this.pause();
      }
      this._setActiveIndicatorElement(nextElement);
      this._activeElement = nextElement;
      const slidEvent = $.Event(EVENT_SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });
      if ($(this._element).hasClass(CLASS_NAME_SLIDE)) {
        $(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);
        const transitionDuration = Util.getTransitionDurationFromElement(activeElement);
        $(activeElement).one(Util.TRANSITION_END, () => {
          $(nextElement).removeClass(`${directionalClassName} ${orderClassName}`).addClass(CLASS_NAME_ACTIVE$2);
          $(activeElement).removeClass(`${CLASS_NAME_ACTIVE$2} ${orderClassName} ${directionalClassName}`);
          this._isSliding = false;
          setTimeout(() => $(this._element).trigger(slidEvent), 0);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        $(activeElement).removeClass(CLASS_NAME_ACTIVE$2);
        $(nextElement).addClass(CLASS_NAME_ACTIVE$2);
        this._isSliding = false;
        $(this._element).trigger(slidEvent);
      }
      if (isCycling) {
        this.cycle();
      }
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY$8);
        let _config = {
          ...Default$7,
          ...$(this).data()
        };
        if (typeof config === 'object') {
          _config = {
            ..._config,
            ...config
          };
        }
        const action = typeof config === 'string' ? config : _config.slide;
        if (!data) {
          data = new Carousel(this, _config);
          $(this).data(DATA_KEY$8, data);
        }
        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (data[action] === undefined) {
            throw new TypeError(`No method named "${action}"`);
          }
          data[action]();
        } else if (_config.interval && _config.ride) {
          data.pause();
          data.cycle();
        }
      });
    }
    static _dataApiClickHandler(event) {
      const selector = Util.getSelectorFromElement(this);
      if (!selector) {
        return;
      }
      const target = $(selector)[0];
      if (!target || !$(target).hasClass(CLASS_NAME_CAROUSEL)) {
        return;
      }
      const config = {
        ...$(target).data(),
        ...$(this).data()
      };
      const slideIndex = this.getAttribute('data-slide-to');
      if (slideIndex) {
        config.interval = false;
      }
      Carousel._jQueryInterface.call($(target), config);
      if (slideIndex) {
        $(target).data(DATA_KEY$8).to(slideIndex);
      }
      event.preventDefault();
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API$4, SELECTOR_DATA_SLIDE, Carousel._dataApiClickHandler);
  $(globalThis).on(EVENT_LOAD_DATA_API$1, () => {
    const carousels = [].slice.call(document.querySelectorAll(SELECTOR_DATA_RIDE));
    for (let i = 0, len = carousels.length; i < len; i++) {
      const $carousel = $(carousels[i]);
      Carousel._jQueryInterface.call($carousel, $carousel.data());
    }
  });

  /**
   * jQuery
   */

  $.fn[NAME$8] = Carousel._jQueryInterface;
  $.fn[NAME$8].Constructor = Carousel;
  $.fn[NAME$8].noConflict = () => {
    $.fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return Carousel._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$7 = 'collapse';
  const VERSION$7 = '4.6.2';
  const DATA_KEY$7 = 'bs.collapse';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const DATA_API_KEY$4 = '.data-api';
  const JQUERY_NO_CONFLICT$7 = $.fn[NAME$7];
  const CLASS_NAME_SHOW$6 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const DIMENSION_WIDTH = 'width';
  const DIMENSION_HEIGHT = 'height';
  const EVENT_SHOW$4 = `show${EVENT_KEY$7}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$7}`;
  const EVENT_HIDE$4 = `hide${EVENT_KEY$7}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$7}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const SELECTOR_ACTIVES = '.show, .collapsing';
  const SELECTOR_DATA_TOGGLE$3 = '[data-toggle="collapse"]';
  const Default$6 = {
    toggle: true,
    parent: ''
  };
  const DefaultType$6 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };

  /**
   * Class definition
   */

  class Collapse {
    constructor(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = [].slice.call(document.querySelectorAll(`[data-toggle="collapse"][href="#${element.id}"],` + `[data-toggle="collapse"][data-target="#${element.id}"]`));
      const toggleList = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$3));
      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = Util.getSelectorFromElement(elem);
        const filterElement = [].slice.call(document.querySelectorAll(selector)).filter(foundElem => foundElem === element);
        if (selector !== null && filterElement.length > 0) {
          this._selector = selector;
          this._triggerArray.push(elem);
        }
      }
      this._parent = this._config.parent ? this._getParent() : null;
      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }
      if (this._config.toggle) {
        this.toggle();
      }
    }

    // Getters
    static get VERSION() {
      return VERSION$7;
    }
    static get Default() {
      return Default$6;
    }

    // Public
    toggle() {
      if ($(this._element).hasClass(CLASS_NAME_SHOW$6)) {
        this.hide();
      } else {
        this.show();
      }
    }
    show() {
      if (this._isTransitioning || $(this._element).hasClass(CLASS_NAME_SHOW$6)) {
        return;
      }
      let actives;
      let activesData;
      if (this._parent) {
        actives = [].slice.call(this._parent.querySelectorAll(SELECTOR_ACTIVES)).filter(elem => {
          if (typeof this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === this._config.parent;
          }
          return elem.classList.contains(CLASS_NAME_COLLAPSE);
        });
        if (actives.length === 0) {
          actives = null;
        }
      }
      if (actives) {
        activesData = $(actives).not(this._selector).data(DATA_KEY$7);
        if (activesData && activesData._isTransitioning) {
          return;
        }
      }
      const startEvent = $.Event(EVENT_SHOW$4);
      $(this._element).trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return;
      }
      if (actives) {
        Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide');
        if (!activesData) {
          $(actives).data(DATA_KEY$7, null);
        }
      }
      const dimension = this._getDimension();
      $(this._element).removeClass(CLASS_NAME_COLLAPSE).addClass(CLASS_NAME_COLLAPSING);
      this._element.style[dimension] = 0;
      if (this._triggerArray.length) {
        $(this._triggerArray).removeClass(CLASS_NAME_COLLAPSED).attr('aria-expanded', true);
      }
      this.setTransitioning(true);
      const complete = () => {
        $(this._element).removeClass(CLASS_NAME_COLLAPSING).addClass(`${CLASS_NAME_COLLAPSE} ${CLASS_NAME_SHOW$6}`);
        this._element.style[dimension] = '';
        this.setTransitioning(false);
        $(this._element).trigger(EVENT_SHOWN$4);
      };
      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;
      const transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }
    hide() {
      if (this._isTransitioning || !$(this._element).hasClass(CLASS_NAME_SHOW$6)) {
        return;
      }
      const startEvent = $.Event(EVENT_HIDE$4);
      $(this._element).trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return;
      }
      const dimension = this._getDimension();
      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      Util.reflow(this._element);
      $(this._element).addClass(CLASS_NAME_COLLAPSING).removeClass(`${CLASS_NAME_COLLAPSE} ${CLASS_NAME_SHOW$6}`);
      const triggerArrayLength = this._triggerArray.length;
      if (triggerArrayLength > 0) {
        for (let i = 0; i < triggerArrayLength; i++) {
          const trigger = this._triggerArray[i];
          const selector = Util.getSelectorFromElement(trigger);
          if (selector !== null) {
            const $elem = $([].slice.call(document.querySelectorAll(selector)));
            if (!$elem.hasClass(CLASS_NAME_SHOW$6)) {
              $(trigger).addClass(CLASS_NAME_COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }
      this.setTransitioning(true);
      const complete = () => {
        this.setTransitioning(false);
        $(this._element).removeClass(CLASS_NAME_COLLAPSING).addClass(CLASS_NAME_COLLAPSE).trigger(EVENT_HIDDEN$4);
      };
      this._element.style[dimension] = '';
      const transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
    }
    setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    }
    dispose() {
      $.removeData(this._element, DATA_KEY$7);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    }

    // Private
    _getConfig(config) {
      config = {
        ...Default$6,
        ...config
      };
      config.toggle = Boolean(config.toggle); // Coerce string values
      Util.typeCheckConfig(NAME$7, config, DefaultType$6);
      return config;
    }
    _getDimension() {
      const hasWidth = $(this._element).hasClass(DIMENSION_WIDTH);
      return hasWidth ? DIMENSION_WIDTH : DIMENSION_HEIGHT;
    }
    _getParent() {
      let parent;
      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent;

        // It's a jQuery object
        if (this._config.parent.jquery !== undefined) {
          parent = this._config.parent[0];
        }
      } else {
        parent = document.querySelector(this._config.parent);
      }
      const selector = `[data-toggle="collapse"][data-parent="${this._config.parent}"]`;
      const children = [].slice.call(parent.querySelectorAll(selector));
      $(children).each((i, element) => {
        this._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    }
    _addAriaAndCollapsedClass(element, triggerArray) {
      const isOpen = $(element).hasClass(CLASS_NAME_SHOW$6);
      if (triggerArray.length) {
        $(triggerArray).toggleClass(CLASS_NAME_COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
      }
    }

    // Static
    static _getTargetFromElement(element) {
      const selector = Util.getSelectorFromElement(element);
      return selector ? document.querySelector(selector) : null;
    }
    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $(this);
        let data = $element.data(DATA_KEY$7);
        const _config = {
          ...Default$6,
          ...$element.data(),
          ...(typeof config === 'object' && config ? config : {})
        };
        if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
        }
        if (!data) {
          data = new Collapse(this, _config);
          $element.data(DATA_KEY$7, data);
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }
    const $trigger = $(this);
    const selector = Util.getSelectorFromElement(this);
    const selectors = [].slice.call(document.querySelectorAll(selector));
    $(selectors).each(function () {
      const $target = $(this);
      const data = $target.data(DATA_KEY$7);
      const config = data ? 'toggle' : $trigger.data();
      Collapse._jQueryInterface.call($target, config);
    });
  });

  /**
   * jQuery
   */

  $.fn[NAME$7] = Collapse._jQueryInterface;
  $.fn[NAME$7].Constructor = Collapse;
  $.fn[NAME$7].noConflict = () => {
    $.fn[NAME$7] = JQUERY_NO_CONFLICT$7;
    return Collapse._jQueryInterface;
  };

  var top = 'top';
  var bottom = 'bottom';
  var right = 'right';
  var left = 'left';
  var auto = 'auto';
  var basePlacements = [top, bottom, right, left];
  var start = 'start';
  var end = 'end';
  var clippingParents = 'clippingParents';
  var viewport = 'viewport';
  var popper = 'popper';
  var reference = 'reference';
  var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []); // modifiers that need to read the DOM

  var beforeRead = 'beforeRead';
  var read = 'read';
  var afterRead = 'afterRead'; // pure-logic modifiers

  var beforeMain = 'beforeMain';
  var main = 'main';
  var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

  var beforeWrite = 'beforeWrite';
  var write = 'write';
  var afterWrite = 'afterWrite';
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  function getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
  }

  function getWindow(node) {
    if (node == null) {
      return window;
    }

    if (node.toString() !== '[object Window]') {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }

    return node;
  }

  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }

  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }

  function isShadowRoot(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }

    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  // and applies them to the HTMLElements such as popper and arrow

  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function (name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name]; // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe[cannot-write]


      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];

        if (value === false) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value === true ? '' : value);
        }
      });
    });
  }

  function effect$2(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }

    return function () {
      Object.keys(state.elements).forEach(function (name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

        var style = styleProperties.reduce(function (style, property) {
          style[property] = '';
          return style;
        }, {}); // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }

        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  } // eslint-disable-next-line import/no-unused-modules


  const applyStyles$1 = {
    name: 'applyStyles',
    enabled: true,
    phase: 'write',
    fn: applyStyles,
    effect: effect$2,
    requires: ['computeStyles']
  };

  function getBasePlacement(placement) {
    return placement.split('-')[0];
  }

  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  function getUAString() {
    var uaData = navigator.userAgentData;

    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
      return uaData.brands.map(function (item) {
        return item.brand + "/" + item.version;
      }).join(' ');
    }

    return navigator.userAgent;
  }

  function isLayoutViewport() {
    return !/^((?!chrome|android).)*safari/i.test(getUAString());
  }

  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false;
    }

    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }

    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;

    if (includeScale && isHTMLElement(element)) {
      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
    }

    var _ref = isElement(element) ? getWindow(element) : window,
        visualViewport = _ref.visualViewport;

    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
    var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
    var width = clientRect.width / scaleX;
    var height = clientRect.height / scaleY;
    return {
      width: width,
      height: height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x: x,
      y: y
    };
  }

  // means it doesn't take into account transforms.

  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }

    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }

    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height
    };
  }

  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

    if (parent.contains(child)) {
      return true;
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
        var next = child;

        do {
          if (next && parent.isSameNode(next)) {
            return true;
          } // $FlowFixMe[prop-missing]: need a better way to handle this...


          next = next.parentNode || next.host;
        } while (next);
      } // Give up, the result is false


    return false;
  }

  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function isTableElement(element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
  }

  function getDocumentElement(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
    element.document) || window.document).documentElement;
  }

  function getParentNode(element) {
    if (getNodeName(element) === 'html') {
      return element;
    }

    return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || ( // DOM Element detected
      isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element) // fallback

    );
  }

  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle(element).position === 'fixed') {
      return null;
    }

    return element.offsetParent;
  } // `.offsetParent` reports `null` for fixed elements, while absolute elements
  // return the containing block


  function getContainingBlock(element) {
    var isFirefox = /firefox/i.test(getUAString());
    var isIE = /Trident/i.test(getUAString());

    if (isIE && isHTMLElement(element)) {
      // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
      var elementCss = getComputedStyle(element);

      if (elementCss.position === 'fixed') {
        return null;
      }
    }

    var currentNode = getParentNode(element);

    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }

    while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
      // create a containing block.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }

    return null;
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.


  function getOffsetParent(element) {
    var window = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);

    while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
      return window;
    }

    return offsetParent || getContainingBlock(element) || window;
  }

  function getMainAxisFromPlacement(placement) {
    return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
  }

  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }
  function withinMaxClamp(min, value, max) {
    var v = within(min, value, max);
    return v > max ? max : v;
  }

  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  function expandToHashMap(value, keys) {
    return keys.reduce(function (hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  var toPaddingObject = function toPaddingObject(padding, state) {
    padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  };

  function arrow(_ref) {
    var _state$modifiersData$;

    var state = _ref.state,
        name = _ref.name,
        options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? 'height' : 'width';

    if (!arrowElement || !popperOffsets) {
      return;
    }

    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === 'y' ? top : left;
    var maxProp = axis === 'y' ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds

    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = within(min, center, max); // Prevents breaking syntax highlighting...

    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
  }

  function effect$1(_ref2) {
    var state = _ref2.state,
        options = _ref2.options;
    var _options$element = options.element,
        arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

    if (arrowElement == null) {
      return;
    } // CSS selector


    if (typeof arrowElement === 'string') {
      arrowElement = state.elements.popper.querySelector(arrowElement);

      if (!arrowElement) {
        return;
      }
    }

    if (!contains(state.elements.popper, arrowElement)) {
      return;
    }

    state.elements.arrow = arrowElement;
  } // eslint-disable-next-line import/no-unused-modules


  const arrow$1 = {
    name: 'arrow',
    enabled: true,
    phase: 'main',
    fn: arrow,
    effect: effect$1,
    requires: ['popperOffsets'],
    requiresIfExists: ['preventOverflow']
  };

  function getVariation(placement) {
    return placement.split('-')[1];
  }

  var unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  }; // Round the offsets to the nearest suitable subpixel based on the DPR.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.

  function roundOffsetsByDPR(_ref, win) {
    var x = _ref.x,
        y = _ref.y;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(x * dpr) / dpr || 0,
      y: round(y * dpr) / dpr || 0
    };
  }

  function mapToStyles(_ref2) {
    var _Object$assign2;

    var popper = _ref2.popper,
        popperRect = _ref2.popperRect,
        placement = _ref2.placement,
        variation = _ref2.variation,
        offsets = _ref2.offsets,
        position = _ref2.position,
        gpuAcceleration = _ref2.gpuAcceleration,
        adaptive = _ref2.adaptive,
        roundOffsets = _ref2.roundOffsets,
        isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x,
        x = _offsets$x === void 0 ? 0 : _offsets$x,
        _offsets$y = offsets.y,
        y = _offsets$y === void 0 ? 0 : _offsets$y;

    var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
      x: x,
      y: y
    }) : {
      x: x,
      y: y
    };

    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty('x');
    var hasY = offsets.hasOwnProperty('y');
    var sideX = left;
    var sideY = top;
    var win = window;

    if (adaptive) {
      var offsetParent = getOffsetParent(popper);
      var heightProp = 'clientHeight';
      var widthProp = 'clientWidth';

      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper);

        if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
          heightProp = 'scrollHeight';
          widthProp = 'scrollWidth';
        }
      } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


      offsetParent = offsetParent;

      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom;
        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
        offsetParent[heightProp];
        y -= offsetY - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }

      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right;
        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
        offsetParent[widthProp];
        x -= offsetX - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }

    var commonStyles = Object.assign({
      position: position
    }, adaptive && unsetSides);

    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
      x: x,
      y: y
    }, getWindow(popper)) : {
      x: x,
      y: y
    };

    x = _ref4.x;
    y = _ref4.y;

    if (gpuAcceleration) {
      var _Object$assign;

      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }

    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
  }

  function computeStyles(_ref5) {
    var state = _ref5.state,
        options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration,
        gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
        _options$adaptive = options.adaptive,
        adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
        _options$roundOffsets = options.roundOffsets,
        roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration,
      isFixed: state.options.strategy === 'fixed'
    };

    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
      })));
    }

    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets: roundOffsets
      })));
    }

    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-placement': state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  const computeStyles$1 = {
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: computeStyles,
    data: {}
  };

  var passive = {
    passive: true
  };

  function effect(_ref) {
    var state = _ref.state,
        instance = _ref.instance,
        options = _ref.options;
    var _options$scroll = options.scroll,
        scroll = _options$scroll === void 0 ? true : _options$scroll,
        _options$resize = options.resize,
        resize = _options$resize === void 0 ? true : _options$resize;
    var window = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.addEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.addEventListener('resize', instance.update, passive);
    }

    return function () {
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.removeEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.removeEventListener('resize', instance.update, passive);
      }
    };
  } // eslint-disable-next-line import/no-unused-modules


  const eventListeners = {
    name: 'eventListeners',
    enabled: true,
    phase: 'write',
    fn: function fn() {},
    effect: effect,
    data: {}
  };

  var hash$1 = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash$1[matched];
    });
  }

  var hash = {
    start: 'end',
    end: 'start'
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function (matched) {
      return hash[matched];
    });
  }

  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  function getViewportRect(element, strategy) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0;

    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      var layoutViewport = isLayoutViewport();

      if (layoutViewport || !layoutViewport && strategy === 'fixed') {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    return {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y
    };
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  function getDocumentRect(element) {
    var _element$ownerDocumen;

    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;

    if (getComputedStyle(body || html).direction === 'rtl') {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }

  function isScrollParent(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = getComputedStyle(element),
        overflow = _getComputedStyle.overflow,
        overflowX = _getComputedStyle.overflowX,
        overflowY = _getComputedStyle.overflowY;

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  function getScrollParent(node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }

    return getScrollParent(getParentNode(node));
  }

  /*
  given a DOM element, return the list of all scroll parents, up the list of ancesors
  until we get to the top window object. This list is what we attach scroll listeners
  to, because if any of these parent elements scroll, we'll need to re-calculate the
  reference element's position.
  */

  function listScrollParents(element, list) {
    var _element$ownerDocumen;

    if (list === void 0) {
      list = [];
    }

    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)));
  }

  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }

  function getInnerBoundingClientRect(element, strategy) {
    var rect = getBoundingClientRect(element, false, strategy === 'fixed');
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }

  function getClientRectFromMixedType(element, clippingParent, strategy) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  } // A "clipping parent" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`


  function getClippingParents(element) {
    var clippingParents = listScrollParents(getParentNode(element));
    var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

    if (!isElement(clipperElement)) {
      return [];
    } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


    return clippingParents.filter(function (clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
    });
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping parents


  function getClippingRect(element, boundary, rootBoundary, strategy) {
    var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent, strategy));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  function computeOffsets(_ref) {
    var reference = _ref.reference,
        element = _ref.element,
        placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;

    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        };
        break;

      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;

      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;

      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        break;

      default:
        offsets = {
          x: reference.x,
          y: reference.y
        };
    }

    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

    if (mainAxis != null) {
      var len = mainAxis === 'y' ? 'height' : 'width';

      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;

        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
          break;
      }
    }

    return offsets;
  }

  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$placement = _options.placement,
        placement = _options$placement === void 0 ? state.placement : _options$placement,
        _options$strategy = _options.strategy,
        strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
        _options$boundary = _options.boundary,
        boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
        _options$rootBoundary = _options.rootBoundary,
        rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
        _options$elementConte = _options.elementContext,
        elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
        _options$altBoundary = _options.altBoundary,
        altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
        _options$padding = _options.padding,
        padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
    var referenceClientRect = getBoundingClientRect(state.elements.reference);
    var popperOffsets = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      placement: placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect

    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

    if (elementContext === popper && offsetData) {
      var offset = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function (key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
        overflowOffsets[key] += offset[axis] * multiply;
      });
    }

    return overflowOffsets;
  }

  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        placement = _options.placement,
        boundary = _options.boundary,
        rootBoundary = _options.rootBoundary,
        padding = _options.padding,
        flipVariations = _options.flipVariations,
        _options$allowedAutoP = _options.allowedAutoPlacements,
        allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
      return getVariation(placement) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function (placement) {
      return allowedAutoPlacements.indexOf(placement) >= 0;
    });

    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


    var overflows = allowedPlacements.reduce(function (acc, placement) {
      acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding
      })[getBasePlacement(placement)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function (a, b) {
      return overflows[a] - overflows[b];
    });
  }

  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }

    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }

  function flip(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;

    if (state.modifiersData[name]._skip) {
      return;
    }

    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
        specifiedFallbackPlacements = options.fallbackPlacements,
        padding = options.padding,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        _options$flipVariatio = options.flipVariations,
        flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
        allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
      return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        flipVariations: flipVariations,
        allowedAutoPlacements: allowedAutoPlacements
      }) : placement);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];

    for (var i = 0; i < placements.length; i++) {
      var placement = placements[i];

      var _basePlacement = getBasePlacement(placement);

      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? 'width' : 'height';
      var overflow = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }

      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];

      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }

      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }

      if (checks.every(function (check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }

      checksMap.set(placement, checks);
    }

    if (makeFallbackChecks) {
      // `2` may be desired in some cases – research later
      var numberOfChecks = flipVariations ? 3 : 1;

      var _loop = function _loop(_i) {
        var fittingPlacement = placements.find(function (placement) {
          var checks = checksMap.get(placement);

          if (checks) {
            return checks.slice(0, _i).every(function (check) {
              return check;
            });
          }
        });

        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };

      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);

        if (_ret === "break") break;
      }
    }

    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  } // eslint-disable-next-line import/no-unused-modules


  const flip$1 = {
    name: 'flip',
    enabled: true,
    phase: 'main',
    fn: flip,
    requiresIfExists: ['offset'],
    data: {
      _skip: false
    }
  };

  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }

    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }

  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function (side) {
      return overflow[side] >= 0;
    });
  }

  function hide(_ref) {
    var state = _ref.state,
        name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: 'reference'
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-reference-hidden': isReferenceHidden,
      'data-popper-escaped': hasPopperEscaped
    });
  } // eslint-disable-next-line import/no-unused-modules


  const hide$1 = {
    name: 'hide',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['preventOverflow'],
    fn: hide
  };

  function distanceAndSkiddingToXY(placement, rects, offset) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

    var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
      placement: placement
    })) : offset,
        skidding = _ref[0],
        distance = _ref[1];

    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }

  function offset(_ref2) {
    var state = _ref2.state,
        options = _ref2.options,
        name = _ref2.name;
    var _options$offset = options.offset,
        offset = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function (acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement],
        x = _data$state$placement.x,
        y = _data$state$placement.y;

    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  const offset$1 = {
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: ['popperOffsets'],
    fn: offset
  };

  function popperOffsets(_ref) {
    var state = _ref.state,
        name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      placement: state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  const popperOffsets$1 = {
    name: 'popperOffsets',
    enabled: true,
    phase: 'read',
    fn: popperOffsets,
    data: {}
  };

  function getAltAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }

  function preventOverflow(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;
    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        padding = options.padding,
        _options$tether = options.tether,
        tether = _options$tether === void 0 ? true : _options$tether,
        _options$tetherOffset = options.tetherOffset,
        tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
      mainAxis: tetherOffsetValue,
      altAxis: tetherOffsetValue
    } : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
    var data = {
      x: 0,
      y: 0
    };

    if (!popperOffsets) {
      return;
    }

    if (checkMainAxis) {
      var _offsetModifierState$;

      var mainSide = mainAxis === 'y' ? top : left;
      var altSide = mainAxis === 'y' ? bottom : right;
      var len = mainAxis === 'y' ? 'height' : 'width';
      var offset = popperOffsets[mainAxis];
      var min$1 = offset + overflow[mainSide];
      var max$1 = offset - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
      // outside the reference bounds

      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
      // to include its full size in the calculation. If the reference is small
      // and near the edge of a boundary, the popper can overflow even if the
      // reference is not overflowing as well (e.g. virtual elements with no
      // width or height)

      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
      var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = offset + maxOffset - offsetModifierValue;
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _offsetModifierState$2;

      var _mainSide = mainAxis === 'x' ? top : left;

      var _altSide = mainAxis === 'x' ? bottom : right;

      var _offset = popperOffsets[altAxis];

      var _len = altAxis === 'y' ? 'height' : 'width';

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

      var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  const preventOverflow$1 = {
    name: 'preventOverflow',
    enabled: true,
    phase: 'main',
    fn: preventOverflow,
    requiresIfExists: ['offset']
  };

  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round(rect.width) / element.offsetWidth || 1;
    var scaleY = round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  } // Returns the composite rect of an element relative to its offsetParent.
  // Composite means it takes into account transforms as well as layout.


  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  function order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively

    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);

          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier);
      }
    });
    return result;
  }

  function orderModifiers(modifiers) {
    // order based on dependencies
    var orderedModifiers = order(modifiers); // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(orderedModifiers.filter(function (modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  function debounce(fn) {
    var pending;
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined;
            resolve(fn());
          });
        });
      }

      return pending;
    };
  }

  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function (merged, current) {
      var existing = merged[current.name];
      merged[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged;
    }, {}); // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key];
    });
  }

  var DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
  };

  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === 'function');
    });
  }

  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
        _generatorOptions$def = _generatorOptions.defaultModifiers,
        defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
        _generatorOptions$def2 = _generatorOptions.defaultOptions,
        defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state,
        setOptions: function setOptions(setOptionsAction) {
          var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, state.options, options);
          state.scrollParents = {
            reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
            popper: listScrollParents(popper)
          }; // Orders the modifiers based on their dependencies and `phase`
          // properties

          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled;
          });
          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }

          var _state$elements = state.elements,
              reference = _state$elements.reference,
              popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {
            return;
          } // Store the reference and popper rects to be read by modifiers


          state.rects = {
            reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect(popper)
          }; // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false;
          state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });

          for (var index = 0; index < state.orderedModifiers.length; index++) {
            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }

            var _state$orderedModifie = state.orderedModifiers[index],
                fn = _state$orderedModifie.fn,
                _state$orderedModifie2 = _state$orderedModifie.options,
                _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                name = _state$orderedModifie.name;

            if (typeof fn === 'function') {
              state = fn({
                state: state,
                options: _options,
                name: name,
                instance: instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };

      if (!areValidElements(reference, popper)) {
        return instance;
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state);
        }
      }); // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      function runModifierEffects() {
        state.orderedModifiers.forEach(function (_ref) {
          var name = _ref.name,
              _ref$options = _ref.options,
              options = _ref$options === void 0 ? {} : _ref$options,
              effect = _ref.effect;

          if (typeof effect === 'function') {
            var cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options
            });

            var noopFn = function noopFn() {};

            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }

      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function (fn) {
          return fn();
        });
        effectCleanupFns = [];
      }

      return instance;
    };
  }

  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
  var createPopper = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers
  }); // eslint-disable-next-line import/no-unused-modules

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$6 = 'dropdown';
  const VERSION$6 = '4.6.2';
  const DATA_KEY$6 = 'bs.dropdown';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const JQUERY_NO_CONFLICT$6 = $.fn[NAME$6];
  const ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key
  const SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key
  const TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key
  const ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
  const ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
  const RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)
  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE$1}`);
  const CLASS_NAME_DISABLED$1 = 'disabled';
  const CLASS_NAME_SHOW$5 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPRIGHT = 'dropright';
  const CLASS_NAME_DROPLEFT = 'dropleft';
  const CLASS_NAME_MENURIGHT = 'dropdown-menu-right';
  const CLASS_NAME_POSITION_STATIC = 'position-static';
  const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
  const EVENT_CLICK = `click${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const SELECTOR_DATA_TOGGLE$2 = '[data-toggle="dropdown"]';
  const SELECTOR_FORM_CHILD = '.dropdown form';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = 'top-start';
  const PLACEMENT_TOPEND = 'top-end';
  const PLACEMENT_BOTTOM = 'bottom-start';
  const PLACEMENT_BOTTOMEND = 'bottom-end';
  const PLACEMENT_RIGHT = 'right-start';
  const PLACEMENT_LEFT = 'left-start';
  const Default$5 = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null
  };
  const DefaultType$5 = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string',
    popperConfig: '(null|object)'
  };

  /**
   * Class definition
   */

  class Dropdown {
    constructor(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();
      this._addEventListeners();
    }

    // Getters
    static get VERSION() {
      return VERSION$6;
    }
    static get Default() {
      return Default$5;
    }
    static get DefaultType() {
      return DefaultType$5;
    }

    // Public
    toggle() {
      if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED$1)) {
        return;
      }
      const isActive = $(this._menu).hasClass(CLASS_NAME_SHOW$5);
      Dropdown._clearMenus();
      if (isActive) {
        return;
      }
      this.show(true);
    }
    show(usePopper = false) {
      if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED$1) || $(this._menu).hasClass(CLASS_NAME_SHOW$5)) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = $.Event(EVENT_SHOW$3, relatedTarget);
      const parent = Dropdown._getParentFromElement(this._element);
      $(parent).trigger(showEvent);
      if (showEvent.isDefaultPrevented()) {
        return;
      }

      // Totally disable Popper for Dropdowns in Navbar
      if (!this._inNavbar && usePopper) {
        // Check for Popper dependency
        if (createPopper === undefined) {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
        }
        let referenceElement = this._element;
        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this._config.reference)) {
          referenceElement = this._config.reference;

          // Check if it's jQuery element
          if (this._config.reference.jquery !== undefined) {
            referenceElement = this._config.reference[0];
          }
        }

        // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251
        if (this._config.boundary !== 'scrollParent') {
          $(parent).addClass(CLASS_NAME_POSITION_STATIC);
        }
        this._popper = createPopper(referenceElement, this._menu, this._getPopperConfig());
      }

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement && $(parent).closest(SELECTOR_NAVBAR_NAV).length === 0) {
        $(document.body).children().on('mouseover', null, $.noop);
      }
      this._element.focus();
      this._element.setAttribute('aria-expanded', true);
      $(this._menu).toggleClass(CLASS_NAME_SHOW$5);
      $(parent).toggleClass(CLASS_NAME_SHOW$5).trigger($.Event(EVENT_SHOWN$3, relatedTarget));
    }
    hide() {
      if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED$1) || !$(this._menu).hasClass(CLASS_NAME_SHOW$5)) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      const hideEvent = $.Event(EVENT_HIDE$3, relatedTarget);
      const parent = Dropdown._getParentFromElement(this._element);
      $(parent).trigger(hideEvent);
      if (hideEvent.isDefaultPrevented()) {
        return;
      }
      if (this._popper) {
        this._popper.destroy();
      }
      $(this._menu).toggleClass(CLASS_NAME_SHOW$5);
      $(parent).toggleClass(CLASS_NAME_SHOW$5).trigger($.Event(EVENT_HIDDEN$3, relatedTarget));
    }
    dispose() {
      $.removeData(this._element, DATA_KEY$6);
      $(this._element).off(EVENT_KEY$6);
      this._element = null;
      this._menu = null;
      if (this._popper !== null) {
        this._popper.destroy();
        this._popper = null;
      }
    }
    update() {
      this._inNavbar = this._detectNavbar();
      if (this._popper !== null) {
        this._popper.update();
      }
    }

    // Private
    _addEventListeners() {
      $(this._element).on(EVENT_CLICK, event => {
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
      });
    }
    _getConfig(config) {
      config = {
        ...this.constructor.Default,
        ...$(this._element).data(),
        ...config
      };
      Util.typeCheckConfig(NAME$6, config, this.constructor.DefaultType);
      return config;
    }
    _getMenuElement() {
      if (!this._menu) {
        const parent = Dropdown._getParentFromElement(this._element);
        if (parent) {
          this._menu = parent.querySelector(SELECTOR_MENU);
        }
      }
      return this._menu;
    }
    _getPlacement() {
      const $parentDropdown = $(this._element.parentNode);
      let placement = PLACEMENT_BOTTOM;

      // Handle dropup
      if ($parentDropdown.hasClass(CLASS_NAME_DROPUP)) {
        placement = $(this._menu).hasClass(CLASS_NAME_MENURIGHT) ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      } else if ($parentDropdown.hasClass(CLASS_NAME_DROPRIGHT)) {
        placement = PLACEMENT_RIGHT;
      } else if ($parentDropdown.hasClass(CLASS_NAME_DROPLEFT)) {
        placement = PLACEMENT_LEFT;
      } else if ($(this._menu).hasClass(CLASS_NAME_MENURIGHT)) {
        placement = PLACEMENT_BOTTOMEND;
      }
      return placement;
    }
    _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0;
    }
    _getOffset() {
      if (typeof this._config.offset === 'function') {
        return popperData => this._config.offset(popperData, this._element);
      }
      if (typeof this._config.offset === 'string') {
        return this._config.offset.split(',').map(value => Number.parseInt(value, 10));
      }
      return this._config.offset;
    }
    _getPopperConfig() {
      const boundary = this._config.boundary === 'scrollParent' ? 'clippingParents' : this._config.boundary;
      const popperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'flip',
          enabled: this._config.flip
        }, {
          name: 'preventOverflow',
          options: {
            boundary
          }
        }, {
          name: 'applyStyles',
          enabled: this._config.display !== 'static'
        }]
      };
      const customConfig = typeof this._config.popperConfig === 'function' ? this._config.popperConfig(popperConfig) : this._config.popperConfig;
      return {
        ...popperConfig,
        ...customConfig
      };
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY$6);
        const _config = typeof config === 'object' ? config : null;
        if (!data) {
          data = new Dropdown(this, _config);
          $(this).data(DATA_KEY$6, data);
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
    static _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }
      const toggles = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$2));
      for (let i = 0, len = toggles.length; i < len; i++) {
        const parent = Dropdown._getParentFromElement(toggles[i]);
        const context = $(toggles[i]).data(DATA_KEY$6);
        const relatedTarget = {
          relatedTarget: toggles[i]
        };
        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }
        if (!context) {
          continue;
        }
        const dropdownMenu = context._menu;
        if (!$(parent).hasClass(CLASS_NAME_SHOW$5)) {
          continue;
        }
        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
          continue;
        }
        const hideEvent = $.Event(EVENT_HIDE$3, relatedTarget);
        $(parent).trigger(hideEvent);
        if (hideEvent.isDefaultPrevented()) {
          continue;
        }

        // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().off('mouseover', null, $.noop);
        }
        toggles[i].setAttribute('aria-expanded', 'false');
        if (context._popper) {
          context._popper.destroy();
        }
        $(dropdownMenu).removeClass(CLASS_NAME_SHOW$5);
        $(parent).removeClass(CLASS_NAME_SHOW$5).trigger($.Event(EVENT_HIDDEN$3, relatedTarget));
      }
    }
    static _getParentFromElement(element) {
      let parent;
      const selector = Util.getSelectorFromElement(element);
      if (selector) {
        parent = document.querySelector(selector);
      }
      return parent || element.parentNode;
    }

    // eslint-disable-next-line complexity
    static _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE$1 && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $(event.target).closest(SELECTOR_MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return;
      }
      if (this.disabled || $(this).hasClass(CLASS_NAME_DISABLED$1)) {
        return;
      }
      const parent = Dropdown._getParentFromElement(this);
      const isActive = $(parent).hasClass(CLASS_NAME_SHOW$5);
      if (!isActive && event.which === ESCAPE_KEYCODE$1) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (!isActive || event.which === ESCAPE_KEYCODE$1 || event.which === SPACE_KEYCODE) {
        if (event.which === ESCAPE_KEYCODE$1) {
          $(parent.querySelector(SELECTOR_DATA_TOGGLE$2)).trigger('focus');
        }
        $(this).trigger('click');
        return;
      }
      const items = [].slice.call(parent.querySelectorAll(SELECTOR_VISIBLE_ITEMS)).filter(item => $(item).is(':visible'));
      if (items.length === 0) {
        return;
      }
      let index = items.indexOf(event.target);
      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // Up
        index--;
      }
      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // Down
        index++;
      }
      if (index < 0) {
        index = 0;
      }
      items[index].focus();
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$2, Dropdown._dataApiKeydownHandler).on(EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown._dataApiKeydownHandler).on(`${EVENT_CLICK_DATA_API$2} ${EVENT_KEYUP_DATA_API}`, Dropdown._clearMenus).on(EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    event.preventDefault();
    event.stopPropagation();
    Dropdown._jQueryInterface.call($(this), 'toggle');
  }).on(EVENT_CLICK_DATA_API$2, SELECTOR_FORM_CHILD, e => {
    e.stopPropagation();
  });

  /**
   * jQuery
   */

  $.fn[NAME$6] = Dropdown._jQueryInterface;
  $.fn[NAME$6].Constructor = Dropdown;
  $.fn[NAME$6].noConflict = () => {
    $.fn[NAME$6] = JQUERY_NO_CONFLICT$6;
    return Dropdown._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$5 = 'modal';
  const VERSION$5 = '4.6.2';
  const DATA_KEY$5 = 'bs.modal';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const DATA_API_KEY$2 = '.data-api';
  const JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];
  const ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  const CLASS_NAME_SCROLLABLE = 'modal-dialog-scrollable';
  const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure';
  const CLASS_NAME_BACKDROP = 'modal-backdrop';
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$4 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$5}`;
  const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
  const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
  const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY$5}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$5}`;
  const EVENT_CLICK_DISMISS$1 = `click.dismiss${EVENT_KEY$5}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$5}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$5}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$1 = '[data-toggle="modal"]';
  const SELECTOR_DATA_DISMISS$1 = '[data-dismiss="modal"]';
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';
  const Default$4 = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  const DefaultType$4 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };

  /**
   * Class definition
   */

  class Modal {
    constructor(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = element.querySelector(SELECTOR_DIALOG);
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollbarWidth = 0;
    }

    // Getters
    static get VERSION() {
      return VERSION$5;
    }
    static get Default() {
      return Default$4;
    }

    // Public
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }
      const showEvent = $.Event(EVENT_SHOW$2, {
        relatedTarget
      });
      $(this._element).trigger(showEvent);
      if (showEvent.isDefaultPrevented()) {
        return;
      }
      this._isShown = true;
      if ($(this._element).hasClass(CLASS_NAME_FADE$4)) {
        this._isTransitioning = true;
      }
      this._checkScrollbar();
      this._setScrollbar();
      this._adjustDialog();
      this._setEscapeEvent();
      this._setResizeEvent();
      $(this._element).on(EVENT_CLICK_DISMISS$1, SELECTOR_DATA_DISMISS$1, event => this.hide(event));
      $(this._dialog).on(EVENT_MOUSEDOWN_DISMISS, () => {
        $(this._element).one(EVENT_MOUSEUP_DISMISS, event => {
          if ($(event.target).is(this._element)) {
            this._ignoreBackdropClick = true;
          }
        });
      });
      this._showBackdrop(() => this._showElement(relatedTarget));
    }
    hide(event) {
      if (event) {
        event.preventDefault();
      }
      if (!this._isShown || this._isTransitioning) {
        return;
      }
      const hideEvent = $.Event(EVENT_HIDE$2);
      $(this._element).trigger(hideEvent);
      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }
      this._isShown = false;
      const transition = $(this._element).hasClass(CLASS_NAME_FADE$4);
      if (transition) {
        this._isTransitioning = true;
      }
      this._setEscapeEvent();
      this._setResizeEvent();
      $(document).off(EVENT_FOCUSIN);
      $(this._element).removeClass(CLASS_NAME_SHOW$4);
      $(this._element).off(EVENT_CLICK_DISMISS$1);
      $(this._dialog).off(EVENT_MOUSEDOWN_DISMISS);
      if (transition) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, event => this._hideModal(event)).emulateTransitionEnd(transitionDuration);
      } else {
        this._hideModal();
      }
    }
    dispose() {
      [globalThis, this._element, this._dialog].forEach(htmlElement => $(htmlElement).off(EVENT_KEY$5));

      /**
       * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `EVENT_CLICK_DATA_API` event that should remain
       */
      $(document).off(EVENT_FOCUSIN);
      $.removeData(this._element, DATA_KEY$5);
      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._isTransitioning = null;
      this._scrollbarWidth = null;
    }
    handleUpdate() {
      this._adjustDialog();
    }

    // Private
    _getConfig(config) {
      config = {
        ...Default$4,
        ...config
      };
      Util.typeCheckConfig(NAME$5, config, DefaultType$4);
      return config;
    }
    _triggerBackdropTransition() {
      const hideEventPrevented = $.Event(EVENT_HIDE_PREVENTED);
      $(this._element).trigger(hideEventPrevented);
      if (hideEventPrevented.isDefaultPrevented()) {
        return;
      }
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      if (!isModalOverflowing) {
        this._element.style.overflowY = 'hidden';
      }
      this._element.classList.add(CLASS_NAME_STATIC);
      const modalTransitionDuration = Util.getTransitionDurationFromElement(this._dialog);
      $(this._element).off(Util.TRANSITION_END);
      $(this._element).one(Util.TRANSITION_END, () => {
        this._element.classList.remove(CLASS_NAME_STATIC);
        if (!isModalOverflowing) {
          $(this._element).one(Util.TRANSITION_END, () => {
            this._element.style.overflowY = '';
          }).emulateTransitionEnd(this._element, modalTransitionDuration);
        }
      }).emulateTransitionEnd(modalTransitionDuration);
      this._element.focus();
    }
    _showElement(relatedTarget) {
      const transition = $(this._element).hasClass(CLASS_NAME_FADE$4);
      const modalBody = this._dialog ? this._dialog.querySelector(SELECTOR_MODAL_BODY) : null;
      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }
      this._element.style.display = 'block';
      this._element.removeAttribute('aria-hidden');
      this._element.setAttribute('aria-modal', true);
      this._element.setAttribute('role', 'dialog');
      if ($(this._dialog).hasClass(CLASS_NAME_SCROLLABLE) && modalBody) {
        modalBody.scrollTop = 0;
      } else {
        this._element.scrollTop = 0;
      }
      if (transition) {
        Util.reflow(this._element);
      }
      $(this._element).addClass(CLASS_NAME_SHOW$4);
      if (this._config.focus) {
        this._enforceFocus();
      }
      const shownEvent = $.Event(EVENT_SHOWN$2, {
        relatedTarget
      });
      const transitionComplete = () => {
        if (this._config.focus) {
          this._element.focus();
        }
        this._isTransitioning = false;
        $(this._element).trigger(shownEvent);
      };
      if (transition) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._dialog);
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    }
    _enforceFocus() {
      $(document).off(EVENT_FOCUSIN) // Guard against infinite focus loop
      .on(EVENT_FOCUSIN, event => {
        if (document !== event.target && this._element !== event.target && $(this._element).has(event.target).length === 0) {
          this._element.focus();
        }
      });
    }
    _setEscapeEvent() {
      if (this._isShown) {
        $(this._element).on(EVENT_KEYDOWN_DISMISS, event => {
          if (this._config.keyboard && event.which === ESCAPE_KEYCODE) {
            event.preventDefault();
            this.hide();
          } else if (!this._config.keyboard && event.which === ESCAPE_KEYCODE) {
            this._triggerBackdropTransition();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(EVENT_KEYDOWN_DISMISS);
      }
    }
    _setResizeEvent() {
      if (this._isShown) {
        $(globalThis).on(EVENT_RESIZE, event => this.handleUpdate(event));
      } else {
        $(globalThis).off(EVENT_RESIZE);
      }
    }
    _hideModal() {
      this._element.style.display = 'none';
      this._element.setAttribute('aria-hidden', true);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      this._isTransitioning = false;
      this._showBackdrop(() => {
        $(document.body).removeClass(CLASS_NAME_OPEN);
        this._resetAdjustments();
        this._resetScrollbar();
        $(this._element).trigger(EVENT_HIDDEN$2);
      });
    }
    _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    }
    _showBackdrop(callback) {
      const animate = $(this._element).hasClass(CLASS_NAME_FADE$4) ? CLASS_NAME_FADE$4 : '';
      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = CLASS_NAME_BACKDROP;
        if (animate) {
          this._backdrop.classList.add(animate);
        }
        $(this._backdrop).appendTo(document.body);
        $(this._element).on(EVENT_CLICK_DISMISS$1, event => {
          if (this._ignoreBackdropClick) {
            this._ignoreBackdropClick = false;
            return;
          }
          if (event.target !== event.currentTarget) {
            return;
          }
          if (this._config.backdrop === 'static') {
            this._triggerBackdropTransition();
          } else {
            this.hide();
          }
        });
        if (animate) {
          Util.reflow(this._backdrop);
        }
        $(this._backdrop).addClass(CLASS_NAME_SHOW$4);
        if (!callback) {
          return;
        }
        if (!animate) {
          callback();
          return;
        }
        const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(CLASS_NAME_SHOW$4);
        const callbackRemove = () => {
          this._removeBackdrop();
          if (callback) {
            callback();
          }
        };
        if ($(this._element).hasClass(CLASS_NAME_FADE$4)) {
          const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    }

    // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------

    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = `${this._scrollbarWidth}px`;
      }
      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = `${this._scrollbarWidth}px`;
      }
    }
    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    }
    _checkScrollbar() {
      const rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    }
    _setScrollbar() {
      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
        const stickyContent = [].slice.call(document.querySelectorAll(SELECTOR_STICKY_CONTENT));

        // Adjust fixed content padding
        $(fixedContent).each((index, element) => {
          const actualPadding = element.style.paddingRight;
          const calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`);
        });

        // Adjust sticky content margin
        $(stickyContent).each((index, element) => {
          const actualMargin = element.style.marginRight;
          const calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', `${parseFloat(calculatedMargin) - this._scrollbarWidth}px`);
        });

        // Adjust body padding
        const actualPadding = document.body.style.paddingRight;
        const calculatedPadding = $(document.body).css('padding-right');
        $(document.body).data('padding-right', actualPadding).css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`);
      }
      $(document.body).addClass(CLASS_NAME_OPEN);
    }
    _resetScrollbar() {
      // Restore fixed content padding
      const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
      $(fixedContent).each((index, element) => {
        const padding = $(element).data('padding-right');
        $(element).removeData('padding-right');
        element.style.paddingRight = padding ? padding : '';
      });

      // Restore sticky content
      const elements = [].slice.call(document.querySelectorAll(`${SELECTOR_STICKY_CONTENT}`));
      $(elements).each((index, element) => {
        const margin = $(element).data('margin-right');
        if (margin !== undefined) {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      });

      // Restore body padding
      const padding = $(document.body).data('padding-right');
      $(document.body).removeData('padding-right');
      document.body.style.paddingRight = padding ? padding : '';
    }
    _getScrollbarWidth() {
      // thx d.walsh
      const scrollDiv = document.createElement('div');
      scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    // Static
    static _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY$5);
        const _config = {
          ...Default$4,
          ...$(this).data(),
          ...(typeof config === 'object' && config ? config : {})
        };
        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY$5, data);
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    let target;
    const selector = Util.getSelectorFromElement(this);
    if (selector) {
      target = document.querySelector(selector);
    }
    const config = $(target).data(DATA_KEY$5) ? 'toggle' : {
      ...$(target).data(),
      ...$(this).data()
    };
    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }
    const $target = $(target).one(EVENT_SHOW$2, showEvent => {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return;
      }
      $target.one(EVENT_HIDDEN$2, () => {
        if ($(this).is(':visible')) {
          this.focus();
        }
      });
    });
    Modal._jQueryInterface.call($(target), config, this);
  });

  /**
   * jQuery
   */

  $.fn[NAME$5] = Modal._jQueryInterface;
  $.fn[NAME$5].Constructor = Modal;
  $.fn[NAME$5].noConflict = () => {
    $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;
    return Modal._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): tools/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  const DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };

  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
   */
  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
   */
  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
  function allowedAttribute(attr, allowedAttributeList) {
    const attrName = attr.nodeName.toLowerCase();
    if (allowedAttributeList.indexOf(attrName) !== -1) {
      if (uriAttrs.indexOf(attrName) !== -1) {
        return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue));
      }
      return true;
    }
    const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp);

    // Check if a regular expression validates the attribute.
    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attrName)) {
        return true;
      }
    }
    return false;
  }
  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }
    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }
    const domParser = new globalThis.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const whitelistKeys = Object.keys(whiteList);
    const elements = [].slice.call(createdDocument.body.querySelectorAll('*'));
    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i];
      const elName = el.nodeName.toLowerCase();
      if (whitelistKeys.indexOf(el.nodeName.toLowerCase()) === -1) {
        el.parentNode.removeChild(el);
        continue;
      }
      const attributeList = [].slice.call(el.attributes);
      // eslint-disable-next-line unicorn/prefer-spread
      const whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);
      attributeList.forEach(attr => {
        if (!allowedAttribute(attr, whitelistedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    }
    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$4 = 'tooltip';
  const VERSION$4 = '4.6.2';
  const DATA_KEY$4 = 'bs.tooltip';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];
  const CLASS_PREFIX$1 = 'bs-tooltip';
  const BSCLS_PREFIX_REGEX$1 = new RegExp(`(^|\\s)${CLASS_PREFIX$1}\\S+`, 'g');
  const DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_SHOW$3 = 'show';
  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const SELECTOR_ARROW = '.arrow';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  const Default$3 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent',
    customClass: '',
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist,
    popperConfig: null
  };
  const DefaultType$3 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)',
    customClass: '(string|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    whiteList: 'object',
    popperConfig: '(null|object)'
  };
  const Event$1 = {
    HIDE: `hide${EVENT_KEY$4}`,
    HIDDEN: `hidden${EVENT_KEY$4}`,
    SHOW: `show${EVENT_KEY$4}`,
    SHOWN: `shown${EVENT_KEY$4}`,
    INSERTED: `inserted${EVENT_KEY$4}`,
    CLICK: `click${EVENT_KEY$4}`,
    FOCUSIN: `focusin${EVENT_KEY$4}`,
    FOCUSOUT: `focusout${EVENT_KEY$4}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
  };

  /**
   * Class definition
   */

  class Tooltip {
    constructor(element, config) {
      if (createPopper === undefined) {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
      }

      // Private
      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null;

      // Protected
      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;
      this._setListeners();
    }

    // Getters
    static get VERSION() {
      return VERSION$4;
    }
    static get Default() {
      return Default$3;
    }
    static get NAME() {
      return NAME$4;
    }
    static get DATA_KEY() {
      return DATA_KEY$4;
    }
    static get Event() {
      return Event$1;
    }
    static get EVENT_KEY() {
      return EVENT_KEY$4;
    }
    static get DefaultType() {
      return DefaultType$3;
    }

    // Public
    enable() {
      this._isEnabled = true;
    }
    disable() {
      this._isEnabled = false;
    }
    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }
    toggle(event) {
      if (!this._isEnabled) {
        return;
      }
      if (event) {
        const dataKey = this.constructor.DATA_KEY;
        let context = $(event.currentTarget).data(dataKey);
        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }
        context._activeTrigger.click = !context._activeTrigger.click;
        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if ($(this.getTipElement()).hasClass(CLASS_NAME_SHOW$3)) {
          this._leave(null, this);
          return;
        }
        this._enter(null, this);
      }
    }
    dispose() {
      clearTimeout(this._timeout);
      $.removeData(this.element, this.constructor.DATA_KEY);
      $(this.element).off(this.constructor.EVENT_KEY);
      $(this.element).closest('.modal').off('hide.bs.modal', this._hideModalHandler);
      if (this.tip) {
        $(this.tip).remove();
      }
      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;
      if (this._popper) {
        this._popper.destroy();
      }
      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    }
    show() {
      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }
      const showEvent = $.Event(this.constructor.Event.SHOW);
      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent);
        const shadowRoot = Util.findShadowRoot(this.element);
        const isInTheDom = $.contains(shadowRoot === null ? this.element.ownerDocument.documentElement : shadowRoot, this.element);
        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }
        const tip = this.getTipElement();
        const tipId = Util.getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();
        if (this.config.animation) {
          $(tip).addClass(CLASS_NAME_FADE$3);
        }
        const placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;
        const attachment = this._getAttachment(placement);
        this.addAttachmentClass(attachment);
        const container = this._getContainer();
        $(tip).data(this.constructor.DATA_KEY, this);
        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container);
        }
        $(this.element).trigger(this.constructor.Event.INSERTED);
        this._popper = createPopper(this.element, tip, this._getPopperConfig(attachment));
        $(tip).addClass(CLASS_NAME_SHOW$3);
        $(tip).addClass(this.config.customClass);

        // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().on('mouseover', null, $.noop);
        }
        const complete = () => {
          if (this.config.animation) {
            this._fixTransition();
          }
          const prevHoverState = this._hoverState;
          this._hoverState = null;
          $(this.element).trigger(this.constructor.Event.SHOWN);
          if (prevHoverState === HOVER_STATE_OUT) {
            this._leave(null, this);
          }
        };
        if ($(this.tip).hasClass(CLASS_NAME_FADE$3)) {
          const transitionDuration = Util.getTransitionDurationFromElement(this.tip);
          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      }
    }
    hide(callback) {
      const tip = this.getTipElement();
      const hideEvent = $.Event(this.constructor.Event.HIDE);
      const complete = () => {
        if (this._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }
        this._cleanTipClass();
        this.element.removeAttribute('aria-describedby');
        $(this.element).trigger(this.constructor.Event.HIDDEN);
        if (this._popper !== null) {
          this._popper.destroy();
        }
        if (callback) {
          callback();
        }
      };
      $(this.element).trigger(hideEvent);
      if (hideEvent.isDefaultPrevented()) {
        return;
      }
      $(tip).removeClass(CLASS_NAME_SHOW$3);

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop);
      }
      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      if ($(this.tip).hasClass(CLASS_NAME_FADE$3)) {
        const transitionDuration = Util.getTransitionDurationFromElement(tip);
        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
      this._hoverState = '';
    }
    update() {
      if (this._popper !== null) {
        this._popper.update();
      }
    }

    // Protected
    isWithContent() {
      return Boolean(this.getTitle());
    }
    addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(`${CLASS_PREFIX$1}-${attachment}`);
    }
    getTipElement() {
      this.tip || (this.tip = $(this.config.template)[0]);
      return this.tip;
    }
    setContent() {
      const tip = this.getTipElement();
      this.setElementContent($(tip.querySelectorAll(SELECTOR_TOOLTIP_INNER)), this.getTitle());
      $(tip).removeClass(`${CLASS_NAME_FADE$3} ${CLASS_NAME_SHOW$3}`);
    }
    setElementContent($element, content) {
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // Content is a DOM node or a jQuery
        if (this.config.html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }
        return;
      }
      if (this.config.html) {
        if (this.config.sanitize) {
          content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn);
        }
        $element.html(content);
      } else {
        $element.text(content);
      }
    }
    getTitle() {
      let title = this.element.getAttribute('data-original-title');
      title || (title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title);
      return title;
    }

    // Private
    _getPopperConfig(attachment) {
      const defaultBsConfig = {
        placement: attachment,
        modifiers: [{
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'flip',
          options: {
            fallbackPlacements: this._getFallbackPlacements()
          }
        }, {
          name: 'preventOverflow',
          options: {
            boundary: this._getBoundary()
          }
        }, {
          name: 'arrow',
          options: {
            element: SELECTOR_ARROW
          }
        }, {
          name: 'bootstrapPlacement',
          enabled: true,
          phase: 'afterWrite',
          fn: data => {
            const newPlacement = data.state.placement;
            if (this._lastPopperPlacement !== newPlacement) {
              this._handlePopperPlacementChange({
                instance: data.instance,
                placement: newPlacement
              });
              this._lastPopperPlacement = newPlacement;
            }
          }
        }]
      };
      const customConfig = typeof this.config.popperConfig === 'function' ? this.config.popperConfig(defaultBsConfig) : this.config.popperConfig;
      return {
        ...defaultBsConfig,
        ...customConfig
      };
    }
    _getOffset() {
      if (typeof this.config.offset === 'function') {
        return popperData => this.config.offset(popperData, this.element);
      }
      if (typeof this.config.offset === 'string') {
        return this.config.offset.split(',').map(value => Number.parseInt(value, 10));
      }
      return this.config.offset;
    }
    _getFallbackPlacements() {
      const fallback = this.config.fallbackPlacement;
      if (fallback === 'flip') {
        return ['top', 'bottom', 'left', 'right'];
      }
      if (typeof fallback === 'string') {
        return [fallback];
      }
      return fallback;
    }
    _getBoundary() {
      // Popper 1 accepted 'scrollParent'; Popper 2 equivalent is 'clippingParents'
      return this.config.boundary === 'scrollParent' ? 'clippingParents' : this.config.boundary;
    }
    _getContainer() {
      if (this.config.container === false) {
        return document.body;
      }
      if (Util.isElement(this.config.container)) {
        return $(this.config.container);
      }
      return $(document).find(this.config.container);
    }
    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    }
    _setListeners() {
      const triggers = this.config.trigger.split(' ');
      triggers.forEach(trigger => {
        if (trigger === 'click') {
          $(this.element).on(this.constructor.Event.CLICK, this.config.selector, event => this.toggle(event));
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          $(this.element).on(eventIn, this.config.selector, event => this._enter(event)).on(eventOut, this.config.selector, event => this._leave(event));
        }
      });
      this._hideModalHandler = () => {
        if (this.element) {
          this.hide();
        }
      };
      $(this.element).closest('.modal').on('hide.bs.modal', this._hideModalHandler);
      if (this.config.selector) {
        this.config = {
          ...this.config,
          trigger: 'manual',
          selector: ''
        };
      } else {
        this._fixTitle();
      }
    }
    _fixTitle() {
      const titleType = typeof this.element.getAttribute('data-original-title');
      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    }
    _enter(event, context) {
      const dataKey = this.constructor.DATA_KEY;
      context || (context = $(event.currentTarget).data(dataKey));
      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }
      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
      }
      if ($(context.getTipElement()).hasClass(CLASS_NAME_SHOW$3) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }
      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;
      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }
      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    }
    _leave(event, context) {
      const dataKey = this.constructor.DATA_KEY;
      context || (context = $(event.currentTarget).data(dataKey));
      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }
      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = false;
      }
      if (context._isWithActiveTrigger()) {
        return;
      }
      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;
      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }
      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    }
    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }
      return false;
    }
    _getConfig(config) {
      const dataAttributes = $(this.element).data();
      Object.keys(dataAttributes).forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr];
        }
      });
      config = {
        ...this.constructor.Default,
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }
      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }
      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }
      Util.typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn);
      }
      return config;
    }
    _getDelegateConfig() {
      const config = {};
      if (this.config) {
        for (const key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }
      return config;
    }
    _cleanTipClass() {
      const $tip = $(this.getTipElement());
      const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX$1);
      if (tabClass !== null && tabClass.length) {
        $tip.removeClass(tabClass.join(''));
      }
    }
    _handlePopperPlacementChange(popperData) {
      this.tip = popperData.instance.state.elements.popper;
      this._cleanTipClass();
      this.addAttachmentClass(this._getAttachment(popperData.placement));
    }
    _fixTransition() {
      // Popper 2 sets the placement attribute before the tooltip is shown,
      // so the old x-placement workaround is no longer needed.
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $(this);
        let data = $element.data(DATA_KEY$4);
        const _config = typeof config === 'object' && config;
        if (!data && /dispose|hide/.test(config)) {
          return;
        }
        if (!data) {
          data = new Tooltip(this, _config);
          $element.data(DATA_KEY$4, data);
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }

  /**
   * jQuery
   */

  $.fn[NAME$4] = Tooltip._jQueryInterface;
  $.fn[NAME$4].Constructor = Tooltip;
  $.fn[NAME$4].noConflict = () => {
    $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;
    return Tooltip._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$3 = 'popover';
  const VERSION$3 = '4.6.2';
  const DATA_KEY$3 = 'bs.popover';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
  const CLASS_PREFIX = 'bs-popover';
  const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g');
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_SHOW$2 = 'show';
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  const Default$2 = {
    ...Tooltip.Default,
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
  };
  const DefaultType$2 = {
    ...Tooltip.DefaultType,
    content: '(string|element|function)'
  };
  const Event = {
    HIDE: `hide${EVENT_KEY$3}`,
    HIDDEN: `hidden${EVENT_KEY$3}`,
    SHOW: `show${EVENT_KEY$3}`,
    SHOWN: `shown${EVENT_KEY$3}`,
    INSERTED: `inserted${EVENT_KEY$3}`,
    CLICK: `click${EVENT_KEY$3}`,
    FOCUSIN: `focusin${EVENT_KEY$3}`,
    FOCUSOUT: `focusout${EVENT_KEY$3}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
  };

  /**
   * Class definition
   */

  class Popover extends Tooltip {
    // Getters
    static get VERSION() {
      return VERSION$3;
    }
    static get Default() {
      return Default$2;
    }
    static get NAME() {
      return NAME$3;
    }
    static get DATA_KEY() {
      return DATA_KEY$3;
    }
    static get Event() {
      return Event;
    }
    static get EVENT_KEY() {
      return EVENT_KEY$3;
    }
    static get DefaultType() {
      return DefaultType$2;
    }

    // Overrides
    isWithContent() {
      return this.getTitle() || this._getContent();
    }
    addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(`${CLASS_PREFIX}-${attachment}`);
    }
    getTipElement() {
      this.tip || (this.tip = $(this.config.template)[0]);
      return this.tip;
    }
    setContent() {
      const $tip = $(this.getTipElement());

      // We use append for html objects to maintain js events
      this.setElementContent($tip.find(SELECTOR_TITLE), this.getTitle());
      let content = this._getContent();
      if (typeof content === 'function') {
        content = content.call(this.element);
      }
      this.setElementContent($tip.find(SELECTOR_CONTENT), content);
      $tip.removeClass(`${CLASS_NAME_FADE$2} ${CLASS_NAME_SHOW$2}`);
    }

    // Private
    _getContent() {
      return this.element.getAttribute('data-content') || this.config.content;
    }
    _cleanTipClass() {
      const $tip = $(this.getTipElement());
      const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);
      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY$3);
        const _config = typeof config === 'object' ? config : null;
        if (!data && /dispose|hide/.test(config)) {
          return;
        }
        if (!data) {
          data = new Popover(this, _config);
          $(this).data(DATA_KEY$3, data);
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }

  /**
   * jQuery
   */

  $.fn[NAME$3] = Popover._jQueryInterface;
  $.fn[NAME$3].Constructor = Popover;
  $.fn[NAME$3].noConflict = () => {
    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return Popover._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$2 = 'scrollspy';
  const VERSION$2 = '4.6.2';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY$1 = '.data-api';
  const JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  const SELECTOR_DATA_SPY = '[data-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_DROPDOWN$1 = '.dropdown';
  const SELECTOR_DROPDOWN_ITEMS = '.dropdown-item';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const Default$1 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  const DefaultType$1 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };

  /**
   * Class definition
   */

  class ScrollSpy {
    constructor(element, config) {
      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? globalThis : element;
      this._config = this._getConfig(config);
      this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS},` + `${this._config.target} ${SELECTOR_LIST_ITEMS},` + `${this._config.target} ${SELECTOR_DROPDOWN_ITEMS}`;
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      $(this._scrollElement).on(EVENT_SCROLL, event => this._process(event));
      this.refresh();
      this._process();
    }

    // Getters
    static get VERSION() {
      return VERSION$2;
    }
    static get Default() {
      return Default$1;
    }

    // Public
    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      const targets = [].slice.call(document.querySelectorAll(this._selector));
      targets.map(element => {
        let target;
        const targetSelector = Util.getSelectorFromElement(element);
        if (targetSelector) {
          target = document.querySelector(targetSelector);
        }
        if (target) {
          const targetBCR = target.getBoundingClientRect();
          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }
        return null;
      }).filter(Boolean).sort((a, b) => a[0] - b[0]).forEach(item => {
        this._offsets.push(item[0]);
        this._targets.push(item[1]);
      });
    }
    dispose() {
      $.removeData(this._element, DATA_KEY$2);
      $(this._scrollElement).off(EVENT_KEY$2);
      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    }

    // Private
    _getConfig(config) {
      config = {
        ...Default$1,
        ...(typeof config === 'object' && config ? config : {})
      };
      if (typeof config.target !== 'string' && Util.isElement(config.target)) {
        let id = $(config.target).attr('id');
        if (!id) {
          id = Util.getUID(NAME$2);
          $(config.target).attr('id', id);
        }
        config.target = `#${id}`;
      }
      Util.typeCheckConfig(NAME$2, config, DefaultType$1);
      return config;
    }
    _getScrollTop() {
      return this._scrollElement === globalThis ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    }
    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
    _getOffsetHeight() {
      return this._scrollElement === globalThis ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    }
    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;
      const scrollHeight = this._getScrollHeight();
      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();
      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }
      if (scrollTop >= maxScroll) {
        const target = this._targets.at(-1);
        if (this._activeTarget !== target) {
          this._activate(target);
        }
        return;
      }
      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;
        this._clear();
        return;
      }
      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (this._offsets[i + 1] === undefined || scrollTop < this._offsets[i + 1]);
        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    }
    _activate(target) {
      this._activeTarget = target;
      this._clear();
      const queries = this._selector.split(',').map(selector => `${selector}[data-target="${target}"],${selector}[href="${target}"]`);
      const $link = $([].slice.call(document.querySelectorAll(queries.join(','))));
      if ($link.hasClass(CLASS_NAME_DROPDOWN_ITEM)) {
        $link.closest(SELECTOR_DROPDOWN$1).find(SELECTOR_DROPDOWN_TOGGLE$1).addClass(CLASS_NAME_ACTIVE$1);
        $link.addClass(CLASS_NAME_ACTIVE$1);
      } else {
        // Set triggered link as active
        $link.addClass(CLASS_NAME_ACTIVE$1);
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        $link.parents(SELECTOR_NAV_LIST_GROUP$1).prev(`${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).addClass(CLASS_NAME_ACTIVE$1);
        // Handle special case when .nav-link is inside .nav-item
        $link.parents(SELECTOR_NAV_LIST_GROUP$1).prev(SELECTOR_NAV_ITEMS).children(SELECTOR_NAV_LINKS).addClass(CLASS_NAME_ACTIVE$1);
      }
      $(this._scrollElement).trigger(EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }
    _clear() {
      [].slice.call(document.querySelectorAll(this._selector)).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY$2);
        const _config = typeof config === 'object' && config;
        if (!data) {
          data = new ScrollSpy(this, _config);
          $(this).data(DATA_KEY$2, data);
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  $(globalThis).on(EVENT_LOAD_DATA_API, () => {
    const scrollSpys = [].slice.call(document.querySelectorAll(SELECTOR_DATA_SPY));
    const scrollSpysLength = scrollSpys.length;
    for (let i = scrollSpysLength; i--;) {
      const $spy = $(scrollSpys[i]);
      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });

  /**
   * jQuery
   */

  $.fn[NAME$2] = ScrollSpy._jQueryInterface;
  $.fn[NAME$2].Constructor = ScrollSpy;
  $.fn[NAME$2].noConflict = () => {
    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return ScrollSpy._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$1 = 'tab';
  const VERSION$1 = '4.6.2';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const DATA_API_KEY = '.data-api';
  const JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];
  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_DISABLED = 'disabled';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = '> li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = '> .dropdown-menu .active';

  /**
   * Class definition
   */

  class Tab {
    constructor(element) {
      this._element = element;
    }

    // Getters
    static get VERSION() {
      return VERSION$1;
    }

    // Public
    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(CLASS_NAME_ACTIVE) || $(this._element).hasClass(CLASS_NAME_DISABLED) || this._element.hasAttribute('disabled')) {
        return;
      }
      let target;
      let previous;
      const listElement = $(this._element).closest(SELECTOR_NAV_LIST_GROUP)[0];
      const selector = Util.getSelectorFromElement(this._element);
      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous.at(-1);
      }
      const hideEvent = $.Event(EVENT_HIDE$1, {
        relatedTarget: this._element
      });
      const showEvent = $.Event(EVENT_SHOW$1, {
        relatedTarget: previous
      });
      if (previous) {
        $(previous).trigger(hideEvent);
      }
      $(this._element).trigger(showEvent);
      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }
      if (selector) {
        target = document.querySelector(selector);
      }
      this._activate(this._element, listElement);
      const complete = () => {
        const hiddenEvent = $.Event(EVENT_HIDDEN$1, {
          relatedTarget: this._element
        });
        const shownEvent = $.Event(EVENT_SHOWN$1, {
          relatedTarget: previous
        });
        $(previous).trigger(hiddenEvent);
        $(this._element).trigger(shownEvent);
      };
      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    }
    dispose() {
      $.removeData(this._element, DATA_KEY$1);
      this._element = null;
    }

    // Private
    _activate(element, container, callback) {
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $(container).find(SELECTOR_ACTIVE_UL) : $(container).children(SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && $(active).hasClass(CLASS_NAME_FADE$1);
      const complete = () => this._transitionComplete(element, active, callback);
      if (active && isTransitioning) {
        const transitionDuration = Util.getTransitionDurationFromElement(active);
        $(active).removeClass(CLASS_NAME_SHOW$1).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    }
    _transitionComplete(element, active, callback) {
      if (active) {
        $(active).removeClass(CLASS_NAME_ACTIVE);
        const dropdownChild = $(active.parentNode).find(SELECTOR_DROPDOWN_ACTIVE_CHILD)[0];
        if (dropdownChild) {
          $(dropdownChild).removeClass(CLASS_NAME_ACTIVE);
        }
        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }
      $(element).addClass(CLASS_NAME_ACTIVE);
      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }
      Util.reflow(element);
      if (element.classList.contains(CLASS_NAME_FADE$1)) {
        element.classList.add(CLASS_NAME_SHOW$1);
      }
      let parent = element.parentNode;
      if (parent && parent.nodeName === 'LI') {
        parent = parent.parentNode;
      }
      if (parent && $(parent).hasClass(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = $(element).closest(SELECTOR_DROPDOWN)[0];
        if (dropdownElement) {
          const dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(SELECTOR_DROPDOWN_TOGGLE));
          $(dropdownToggleList).addClass(CLASS_NAME_ACTIVE);
        }
        element.setAttribute('aria-expanded', true);
      }
      if (callback) {
        callback();
      }
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        const $this = $(this);
        let data = $this.data(DATA_KEY$1);
        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY$1, data);
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault();
    Tab._jQueryInterface.call($(this), 'show');
  });

  /**
   * jQuery
   */

  $.fn[NAME$1] = Tab._jQueryInterface;
  $.fn[NAME$1].Constructor = Tab;
  $.fn[NAME$1].noConflict = () => {
    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return Tab._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME = 'toast';
  const VERSION = '4.6.2';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const JQUERY_NO_CONFLICT = $.fn[NAME];
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const SELECTOR_DATA_DISMISS = '[data-dismiss="toast"]';
  const Default = {
    animation: true,
    autohide: true,
    delay: 500
  };
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };

  /**
   * Class definition
   */

  class Toast {
    constructor(element, config) {
      this._element = element;
      this._config = this._getConfig(config);
      this._timeout = null;
      this._setListeners();
    }

    // Getters
    static get VERSION() {
      return VERSION;
    }
    static get DefaultType() {
      return DefaultType;
    }
    static get Default() {
      return Default;
    }

    // Public
    show() {
      const showEvent = $.Event(EVENT_SHOW);
      $(this._element).trigger(showEvent);
      if (showEvent.isDefaultPrevented()) {
        return;
      }
      this._clearTimeout();
      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }
      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);
        this._element.classList.add(CLASS_NAME_SHOW);
        $(this._element).trigger(EVENT_SHOWN);
        if (this._config.autohide) {
          this._timeout = setTimeout(() => {
            this.hide();
          }, this._config.delay);
        }
      };
      this._element.classList.remove(CLASS_NAME_HIDE);
      Util.reflow(this._element);
      this._element.classList.add(CLASS_NAME_SHOWING);
      if (this._config.animation) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    }
    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }
      const hideEvent = $.Event(EVENT_HIDE);
      $(this._element).trigger(hideEvent);
      if (hideEvent.isDefaultPrevented()) {
        return;
      }
      this._close();
    }
    dispose() {
      this._clearTimeout();
      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }
      $(this._element).off(EVENT_CLICK_DISMISS);
      $.removeData(this._element, DATA_KEY);
      this._element = null;
      this._config = null;
    }

    // Private
    _getConfig(config) {
      config = {
        ...Default,
        ...$(this._element).data(),
        ...(typeof config === 'object' && config ? config : {})
      };
      Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    }
    _setListeners() {
      $(this._element).on(EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide());
    }
    _close() {
      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE);
        $(this._element).trigger(EVENT_HIDDEN);
      };
      this._element.classList.remove(CLASS_NAME_SHOW);
      if (this._config.animation) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    }
    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $(this);
        let data = $element.data(DATA_KEY);
        const _config = typeof config === 'object' && config;
        if (!data) {
          data = new Toast(this, _config);
          $element.data(DATA_KEY, data);
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config](this);
        }
      });
    }
  }

  /**
   * jQuery
   */

  $.fn[NAME] = Toast._jQueryInterface;
  $.fn[NAME].Constructor = Toast;
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Toast._jQueryInterface;
  };

  exports.Alert = Alert;
  exports.Button = Button;
  exports.Carousel = Carousel;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Scrollspy = ScrollSpy;
  exports.Tab = Tab;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;
  exports.Util = Util;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
//# sourceMappingURL=bootstrap.bundle.js.map
