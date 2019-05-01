import React from 'react'
import ReactDOM from 'react-dom'

import App from '/client/App'

import { getInitialProps } from '/utils/initialProps'
import { prefetch } from '/utils/lazy'

import '/client/index.css'

prefetch().then(() => {
  ReactDOM.hydrate(
    <App {...getInitialProps()} />,
    document.getElementById('app')
  )
})
