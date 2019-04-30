import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Helmet } from 'react-helmet'

import _ from 'lodash'

import { hot } from 'react-hot-loader'

import asLazy from 'src/components/asLazy'

const isServer = typeof window === 'undefined'

const LazyChild = asLazy(isServer ? require('./Child') : () => import('./Child'))

const App = hot(module)((props) => {
  const { id, joke } = props

  return (
    <div>
      <Helmet>
        <title>{joke}</title>
        <meta name='description' content={joke} />
      </Helmet>

      <h1>{id}:{joke}</h1>

      <LazyChild />
    </div>
  )
})

App.getInitialProps = async function (ctx) {
  const id = Number(ctx.params.id || '123')
  const jokes = await fetch(`http://api.icndb.com/jokes/${id}`).then((res) => res.json())

  const value = _.get(jokes, 'value')

  return { id: value.id, joke: value.joke }
}

export default App
