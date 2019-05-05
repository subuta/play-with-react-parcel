// Cannot use import statement on build-time(codegen) phase.
// SEE: https://github.com/kentcdodds/babel-plugin-codegen

const _ = require('lodash')
const fs = require('fs')

const generateRoutesJson = require('../server/utils/generateRoutesJson')

// Read routes.json at build-time.
let routes = generateRoutesJson()

routes = _.map(routes, modulePath => {
  let path = `/${modulePath}`
  // Treat routes/index.js as root(`/`) path.
  if (modulePath === 'index') {
    path = '/'
  }
  return {
    path,
    modulePath: modulePath,
    exact: true
  }
})

// Construct each routes as lazy-component definition.
module.exports = `
  [
    ${_.map(routes, ({ path, exact, modulePath }) => `{
      path: '${path}',
      Component: lazy(() => import('./${modulePath}'), '${modulePath}'),
      exact: ${exact},
      modulePath: '${modulePath}'
    }`)}
  ]
`
