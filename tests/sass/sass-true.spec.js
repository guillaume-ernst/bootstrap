// Runs the upstream sass-true specs (scss/tests/**/*.test.scss) through Vitest.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'node:fs'
import { describe, it } from 'vitest'
import { runSass } from 'sass-true'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const testFiles = globSync('scss/tests/**/*.test.scss', { cwd: ROOT })

for (const file of testFiles) {
  const filename = path.join(ROOT, file)
  const data = fs.readFileSync(filename, 'utf8')
  const sassString = `$true-terminal-output: false; @import "true";\n${data}`

  runSass(
    { describe, it, sourceType: 'string' },
    sassString,
    { loadPaths: [path.dirname(filename), path.join(ROOT, 'scss')] }
  )
}
