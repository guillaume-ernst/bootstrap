#!/usr/bin/env node
'use strict'

const fs = require('node:fs')
const parser = require('@babel/parser')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const glob = require('glob')

function transform(code) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  })

  const calleeNames = new Set(['it', 'test', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll'])

  function isDoneParam(param) {
    return t.isIdentifier(param) && param.name === 'done'
  }

  function hasDoneCall(node) {
    let found = false
    function visit(n) {
      if (found) {
        return
      }

      if (t.isCallExpression(n) && t.isIdentifier(n.callee) && n.callee.name === 'done') {
        found = true
        return
      }

      for (const key in n) {
        if (key === 'tokens') {
          continue
        }

        const child = n[key]
        if (Array.isArray(child)) {
          child.forEach(visit)
        } else if (child && typeof child === 'object' && child.type) {
          visit(child)
        }
      }
    }

    visit(node)
    return found
  }

  function replaceDoneCalls(node, resolveName) {
    for (const key in node) {
      if (key === 'tokens') {
        continue
      }

      const child = node[key]
      if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
          const item = child[i]
          if (t.isCallExpression(item) && t.isIdentifier(item.callee) && item.callee.name === 'done') {
            child[i] = t.callExpression(t.identifier(resolveName), item.arguments)
          } else if (item && typeof item === 'object' && item.type) {
            replaceDoneCalls(item, resolveName)
          }
        }
      } else if (child && typeof child === 'object' && child.type) {
        replaceDoneCalls(child, resolveName)
      }
    }
  }

  let modified = false

  function visit(node) {
    if (!node || typeof node !== 'object') {
      return
    }

    if (t.isCallExpression(node) && t.isIdentifier(node.callee) && calleeNames.has(node.callee.name)) {
      const callbackIndex = node.arguments.findIndex(arg =>
        t.isArrowFunctionExpression(arg) || t.isFunctionExpression(arg))
      if (callbackIndex !== -1) {
        const callback = node.arguments[callbackIndex]
        const param = callback.params[0]
        if (isDoneParam(param) && hasDoneCall(callback)) {
          modified = true
          const bodyStatements = t.isBlockStatement(callback.body) ? callback.body.body : [t.returnStatement(callback.body)]

          const assertions = bodyStatements.find(stmt =>
            t.isExpressionStatement(stmt) &&
            t.isCallExpression(stmt.expression) &&
            t.isMemberExpression(stmt.expression.callee) &&
            t.isIdentifier(stmt.expression.callee.object, { name: 'expect' }) &&
            t.isIdentifier(stmt.expression.callee.property, { name: 'assertions' }))

          const innerStatements = bodyStatements.filter(stmt => stmt !== assertions)
          const promiseBody = t.blockStatement(innerStatements)
          replaceDoneCalls(promiseBody, 'resolve')

          if (assertions) {
            promiseBody.body.unshift(assertions)
          }

          const newCallback = t.arrowFunctionExpression(
            [],
            t.newExpression(
              t.identifier('Promise'),
              [t.arrowFunctionExpression([t.identifier('resolve')], promiseBody)]
            )
          )

          const newArgs = [...node.arguments]
          newArgs[callbackIndex] = newCallback
          node.arguments = newArgs
        }
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

  visit(ast)

  if (!modified) {
    return code
  }

  return generate(ast, { retainLines: false, concise: false }, code).code
}

const files = glob.sync('tests/unit/*.spec.js')
for (const file of files) {
  const code = fs.readFileSync(file, 'utf8')
  const out = transform(code)
  if (out === code) {
    console.log(`Skipped ${file}`)
  } else {
    fs.writeFileSync(file, out)
    console.log(`Transformed ${file}`)
  }
}
