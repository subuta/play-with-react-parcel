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
  Consumer as UniversalConsumer
} from './universal'

const isBrowser = typeof window !== 'undefined'
const KEY = '__INITIAL_PROPS__'

// SEE: https://stackoverflow.com/questions/16376438/get-path-and-query-string-from-url-using-javascript
export const getUrl = (location) => {
  return `${location.pathname}${location.search}`
}

// Get initialProps from ctx.
export const getPrefetchedInitialProps = (ctx) => {
  // Get initialProps from window if browser
  if (isBrowser) return _.get(window, [KEY], {})
  // Get initialProps from ctx otherwise.
  return _.get(ctx, ['state', KEY], {})
}

// Loader component.
const withLoader = branch(
  ({ isLoading }) => isLoading,
  renderComponent(() => <div>...loading</div>),
  _.identity
)

export const withInitialProps = (moduleId, getInitialProps) => (Component) => {
  Component.moduleId = moduleId
  Component.getInitialProps = getInitialProps

  const render = () => (
    <UniversalConsumer>
      {(contextProps) => {
        const enhance = compose(
          withRouter,
          withStateHandlers(
            ({ location }) => ({
              isLoading: false,
              initialProps: _.get(contextProps, ['initialProps', getUrl(location)], null)
            }),
            {
              startLoading: () => () => ({ isLoading: true }),
              doneLoading: () => () => ({ isLoading: false }),
              setInitialProps: () => (initialProps) => ({ initialProps })
            }
          ),
          lifecycle({
            async componentDidMount () {
              const {
                startLoading,
                doneLoading,
                setInitialProps
              } = this.props

              // For better memory-usage.
              contextProps.cleanUnusedInitialProps()

              // Skip if already prefetched.
              if (this.props.initialProps) return

              // Show loader.
              startLoading()

              const initialProps = await getInitialProps(this.props)

              // Skip update state if unmounted.
              if (this.unmounted) return

              // Hide loader and show component.
              setInitialProps({
                [moduleId]: initialProps
              })

              doneLoading()
            },

            componentWillUnmount () {
              this.unmounted = true
            }
          }),
          withLoader
        )

        const EnhancedComponent = enhance((props) => {
          const initialProps = _.get(props, ['initialProps', moduleId]) || _.get(contextProps, ['initialProps', moduleId]) || {}
          return (
            <Component {...initialProps} />
          )
        })
        return <EnhancedComponent />
      }}
    </UniversalConsumer>
  )

  render.getInitialProps = async (args) => {
    const initialProps = await getInitialProps(args)
    return { moduleId, initialProps }
  }

  return render
}

// Custom visitor function of react-ssr-prepass for allowing next.js style data fetching.
export const getInitialPropsVisitor = (ctx, routerProps) => (element, instance) => {
  const moduleId = _.get(element, 'type.moduleId')
  if (element && moduleId && _.get(element, 'type.getInitialProps')) {
    return element.type.getInitialProps(routerProps).then((initialProps) => {
      _.set(ctx, ['state', KEY, ctx.url, moduleId], initialProps)
    })
  }
}

export const getScriptTag = (ctx) => {
  return `<script>${`window.${KEY} = ${JSON.stringify(getPrefetchedInitialProps(ctx))};`}</script>`
}
