// Cannot use import statement on build-time(codegen) phase.
// SEE: https://github.com/kentcdodds/babel-plugin-codegen

const codegen = require('babel-plugin-codegen/macro')

const React = require('react')
const _ = require('lodash')

const lazy = require('/utils/lazy').default

const isServer = typeof window === 'undefined'

// Load generated lazy-components.
const routes = codegen.require('../utils/dynamicRoutes.js')

module.exports = () => (
  <React.Fragment>
    {_.map(routes, (Route, i) => (
      <Route key={i} />
    ))}
  </React.Fragment>
)
