import React from 'react'

import _ from 'lodash'

import {
  compose,
  withStateHandlers,
} from 'recompose'

const UniversalContext = React.createContext({
  prefetched: {},
  initialProps: {},
  setInitialProps: () => {}
})

const Consumer = UniversalContext.Consumer
const RawProvider = UniversalContext.Provider

const enhance = compose(
  withStateHandlers(
    ({ value }) => ({
      prefetched: value.prefetched || {},
      initialProps: value.initialProps || {}
    }),
    {
      setInitialProps: (state) => (initialProps) => {
        const nextProps = {
          ...state.initialProps,
          ...initialProps
        }

        // Ignore no-changes.
        if (_.isEqual(state.initialProps, nextProps)) return

        return {
          initialProps: nextProps
        }
      },

      omitInitialProps: (state) => (keyToOmit) => {
        console.log(state.initialProps, keyToOmit)

        const nextProps = _.omitBy(state.initialProps, (value, key) => _.startsWith(key, keyToOmit))

        if (_.isEqual(state.initialProps, nextProps)) return

        console.log('diff!', nextProps)

        return {
          initialProps: nextProps
        }
      },
    }
  )
)

const Provider = enhance((props) => {
  const {
    children,
    ...rest
  } = props

  return (
    <RawProvider value={rest}>
      {children}
    </RawProvider>
  )
})

export {
  Consumer,
  Provider
}
