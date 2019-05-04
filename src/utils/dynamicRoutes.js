// Cannot use import statement on build-time(codegen) phase.
// SEE: https://github.com/kentcdodds/babel-plugin-codegen

const _ = require('lodash')
const fs = require('fs')

const {
  ROUTES_JSON_PATH
} = require('../server/config')

// Read routes.json at build-time.
const routes = JSON.parse(fs.readFileSync(ROUTES_JSON_PATH, 'utf8'))

// Construct each routes as lazy-component definition.
module.exports = `
  [
    ${_.map(routes, (path) => `{
      path: '/${path}',
      Component: lazy(() => import('./${path}'), '${path}'),
      exact: true
    }`)}
  ]
`
