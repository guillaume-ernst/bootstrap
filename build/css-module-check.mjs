#!/usr/bin/env node

/**
 * Verify the Sass module tree (scss/module/) produces CSS identical to the
 * legacy @import tree (scss/). Both are compiled with Dart Sass, normalized
 * with build/css-normalize.mjs, and diffed.
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, '.tmp-module')

const entries = [
  ['bootstrap.scss', 'bootstrap.css'],
  ['bootstrap-grid.scss', 'bootstrap-grid.css'],
  ['bootstrap-reboot.scss', 'bootstrap-reboot.css'],
  ['bootstrap-utilities.scss', 'bootstrap-utilities.css']
]

function normalize(inputPath, outputPath) {
  execSync(`node ${path.join(ROOT, 'build/css-normalize.mjs')} "${inputPath}" > "${outputPath}"`, { shell: true })
}

function run() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const sassFlags = '--style=expanded --no-source-map --silence-deprecation=import'

  for (const [entry, output] of entries) {
    execSync(
      `npx sass ${sassFlags} --load-path="${path.join(ROOT, 'scss')}" "${path.join(ROOT, 'scss', entry)}":"${path.join(OUT_DIR, `legacy-${output}`)}"`,
      { cwd: ROOT, stdio: 'inherit' }
    )
    execSync(
      `npx sass ${sassFlags} "${path.join(ROOT, 'scss/module', entry)}":"${path.join(OUT_DIR, `module-${output}`)}"`,
      { cwd: ROOT, stdio: 'inherit' }
    )
  }

  let failed = false
  for (const [, output] of entries) {
    const legacyPath = path.join(OUT_DIR, `legacy-${output}`)
    const modulePath = path.join(OUT_DIR, `module-${output}`)
    const legacyNorm = `${legacyPath}.normalized`
    const moduleNorm = `${modulePath}.normalized`

    normalize(legacyPath, legacyNorm)
    normalize(modulePath, moduleNorm)

    let diff = ''
    try {
      diff = execSync(`diff -u "${legacyNorm}" "${moduleNorm}"`, { encoding: 'utf8' })
    } catch (error) {
      diff = error.stdout || error.message
      failed = true
    }

    if (diff) {
      console.error(`Module diff for ${output}:\n${diff}`)
    } else {
      console.log(`${output}: OK`)
    }
  }

  process.exit(failed ? 1 : 0)
}

run()
