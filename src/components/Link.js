import React from 'react'
import { withRouter } from 'react-router-dom'

import _ from 'lodash'

import {
  compose,
  withHandlers
} from 'recompose'

import getRoute from '/utils/routes'

import {
  Consumer as UniversalConsumer
} from '/utils/universal'

const resolveDefaultExports = (module) => module.default || module

const enhance = compose(
  withRouter,
  withHandlers(() => {
    let cache = {}

    return {
      doPrefetch: (props) => async () => {
        if (!props.prefetch) return

        const found = getRoute(props.to)
        if (!found) return

        const { route, routerProps } = found

        let Component = await route.prefetch()
        Component = resolveDefaultExports(Component)

        const {
          moduleId,
          initialProps
        } = await Component.getInitialProps(routerProps)

        cache[moduleId] = initialProps
      },

      go: ({ to, history, prefetch }) => (e, contextProps) => {
        e.preventDefault()

        if (!prefetch) {
          history.push(to)
          return
        }

        // If cache has value.
        if (!_.isEmpty(cache)) {
          contextProps.setInitialProps({
            [to]: cache
          })
        }

        history.push(to)

        cache = {}
      }
    }
  })
)

export default enhance((props) => {
  const {
    children,
    doPrefetch,
    go,
    ...rest
  } = props

  return (
    <UniversalConsumer>
      {(contextProps) => {
        return (
          <a
            onMouseEnter={() => doPrefetch(contextProps)}
            onClick={(e) => go(e, contextProps)}
            href={rest.to}
          >
            {children}
          </a>
        )
      }}
    </UniversalConsumer>
  )
})
