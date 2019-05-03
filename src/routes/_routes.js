import codegen from 'babel-plugin-codegen/macro'

import React from 'react'
import _ from 'lodash'
import lazy from '/utils/lazy'

const isServer = typeof window === 'undefined'

// Swap routes into lazy-components code.
// SEE: https://github.com/kentcdodds/babel-plugin-codegen
const routes = codegen.require('../utils/dynamicRoutes.js')

export default () => (
  <React.Fragment>
    {_.map(routes, (Route, i) => (
      <Route key={i} />
    ))}
  </React.Fragment>
)
