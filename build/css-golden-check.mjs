#!/usr/bin/env node

/**
 * Compile Bootstrap with Dart Sass, normalize output, and diff against the
 * committed golden CSS (the official v5.3.8 dist build).
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, '.tmp-golden')

const files = ['bootstrap.css', 'bootstrap-grid.css', 'bootstrap-reboot.css', 'bootstrap-utilities.css']

function normalize(inputPath, outputPath) {
  execSync(`node ${path.join(ROOT, 'build/css-normalize.mjs')} "${inputPath}" > "${outputPath}"`, { shell: true })
}

function stripSourceMap(cssPath) {
  // The normalizer only handles .css; remove the generated .map files.
  const mapPath = `${cssPath}.map`
  if (fs.existsSync(mapPath)) {
    fs.unlinkSync(mapPath)
  }
}

function run() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // Compile with deprecated @import/global-builtin silenced; we only care about precision-related diff.
  const sassFlags = '--style=expanded --source-map --embed-sources --silence-deprecation=import,global-builtin,color-functions,if-function,slash-div,abs-percent'
  execSync(`npx sass ${sassFlags} --load-path=${path.join(ROOT, 'scss')} ${path.join(ROOT, 'scss/bootstrap.scss')}:${path.join(OUT_DIR, 'bootstrap.css')} ${path.join(ROOT, 'scss/bootstrap-grid.scss')}:${path.join(OUT_DIR, 'bootstrap-grid.css')} ${path.join(ROOT, 'scss/bootstrap-reboot.scss')}:${path.join(OUT_DIR, 'bootstrap-reboot.css')} ${path.join(ROOT, 'scss/bootstrap-utilities.scss')}:${path.join(OUT_DIR, 'bootstrap-utilities.css')}`, { cwd: ROOT, stdio: 'inherit' })

  let failed = false
  for (const file of files) {
    const compiledPath = path.join(OUT_DIR, file)
    const goldenPath = path.join(ROOT, 'tests/golden', file)
    const normalizedPath = path.join(OUT_DIR, `${file}.normalized`)
    const goldenNormalizedPath = path.join(OUT_DIR, `${file}.golden.normalized`)

    stripSourceMap(compiledPath)

    normalize(compiledPath, normalizedPath)
    normalize(goldenPath, goldenNormalizedPath)

    let diff = ''
    try {
      diff = execSync(`diff -u "${goldenNormalizedPath}" "${normalizedPath}"`, { encoding: 'utf8' })
    } catch (error) {
      diff = error.stdout || error.message
      failed = true
    }

    if (diff) {
      console.error(`Golden diff for ${file}:\n${diff}`)
    } else {
      console.log(`${file}: OK`)
    }
  }

  process.exit(failed ? 1 : 0)
}

run()
