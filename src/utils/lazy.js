import React, { lazy, Suspense } from 'react'
import Promise from 'bluebird'

const isBrowser = typeof window !== 'undefined'

const prefetchedComponents = new Map()
let factories = []

let hasPrefetched = false

const resolveDefaultExports = (module) => module.default || module

// Prefetch registered dynamic imports.
// SEE: https://hackernoon.com/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d
export const prefetch = () => Promise.map(factories, async (factory) => {
  const module = await factory()
  // Set pre-fetched components.
  prefetchedComponents.set(factory, resolveDefaultExports(module))
  return module
}).then(() => {
  // Clear queued factories.
  factories = []
  hasPrefetched = true
})

// Borrowed from: https://github.com/theKashey/react-imported-component/blob/master/src/LazyBoundary.js
export default (factory) => {
  let Component = resolveDefaultExports(factory)

  const render = () => (
    <React.Fragment>
      <Component />
    </React.Fragment>
  )

  if (!isBrowser) return render

  // Queue factories for prefetch.
  if (!hasPrefetched) {
    factories.push(factory)
  }

  return () => {
    // FIXME: Remove these workarounds when React.{Suspense,Lazy} supports SSR.
    // Skip suspense if component already loaded.
    if (prefetchedComponents.has(factory)) {
      Component = prefetchedComponents.get(factory)
      return render()
    }

    // Wrap dynamic import with React.lazy
    const LazyComponent = lazy(Component)

    // Use suspense otherwise.
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    )
  }
}
