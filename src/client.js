import React from 'react'
import ReactDOM from 'react-dom'

import App from '/client/App'

import { BrowserRouter } from 'react-router-dom'

import { getInitialProps } from '/utils/initialProps'
import {
  prefetch,
  LazyContext
} from '/utils/lazy'

import '/client/index.css'

const main = async () => {
  const prefetched = await prefetch()

  ReactDOM.hydrate(
    <BrowserRouter>
      <LazyContext.Provider value={{ prefetched }}>
        <App {...getInitialProps()} />
      </LazyContext.Provider>
    </BrowserRouter>,
    document.getElementById('app')
  )
}

main()
