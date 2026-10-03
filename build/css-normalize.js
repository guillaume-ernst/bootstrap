#!/usr/bin/env node
'use strict'

/**
 * Normalize a compiled Bootstrap CSS file so two different Sass compilers
 * can be compared with `diff`. Strips comments/banners, normalizes colors,
 * rounds numbers, sorts declarations inside each rule, etc.
 *
 * Usage:
 *   node build/css-normalize.js input.css > output.css
 */

const fs = require('node:fs')
const postcss = require('postcss')
const path = require('node:path')

function lowerColorValue(value) {
  // Lowercase hex colors (preserve opacity variants)
  return value.replaceAll(/#([0-9A-Fa-f]{3,8})/g, match => match.toLowerCase())
}

function roundNumbers(value) {
  // Round decimal numbers to 6 decimal places
  return value.replaceAll(/-?\d+\.\d+/g, match => {
    const n = parseFloat(match)
    const rounded = Math.round(n * 1_000_000) / 1_000_000
    return rounded.toString()
  })
}

async function normalize(inputPath) {
  const css = fs.readFileSync(inputPath, 'utf8')
  const root = postcss.parse(css)

  // Remove all comments
  root.walkComments(comment => comment.remove())

  root.walkDecls(decl => {
    decl.value = lowerColorValue(decl.value)
    decl.value = roundNumbers(decl.value)
  })

  // Sort declarations within each rule alphabetically (ignores nested rules)
  root.walkRules(rule => {
    const decls = rule.nodes.filter(node => node.type === 'decl')
    decls.sort((a, b) => a.prop.localeCompare(b.prop))
    decls.forEach(decl => rule.append(decl))
  })

  const result = root.toString(postcss.stringify)
  process.stdout.write(result + '\n')
}

const input = process.argv[2]
if (!input) {
  console.error(`Usage: ${path.basename(process.argv[1])} <input.css>`)
  process.exit(1)
}

normalize(input).catch(error => {
  console.error(error)
  process.exit(1)
})
