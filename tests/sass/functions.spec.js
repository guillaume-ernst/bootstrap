import { describe, it, expect } from 'vitest'
import { compileStringAsync } from 'sass'

describe('bootstrap sass functions', () => {
  it('divide(10, 4) returns 2.5', async () => {
    const result = await compileStringAsync(`
      @import "scss/functions";
      .test { width: divide(10, 4); }
    `)
    expect(result.css).toContain('width: 2.5')
  })

  it('add() supports calc for incompatible units', async () => {
    const result = await compileStringAsync(`
      @import "scss/functions";
      .test { width: add(1rem, 2px); }
    `)
    expect(result.css).toContain('calc(1rem + 2px)')
  })
})
