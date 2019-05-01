import React from 'react'
import ReactDOM from 'react-dom'

import App from '/client/App'

import { getInitialProps } from '/utils/initialProps'

import '/client/index.css'

ReactDOM.hydrate(
  <App {...getInitialProps()} />,
  document.getElementById('app')
)
