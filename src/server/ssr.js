import React from 'react'
import { renderToString } from 'react-dom/server'

import ssrPrepass from 'react-ssr-prepass'
import { Helmet } from 'react-helmet'

import _ from 'lodash'
import { source } from 'common-tags'

import fs from 'fs'
import path from 'path'
import pkgDir from 'pkg-dir'

import { StaticRouter } from 'react-router-dom'

import getRoute from '/utils/routes'

import {
  getPrefetchedInitialProps,
  getInitialPropsVisitor,
  getScriptTag as printInitialPropsScript
} from '/utils/initialProps'

import {
  prefetchComponent,
  getScriptTag as printPrefetchedModulePaths
} from '/utils/lazy'

import {
  Provider as UniversalProvider
} from '/utils/universal'

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
  // Ignore request with file extension.
  if (ctx.url.split('.').length > 1) return

  // This context object contains the results of the render
  const context = {}

  // Ignore unknown route.
  // FIXME: Better 404 handling.
  const found = getRoute(ctx.url)
  if (!found) return

  const { route, routerProps } = found

  const Component = await prefetchComponent(route.modulePath)

  const ServerApp = (props) => (
    <StaticRouter
      location={ctx.url}
      context={context}
    >
      <App {...props} />
    </StaticRouter>
  )

  // Pre-render App for data fetching.
  await ssrPrepass(
    <UniversalProvider value={{
      prefetched: { [route.modulePath]: Component }
    }}>
      <ServerApp />
    </UniversalProvider>
    , getInitialPropsVisitor(ctx, routerProps)
  )

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
    ctx.redirect(context.url)
    return
  }

  // TODO: サーバ側でwithInitialPropsにctxを渡す方法を探す。(context経由が良さそう？)
  // TODO: matchの値が変なのの修正 -> withRouterの評価タイミング？

  // Render App
  const content = renderToString(
    <UniversalProvider value={{
      prefetched: { [route.modulePath]: Component },
      initialProps: getPrefetchedInitialProps(ctx)
    }}>
      <ServerApp />
    </UniversalProvider>
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
        
        <link rel='stylesheet' href='/${resolveAssets('client.css')}'>
        <meta charset='utf-8'>
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id='app'>${content}</div>
        
        ${printInitialPropsScript(ctx)}
        ${printPrefetchedModulePaths([route.modulePath])}
        <script src='/${resolveAssets('client.js')}'></script>
      </body>
    </html>
  `
}
