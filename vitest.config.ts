import { defineConfig } from 'vitest/config'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'

const jqueryMajor = process.env.JQUERY === '4' ? '4' : '3'
const bundleMode = process.env.BUNDLE === 'true'
const browserEnabled = process.env.BROWSER === 'true'

export default defineConfig({
  test: {
    globals: false,
    environment: browserEnabled ? undefined : 'jsdom',
    include: ['tests/unit/**/*.spec.js', 'tests/sass/**/*.spec.js'],
    setupFiles: ['./tests/unit/setup.js'],
    env: {
      JQUERY: jqueryMajor,
      BUNDLE: bundleMode ? 'true' : 'false'
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
