'use strict'

const path = require('node:path')
const { babel } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const banner = require('./banner.js')

const BUNDLE = process.env.BUNDLE === 'true'
const ESM = process.env.ESM === 'true'

const fileDest = ESM ? 'bootstrap.esm.js' : (BUNDLE ? 'bootstrap.bundle.js' : 'bootstrap.js')
const external = BUNDLE ? ['jquery'] : ['jquery', '@popperjs/core']
const globals = {
  jquery: 'jQuery',
  '@popperjs/core': 'Popper'
}

const plugins = [
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled'
  })
]

if (BUNDLE || ESM) {
  plugins.push(nodeResolve())
}

const output = {
  // Rollup calls output.banner with the chunk; getBanner takes a filename.
  banner: () => banner(),
  file: path.resolve(__dirname, `../dist/js/${fileDest}`),
  format: ESM ? 'esm' : 'umd',
  name: 'bootstrap',
  globals,
  generatedCode: 'es2015'
}

if (ESM) {
  output.exports = 'named'
}

module.exports = {
  input: path.resolve(__dirname, '../js/index.js'),
  output,
  external,
  plugins
}
