const path = require('path')
const moduleAlias = require('module-alias')

global.require = require('esm')(module)

const dev = process.env.NODE_ENV !== 'production'

const ROOT_DIR = path.resolve(__dirname, './')
let baseDir = path.resolve(ROOT_DIR, './dist')

require('loud-rejection/register')

if (dev) {
  baseDir = path.resolve(ROOT_DIR, 'src')
  require('@babel/register')
  require('@babel/polyfill')
}

// Make server-side module resolution compatible with parcel way.
moduleAlias.addAlias('src', baseDir)
