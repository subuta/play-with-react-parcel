import React from 'react'
import { renderToString } from 'react-dom/server'

import ssrPrepass from 'react-ssr-prepass'
import { Helmet } from 'react-helmet'

import { source } from 'common-tags'

import {
  getInitialProps,
  getInitialPropsVisitor,
  getScriptTag as printInitialPropsScript
} from '/utils/initialProps'

export default async (ctx, App) => {
  // Pre-render App for data fetching.
  await ssrPrepass(<App />, getInitialPropsVisitor(ctx))

  // Render App
  const content = renderToString(
    <App {...getInitialProps(ctx)} />
  )

  // Render helmet related codes(head tag)
  const helmet = Helmet.renderStatic()

  // Return HTML
  return source`
    <!DOCTYPE html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            
            <link rel='stylesheet' href='client-entry.css'>
            <meta charset='utf-8'>
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            <div id='app'>${content}</div>
            
            ${printInitialPropsScript(ctx)}
            <script src='client-entry.js'></script>
        </body>
    </html>
  `
}
