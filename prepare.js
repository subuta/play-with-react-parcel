const path = require('path')

global.require = require('esm')(module)

const dev = process.env.NODE_ENV !== 'production'

const ROOT_DIR = path.resolve(__dirname, './')
let baseDir = path.resolve(ROOT_DIR, './dist')

require('loud-rejection/register')
require('app-module-path').addPath(__dirname)

if (dev) {
  baseDir = path.resolve(ROOT_DIR, './src')
  require('@babel/register')
  require('@babel/polyfill')
}

require('app-module-path').addPath(baseDir)
