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

// Split a selector list on top-level commas, ignoring commas inside
// quotes, parentheses and brackets (e.g. :not(a, b) or [data-x="a,b"]).
function splitSelectorList(selector) {
  const parts = []
  let depth = 0
  let quote = null
  let current = ''

  for (const char of selector) {
    if (quote) {
      current += char
      if (char === quote) {
        quote = null
      }

      continue
    }

    if (char === '"' || char === '\'') {
      quote = char
      current += char
      continue
    }

    if (char === '(' || char === '[') {
      depth++
    }

    if (char === ')' || char === ']') {
      depth--
    }

    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
      continue
    }

    current += char
  }

  parts.push(current)
  return parts
}

function normalizeSelector(selector) {
  // One selector per line, sorted: list order and wrapping are formatting
  // details, not semantic differences.
  return splitSelectorList(selector)
    .map(part => part.trim().replaceAll(/\s+/g, ' ').replaceAll(/\s*([>+~])\s*/g, ' $1 '))
    .sort()
    .join(',\n')
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
    rule.selector = normalizeSelector(rule.selector)
    const decls = rule.nodes.filter(node => node.type === 'decl')
    decls.sort((a, b) => a.prop.localeCompare(b.prop))
    decls.forEach(decl => rule.append(decl))
  })

  const result = root.toString(postcss.stringify)
    // Collapse runs of blank lines; spacing between rules is formatting only.
    .replaceAll(/\n{2,}/g, '\n')
    .trim()
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
