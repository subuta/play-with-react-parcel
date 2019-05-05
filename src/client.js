import React from 'react'
import ReactDOM from 'react-dom'

import App from '/client/App'

import { BrowserRouter } from 'react-router-dom'

import { getPrefetchedInitialProps } from '/utils/initialProps'
import { prefetch } from '/utils/lazy'
import { Provider as UniversalProvider } from '/utils/universal'

import '/client/index.css'

const main = async () => {
  const prefetched = await prefetch()

  ReactDOM.hydrate(
    <BrowserRouter>
      <UniversalProvider value={{
        prefetched,
        initialProps: getPrefetchedInitialProps()
      }}>
        <App />
      </UniversalProvider>
    </BrowserRouter>,
    document.getElementById('app')
  )
}

main()
