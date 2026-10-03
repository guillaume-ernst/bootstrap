#!/usr/bin/env node

/**
 * Normalize a compiled Bootstrap CSS file so two different Sass compilers
 * can be compared with `diff`. Strips comments/banners, normalizes colors,
 * rounds numbers, sorts declarations inside each rule, etc.
 *
 * Usage:
 *   node build/css-normalize.mjs input.css > output.css
 */

import fs from 'node:fs'
import path from 'node:path'
import postcss from 'postcss'

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

// --- Color canonicalization -------------------------------------------------
// Different Sass versions/functions serialize the same color differently
// (hex vs rgb(), percent vs byte channels, rgba() vs hsla() after
// color.adjust()). Canonicalize every color to rgba(r, g, b, a) so equivalent
// colors compare equal.

function hslToRgb(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360
  s = Math.min(Math.max(s, 0), 100) / 100
  l = Math.min(Math.max(l, 0), 100) / 100

  if (s === 0) {
    const v = Math.round(l * 255)
    return [v, v, v]
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue = t => {
    t = (((t % 1) + 1) % 1)
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t
    }

    if (t < 1 / 2) {
      return q
    }

    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6
    }

    return p
  }

  return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)].map(v => Math.round(v * 255))
}

function channelToByte(value) {
  if (value.endsWith('%')) {
    return Math.round(parseFloat(value) * 255 / 100)
  }

  return Math.round(parseFloat(value))
}

function formatAlpha(a) {
  const n = parseFloat(a)
  return Number.isInteger(n) ? n.toString() : n.toString()
}

function canonicalColorValue(value) {
  // rgba()/rgb() with int or percent channels, comma or space syntax
  value = value.replaceAll(
    /rgba?\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)/g,
    (match, r, g, b, a) => {
      const rb = channelToByte(r)
      const gb = channelToByte(g)
      const bb = channelToByte(b)
      if (a === undefined) {
        return `rgb(${rb}, ${gb}, ${bb})`
      }

      const alpha = a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a)
      return `rgba(${rb}, ${gb}, ${bb}, ${formatAlpha(alpha)})`
    }
  )

  // hsla()/hsl()
  value = value.replaceAll(
    /hsla?\(\s*(-?[\d.]+)(?:deg|rad|turn)?\s*[, ]\s*([\d.]+%)\s*[, ]\s*(-?[\d.]+%)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)/g,
    (match, h, s, l, a) => {
      let hue = parseFloat(h)
      if (match.includes('turn')) {
        hue *= 360
      }

      if (match.includes('rad')) {
        hue = hue * 180 / Math.PI
      }

      const [r, g, b] = hslToRgb(hue, parseFloat(s), parseFloat(l))
      if (a === undefined) {
        return `rgb(${r}, ${g}, ${b})`
      }

      const alpha = a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a)
      return `rgba(${r}, ${g}, ${b}, ${formatAlpha(alpha)})`
    }
  )

  // 3/4/6/8-digit hex -> rgb()/rgba()
  value = value.replaceAll(
    /#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/g,
    match => {
      let hex = match.slice(1)
      if (hex.length === 3 || hex.length === 4) {
        hex = [...hex].map(c => c + c).join('')
      }

      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      if (hex.length === 8) {
        const a = Math.round(parseInt(hex.slice(6, 8), 16) / 255 * 1_000_000) / 1_000_000
        return `rgba(${r}, ${g}, ${b}, ${formatAlpha(a)})`
      }

      return `rgb(${r}, ${g}, ${b})`
    }
  )

  return value
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
    decl.value = canonicalColorValue(decl.value)
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
