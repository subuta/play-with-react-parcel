import React, { lazy, Suspense } from 'react'

const isBrowser = typeof window !== 'undefined'

// Borrowed from: https://github.com/theKashey/react-imported-component/blob/master/src/LazyBoundary.js
export default (Component) => {
  if (isBrowser) {
    // Wrap dynamic import with React.lazy
    Component = lazy(Component)
  } else {
    return () => <React.Fragment><Component /></React.Fragment>
  }

  return () => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  )
}
