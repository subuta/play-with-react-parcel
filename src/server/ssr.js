import React from 'react'
import { renderToString } from 'react-dom/server'

import ssrPrepass from 'react-ssr-prepass'
import { Helmet } from 'react-helmet'

import { source } from 'common-tags'

import fs from 'fs'
import path from 'path'
import pkgDir from 'pkg-dir'

import {
  getInitialProps,
  getInitialPropsVisitor,
  getScriptTag as printInitialPropsScript
} from '/utils/initialProps'

const dev = process.env.NODE_ENV !== 'production'

const ROOT_DIR = pkgDir.sync()
const ASSETS_JSON_PATH = path.resolve(ROOT_DIR, './dist/client/assets.json')

// Load hashmark's assets-map JSON for production.
let assetsJson = {}
if (!dev && fs.existsSync(ASSETS_JSON_PATH)) {
  assetsJson = require(ASSETS_JSON_PATH)
}

// Resolve hashed assets of production build.
const resolveAssets = (filePath) => {
  return assetsJson[filePath] ? assetsJson[filePath] : filePath
}

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
        
        <link rel='stylesheet' href='${resolveAssets('client.css')}'>
        <meta charset='utf-8'>
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id='app'>${content}</div>
        
        ${printInitialPropsScript(ctx)}
        <script src='${resolveAssets('client.js')}'></script>
      </body>
    </html>
  `
}
