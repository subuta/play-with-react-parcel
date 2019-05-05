import codegen from 'babel-plugin-codegen/macro'

import React from 'react'

import { matchPath } from 'react-router'
import { Route, Switch } from 'react-router-dom'

import _ from 'lodash'
import lazy from '/utils/lazy'

// react-router match compatible props.
const ROUTE_PROPS = ['path', 'exact']

// Swap routes into lazy-components code.
// SEE: https://github.com/kentcdodds/babel-plugin-codegen
const routes = codegen.require('../utils/dynamicRoutes.js')

// Find single route from dynamicRoutes.
export const findRoute = (pathname) => _.find(routes, (route) => matchPath(pathname, _.pick(route, ROUTE_PROPS)))
export const matchRoute = (pathname, route) => matchPath(pathname, _.pick(route, ROUTE_PROPS))

export default () => (
  <Switch>
    {_.map(routes, (route) => {
      const {
        path,
        Component,
        exact = false
      } = route

      return (
        <Route
          key={path}
          path={path}
          component={Component}
          exact={exact}
        />
      )
    })}
  </Switch>
)
