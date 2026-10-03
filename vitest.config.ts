import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { defineConfig } from 'vitest/config'

const browserEnabled = process.env.BROWSER === 'true'

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    environment: browserEnabled ? undefined : 'jsdom',
    include: ['tests/unit/**/*.spec.js', 'tests/sass/**/*.spec.js'],
    setupFiles: ['./tests/unit/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'js/coverage',
      include: ['js/src/**/*.js']
    },
    browser: browserEnabled ?
      {
        enabled: true,
        provider: 'playwright',
        instances: [{ browser: 'chromium', headless: true }]
      } :
      undefined
  },
  resolve: {
    alias: {}
  },
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js']
    })
  ]
})
