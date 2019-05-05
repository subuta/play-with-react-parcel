import React from 'react'
import ReactDOM from 'react-dom'

import App from '/client/App'

import { BrowserRouter } from 'react-router-dom'

import { getPrefetchedInitialProps } from '/utils/initialProps'
import { prefetch } from '/utils/lazy'
import { UniversalContext } from '/utils/universal'

import '/client/index.css'

const main = async () => {
  const prefetched = await prefetch()

  ReactDOM.hydrate(
    <BrowserRouter>
      <UniversalContext.Provider value={{
        prefetched,
        initialProps: getPrefetchedInitialProps()
      }}>
        <App />
      </UniversalContext.Provider>
    </BrowserRouter>,
    document.getElementById('app')
  )
}

main()
