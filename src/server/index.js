import Koa from 'koa'
import consola from 'consola'

import Router from 'koa-router'
import koaBody from 'koa-body'
import serve from 'koa-static'

import path from 'path'

import { source } from 'common-tags'

import _ from 'lodash'

import React from 'react'
import { renderToString } from 'react-dom/server'

import ssrPrepass from 'react-ssr-prepass'
import { Helmet } from 'react-helmet'

import App from 'src/client/App'
import {
  setInitialProps,
  getInitialProps,
  getScriptTag as printInitialPropsScript
} from 'src/utils/initialProps'

import pkgDir from 'pkg-dir'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const ROOT_DIR = pkgDir.sync()

const STATIC_CLIENT_DIR = path.resolve(ROOT_DIR, './dist/client')

const app = new Koa()

const router = new Router()

app.use(serve(STATIC_CLIENT_DIR))

// GET /
router.get('/:id', async (ctx) => {
  ctx.state.initialProps = {}

  await ssrPrepass(<App />, (element, instance) => {
    if (element && element.type.getInitialProps) {
      return element.type.getInitialProps(ctx).then((initialProps) => {
        setInitialProps(ctx, initialProps)
      })
    }
  })

  const content = renderToString(
    <App {...getInitialProps(ctx)} />
  )
  const helmet = Helmet.renderStatic()

  ctx.body = source`
    <!DOCTYPE html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            
            <link rel='stylesheet' href='index.css'>
            <meta charset='utf-8'>
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            <div id='app'>${content}</div>
            
            ${printInitialPropsScript(ctx)}
            <script src='index.js'></script>
        </body>
    </html>
  `
})

// Parse body
app.use(koaBody())

app.use(router.routes(), router.allowedMethods())

app.listen(port, () => {
  consola.info(`🚀 Server ready at http://localhost:${port}`)
})
