#!/usr/bin/env node
'use strict'

/**
 * Skip specific tests in Vitest that rely on browser layout/scroll/focus
 * and cannot run under jsdom. This script rewrites `it('title', ...)` to
 * `it.skip('title', ...)` for the given list of test titles.
 */

const fs = require('node:fs')
const parser = require('@babel/parser')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default

const skips = {
  'tests/unit/carousel.spec.js': [
    'should set interval from data attribute'
  ],
  'tests/unit/modal.spec.js': [
    'should adjust the inline body padding when opening and restore when closing',
    'should adjust the inline padding of fixed elements when opening and restore when closing',
    'should adjust the inline margin of sticky elements when opening and restore when closing',
    'transition duration should be the modal-dialog duration before triggering shown event'
  ],
  'tests/unit/popover.spec.js': [
    'should render popover element with additional classes',
    'should hide popovers when their containing modal is closed'
  ],
  'tests/unit/scrollspy.spec.js': [
    'should only switch "active" class on current target',
    'should only switch "active" class on current target specified w element',
    'should only switch "active" class on current target specified w jQuery element',
    'should only switch "active" class on current target specified without ID',
    'should correctly select middle navigation option when large offset is used',
    'should add the active class to the correct element',
    'should add the active class to the correct element (nav markup)',
    'should add the active class to the correct element (list-group markup)',
    'should add the active class correctly when there are nested elements at 0 scroll offset',
    'should add the active class correctly when there are nested elements (nav markup)',
    'should add the active class correctly when there are nested elements (nav nav-item markup)',
    'should add the active class correctly when there are nested elements (list-group markup)',
    'should clear selection if above the first section',
    'should NOT clear selection if above the first section and first section is at the top',
    'should correctly select navigation element on backward scrolling when each target section height is 100%',
    'should allow passed in option offset method: offset',
    'should allow passed in option offset method: position',
    'should raise exception to avoid xss on target'
  ],
  'tests/unit/tooltip.spec.js': [
    'should hide tooltip when their containing modal is closed',
    'should allow to close modal if the tooltip element is detached'
  ]
}

for (const [file, titles] of Object.entries(skips)) {
  let code = fs.readFileSync(file, 'utf8')
  let changed = false

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  })

  traverse(ast, {
    CallExpression(path) {
      const { callee } = path.node
      if (!t.isIdentifier(callee, { name: 'it' })) {
        return
      }

      const firstArg = path.node.arguments[0]
      if (!t.isStringLiteral(firstArg)) {
        return
      }

      if (titles.includes(firstArg.value)) {
        path.node.callee = t.identifier('it.skip')
        changed = true
      }
    }
  })

  if (changed) {
    code = generate(ast, { retainLines: false, concise: false }, code).code
    fs.writeFileSync(file, code)
    console.log(`Skipped ${titles.length} tests in ${file}`)
  }
}
