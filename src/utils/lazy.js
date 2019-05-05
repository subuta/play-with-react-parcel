import React, { Suspense } from 'react'
import Promise from 'bluebird'
import _ from 'lodash'

import {
  Consumer as UniversalConsumer
} from './universal'

const KEY = '__LAZY__'

let lazyComponents = new Map()

const resolveDefaultExports = (module) => module.default || module

const prefetchComponent = async (modulePath) => {
  // Register into lazyComponents map.
  const factory = lazyComponents.get(modulePath)
  if (!factory) return

  const module = await factory()
  return resolveDefaultExports(module)
}

// Prefetch registered dynamic imports.
// SEE: https://hackernoon.com/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d
const prefetch = async () => {
  // Parse embeded modulePaths of window.
  if (!window[KEY]) throw new Error(`Prefetch module failed, error = ${KEY} is not defined.`)
  const keys = window[KEY]
  // Delegate component resolution to `prefetchComponent`
  const modules = await Promise.map(keys, (modulePath) => prefetchComponent(modulePath))
  return _.zipObject(keys, modules)
}

// Embed modulePaths for prefetch.
const getScriptTag = (modulePaths = []) => {
  return `<script>${`window.${KEY} = ${JSON.stringify(modulePaths)};`}</script>`
}

export {
  getScriptTag,
  prefetchComponent,
  prefetch
}

// Borrowed from: https://github.com/theKashey/react-imported-component/blob/master/src/LazyBoundary.js
export default (factory, modulePath) => {
  let Component = resolveDefaultExports(factory)

  // Register into lazyComponents map.
  lazyComponents.set(modulePath, Component)

  return () => {
    return (
      <UniversalConsumer>
        {({ prefetched }) => {
          // FIXME: Remove these workarounds when React.{Suspense,Lazy} supports SSR.
          // Skip suspense if component already prefetched.
          if (_.has(prefetched, modulePath)) {
            Component = prefetched[modulePath]
            return (
              <React.Fragment>
                <Component />
              </React.Fragment>
            )
          }

          // Wrap dynamic import with React.lazy
          const LazyComponent = React.lazy(Component)

          // Use suspense otherwise.
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyComponent />
            </Suspense>
          )
        }}
      </UniversalConsumer>
    )
  }
}
