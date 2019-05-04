import codegen from 'babel-plugin-codegen/macro'

import React from 'react'

import { matchPath } from 'react-router'
import { Route, Switch } from 'react-router-dom'

import _ from 'lodash'
import lazy from '/utils/lazy'

// Swap routes into lazy-components code.
// SEE: https://github.com/kentcdodds/babel-plugin-codegen
const routes = codegen.require('../utils/dynamicRoutes.js')

// Find single route from dynamicRoutes.
export const findRoute = (pathname) => _.find(routes, (route) => matchPath(pathname, route))

export default () => (
  <Switch>
    {_.map(routes, ({ path, Component }) => (
      <Route
        key={path}
        path={path}
        component={Component}
        exact
      />
    ))}
  </Switch>
)
