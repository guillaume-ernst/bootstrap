'use strict'

const pkg = require('../package.json')
const year = new Date().getFullYear()
const author = typeof pkg.author === 'string' ? pkg.author : pkg.author.name

function getBanner(pluginFilename) {
  return `/*!
  * Bootstrap${pluginFilename ? ` ${pluginFilename}` : ''} v${pkg.version} (${pkg.homepage})
  * Copyright 2011-${year} ${author}
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */`
}

module.exports = getBanner
