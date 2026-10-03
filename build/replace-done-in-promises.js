#!/usr/bin/env node
'use strict'

const fs = require('node:fs')
const parser = require('@babel/parser')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const glob = require('glob')

function fix(code) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  })

  let modified = false

  traverse(ast, {
    NewExpression(path) {
      if (!t.isIdentifier(path.node.callee, { name: 'Promise' })) {
        return
      }

      const executor = path.node.arguments[0]
      if (!executor) {
        return
      }

      if (!t.isArrowFunctionExpression(executor) && !t.isFunctionExpression(executor)) {
        return
      }

      if (executor.params.length !== 1 || !t.isIdentifier(executor.params[0], { name: 'resolve' })) {
        return
      }

      const resolveName = executor.params[0].name
      const bodyPath = path.get('arguments')[0].get('body')

      bodyPath.traverse({
        CallExpression(innerPath) {
          if (t.isIdentifier(innerPath.node.callee, { name: 'done' })) {
            innerPath.node.callee = t.identifier(resolveName)
            modified = true
          }
        }
      })
    }
  })

  if (!modified) {
    return code
  }

  return generate(ast, { retainLines: false, concise: false }, code).code
}

const files = glob.sync('tests/unit/*.spec.js')
for (const file of files) {
  const code = fs.readFileSync(file, 'utf8')
  const out = fix(code)
  if (out === code) {
    console.log(`Skipped ${file}`)
  } else {
    fs.writeFileSync(file, out)
    console.log(`Fixed ${file}`)
  }
}
