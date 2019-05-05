import React from 'react'
import { hot } from 'react-hot-loader'

import { css } from 'astroturf'

import Layout from '/components/Layout'
import Routes from '/routes/_routes'

import lazy from '/utils/lazy'

// language=PostCSS
const styles = css`
  .joke {
    @apply font-bold;
  }
`

const App = (props) => {
  return (
    <Layout>
      <Routes />
    </Layout>
  )
}

export default hot(module)(App)
