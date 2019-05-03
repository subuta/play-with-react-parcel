// Keep config at cjs format for babel-plugin-codegen friendly code :(

const pkgDir = require('pkg-dir')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'

const ROOT_DIR = pkgDir.sync()
const STATIC_CLIENT_DIR = path.resolve(ROOT_DIR, './dist/client')

const ROUTES_DIR = dev ? path.resolve(ROOT_DIR, './src/routes') : path.resolve(ROOT_DIR, './dist/routes')
const ROUTES_JSON_PATH = dev ? path.resolve(ROOT_DIR, './dist/routes.json') : path.resolve(ROOT_DIR, './dist/routes.json')

const config = {
  ROOT_DIR,
  STATIC_CLIENT_DIR,

  ROUTES_DIR,
  ROUTES_JSON_PATH
}

module.exports = {
  ...config,
  default: config
}
