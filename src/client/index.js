import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import { getInitialProps } from '../utils/initialProps'

import './index.css'

ReactDOM.hydrate(
  <App {...getInitialProps()} />,
  document.getElementById('app')
)
