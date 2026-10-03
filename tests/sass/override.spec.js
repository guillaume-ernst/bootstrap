import { describe, it, expect } from 'vitest'
import { compileAsync } from 'sass'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('sass overrides', () => {
  it('compiles bootstrap with overridden $primary via @import', async () => {
    const file = path.resolve(__dirname, 'override-import.scss')
    const result = await compileAsync(file, { style: 'expanded' })
    expect(result.css).toContain('.btn-primary')
    expect(result.css).toContain('#123456')
  })

  it('compiles bootstrap with overridden $primary via @use ... with()', async () => {
    const file = path.resolve(__dirname, 'override-use.scss')
    const result = await compileAsync(file, { style: 'expanded' })
    expect(result.css).toContain('.btn-primary')
    expect(result.css).toContain('#123456')
  })
})
