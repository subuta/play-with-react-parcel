import React from 'react'
import { withRouter } from 'react-router'

import _ from 'lodash'
import {
  compose,
  withStateHandlers,
  lifecycle,
  branch,
  renderComponent
} from 'recompose'

import {
  UniversalContext
} from './universal'

const isBrowser = typeof window !== 'undefined'
const KEY = '__INITIAL_PROPS__'

// Get initialProps from ctx.
export const getPrefetchedInitialProps = (ctx) => {
  // Get initialProps from window if browser
  if (isBrowser) return _.get(window, KEY, {})
  // Get initialProps from ctx otherwise.
  return _.get(ctx, ['state', KEY], {})
}

// Reset prefetchedInitialProps for re-trigger getInitialProps call.
export const resetPrefetchedInitialProps = () => {
  if (!isBrowser) return
  _.set(window, KEY, {})
}

// Loader component.
const withLoader = branch(
  ({ isLoading }) => isLoading,
  renderComponent(() => null),
  _.identity
)

export const withInitialProps = (moduleId, getInitialProps) => (Component) => {
  Component.moduleId = moduleId
  Component.getInitialProps = getInitialProps

  const enhance = compose(
    withRouter,
    withStateHandlers(
      () => ({
        isLoading: false,
        initialProps: null
      }),
      {
        loading: () => () => ({ isLoading: true }),
        setInitialProps: () => (initialProps) => ({ isLoading: false, initialProps })
      }
    ),
    lifecycle({
      async componentDidMount () {
        const {
          loading,
          setInitialProps
        } = this.props

        // Skip for initial-render.
        const prefetchedInitialProps = _.get(getPrefetchedInitialProps(), [moduleId])

        if (prefetchedInitialProps) return

        // Show loader.
        loading()

        const initialProps = await getInitialProps(this.props)

        // Hide loader and show component.
        setInitialProps(initialProps)
      },

      async componentWillUnmount () {
        resetPrefetchedInitialProps()
      }
    }),
    withLoader
  )

  return () => (
    <UniversalContext.Consumer>
      {(contextProps) => {
        const EnhancedComponent = enhance((props) => {
          const initialProps = props.initialProps || _.get(contextProps, ['initialProps', moduleId]) || {}
          return (
            <Component {...initialProps} />
          )
        })
        return <EnhancedComponent />
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
