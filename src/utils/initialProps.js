import React from 'react'

import {
  UniversalContext
} from './universal'

import _ from 'lodash'

const isBrowser = typeof window !== 'undefined'
const KEY = '__INITIAL_PROPS__'

// Get initialProps from ctx.
export const getPrefetchedInitialProps = (ctx) => {
  // Get initialProps from window if browser
  if (isBrowser) return _.get(window, KEY, {})
  // Get initialProps from ctx otherwise.
  return _.get(ctx, ['state', KEY], {})
}

export const withInitialProps = (moduleId, getInitialProps) => (Component) => {
  Component.moduleId = moduleId
  Component.getInitialProps = getInitialProps
  return () => (
    <UniversalContext.Consumer>
      {(props) => {
        const initialProps = _.get(props, ['initialProps', moduleId], {})
        return (
          <Component {...initialProps} />
        )
      }}
    </UniversalContext.Consumer>
  )
}

// Custom visitor function of react-ssr-prepass for allowing next.js style data fetching.
export const getInitialPropsVisitor = (ctx, routerProps) => (element, instance) => {
  const moduleId = _.get(element, 'type.moduleId')
  if (element && moduleId && _.get(element, 'type.getInitialProps')) {
    return element.type.getInitialProps(routerProps).then((initialProps) => {
      _.set(ctx, ['state', KEY, moduleId], initialProps)
    })
  }
}

export const getScriptTag = (ctx) => {
  return `<script>${`window.${KEY} = ${JSON.stringify(getPrefetchedInitialProps(ctx))};`}</script>`
}
