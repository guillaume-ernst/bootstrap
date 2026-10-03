#!/usr/bin/env node
'use strict'

const fs = require('node:fs')
const parser = require('@babel/parser')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const glob = require('glob')

function fixDoneCalls(code) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  })

  let modified = false

  function visit(node) {
    if (!node || typeof node !== 'object') {
      return
    }

    if (
      t.isNewExpression(node) &&
      t.isIdentifier(node.callee, { name: 'Promise' }) &&
      node.arguments.length === 1 &&
      (t.isArrowFunctionExpression(node.arguments[0]) || t.isFunctionExpression(node.arguments[0]))
    ) {
      const executor = node.arguments[0]
      if (executor.params.length === 1 && t.isIdentifier(executor.params[0], { name: 'resolve' })) {
        replaceDoneInScope(executor.body, 'resolve')
      }
    }

    for (const key in node) {
      if (key === 'tokens') {
        continue
      }

      const child = node[key]
      if (Array.isArray(child)) {
        child.forEach(visit)
      } else if (child && typeof child === 'object' && child.type) {
        visit(child)
      }
    }
  }

  function replaceDoneInScope(node, resolveName) {
    for (const key in node) {
      if (key === 'tokens') {
        continue
      }

      const child = node[key]
      if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
          const item = child[i]
          if (t.isCallExpression(item) && t.isIdentifier(item.callee, { name: 'done' })) {
            child[i] = t.callExpression(t.identifier(resolveName), item.arguments)
            modified = true
          } else if (item && typeof item === 'object' && item.type && // Don't recurse into nested Promise executors or functions that shadow resolve
          	!isNewPromiseExecutor(item)) {
            replaceDoneInScope(item, resolveName)
          }
        }
      } else if (child && typeof child === 'object' && child.type && !isNewPromiseExecutor(child)) {
        replaceDoneInScope(child, resolveName)
      }
    }
  }

  function isNewPromiseExecutor(node) {
    return (
      t.isNewExpression(node) &&
      t.isIdentifier(node.callee, { name: 'Promise' })
    )
  }

  visit(ast)

  if (!modified) {
    return code
  }

  return generate(ast, { retainLines: false, concise: false }, code).code
}

const files = glob.sync('tests/unit/*.spec.js')
for (const file of files) {
  const code = fs.readFileSync(file, 'utf8')
  const out = fixDoneCalls(code)
  if (out === code) {
    console.log(`Skipped ${file}`)
  } else {
    fs.writeFileSync(file, out)
    console.log(`Fixed ${file}`)
  }
}
