// Keep config at cjs format for babel-plugin-codegen friendly code :(

const pkgDir = require('pkg-dir')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'

const ROOT_DIR = pkgDir.sync()
const STATIC_CLIENT_DIR = path.resolve(ROOT_DIR, './dist/client')

const ROUTES_DIR = path.resolve(ROOT_DIR, './src/routes')

const config = {
  ROOT_DIR,
  STATIC_CLIENT_DIR,

  ROUTES_DIR
}

module.exports = {
  ...config,
  default: config
}
