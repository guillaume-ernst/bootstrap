#!/usr/bin/env node
'use strict'

/**
 * AdminLTE 3 compatibility check.
 *
 * Compiles AdminLTE's own adminlte.scss with Dart Sass against the fork's
 * legacy @import Sass tree (tests/adminlte/node_modules/bootstrap resolves
 * to the repo via a file: dependency). The `~` prefix used by AdminLTE is a
 * webpack/sass-loader convention, so it is stripped for Dart Sass.
 */

const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')

const ROOT = path.resolve(__dirname, '..')
const FIXTURE = path.join(ROOT, 'tests/adminlte')
const OUT_DIR = path.join(ROOT, '.tmp-adminlte')
const ADMINLTE_SCSS = path.join(FIXTURE, 'node_modules/admin-lte/build/scss/adminlte.scss')

if (!fs.existsSync(ADMINLTE_SCSS)) {
  console.error('AdminLTE fixture not installed. Run: npm --prefix tests/adminlte install --ignore-scripts')
  process.exit(1)
}

fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR, { recursive: true })

// Strip the webpack-only `~` prefix from module imports.
const entry = fs.readFileSync(ADMINLTE_SCSS, 'utf8').replaceAll('@import "~', '@import "')
const entryPath = path.join(OUT_DIR, 'adminlte.scss')
fs.writeFileSync(entryPath, entry)

const sassFlags = '--style=expanded --no-source-map --quiet-deps --silence-deprecation=import,global-builtin,color-functions,if-function,slash-div,abs-percent,legacy-js-api'
const outPath = path.join(OUT_DIR, 'adminlte.css')

try {
  execSync(
    `npx sass ${sassFlags} --load-path="${path.join(FIXTURE, 'node_modules')}" --load-path="${path.join(FIXTURE, 'node_modules/admin-lte/build/scss')}" "${entryPath}":"${outPath}"`,
    { cwd: ROOT, stdio: 'pipe' }
  )
} catch (error) {
  console.error('AdminLTE Sass compilation failed:\n' + (error.stderr?.toString() || error.message))
  process.exit(1)
}

const css = fs.readFileSync(outPath, 'utf8')
const required = ['.main-sidebar', '.content-wrapper', '.navbar-nav', '.card', '.sidebar-collapse']
const missing = required.filter(selector => !css.includes(selector))
if (missing.length > 0) {
  console.error(`AdminLTE CSS is missing expected selectors: ${missing.join(', ')}`)
  process.exit(1)
}

// Compare AdminLTE compiled against the fork with AdminLTE compiled against
// the original Bootstrap 4.6.2, using the same Dart Sass flags so toolchain
// differences cancel out and only fork-vs-upstream differences remain.
const ORIG_DIR = path.join(OUT_DIR, 'node_modules-orig')
fs.mkdirSync(ORIG_DIR, { recursive: true })
fs.symlinkSync(
  path.join(FIXTURE, 'node_modules/bootstrap-orig'),
  path.join(ORIG_DIR, 'bootstrap')
)
fs.symlinkSync(
  path.join(FIXTURE, 'node_modules/admin-lte'),
  path.join(ORIG_DIR, 'admin-lte')
)

const origPath = path.join(OUT_DIR, 'adminlte-orig.css')
try {
  execSync(
    `npx sass ${sassFlags} --load-path="${ORIG_DIR}" --load-path="${path.join(FIXTURE, 'node_modules/admin-lte/build/scss')}" "${entryPath}":"${origPath}"`,
    { cwd: ROOT, stdio: 'pipe' }
  )
} catch (error) {
  console.error('AdminLTE compilation against original Bootstrap failed:\n' + (error.stderr?.toString() || error.message))
  process.exit(1)
}

execSync(
  `node ${path.join(ROOT, 'build/css-normalize.js')} "${outPath}" > "${outPath}.normalized"`,
  { shell: true }
)
execSync(
  `node ${path.join(ROOT, 'build/css-normalize.js')} "${origPath}" > "${OUT_DIR}/adminlte-orig.normalized"`,
  { shell: true }
)

let diff = ''
try {
  diff = execSync(`diff -u "${OUT_DIR}/adminlte-orig.normalized" "${outPath}.normalized"`, { encoding: 'utf8' })
} catch (error) {
  diff = error.stdout || error.message
}

if (diff) {
  const lines = diff.split('\n').filter(line => /^[+-]/.test(line) && !/^[+-]{3}/.test(line))
  console.error(`AdminLTE CSS differs between original Bootstrap 4.6.2 and the fork (${lines.length} changed lines).`)
  console.error(lines.slice(0, 60).join('\n'))
  process.exit(1)
}

console.log('AdminLTE 3 compiles against bootstrap-modernized: OK')
console.log('Compiled output is identical to AdminLTE built on Bootstrap 4.6.2: OK')
