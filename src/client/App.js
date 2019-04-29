import React, { lazy, Suspense } from 'react'
import fetch from 'isomorphic-unfetch'
import { Helmet } from 'react-helmet'

import _ from 'lodash'

import { hot } from 'react-hot-loader'

// FIXME: more better syntax.
const Dynamic = process.env.SERVER ? require('./Dynamic').default : lazy(() => import('./Dynamic'))

const App = hot(module)((props) => {
  const { id, joke } = props

  return (
    <div>
      <Helmet>
        <title>{joke}</title>
        <meta name='description' content={joke} />
      </Helmet>

      <h1>{id}:{joke}</h1>

      {process.env.SERVER ? <Dynamic /> : <Suspense fallback={<div>Loading...</div>}><Dynamic /></Suspense>}
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
