import Koa from 'koa'
import consola from 'consola'

import koaBody from 'koa-body'
import serve from 'koa-static'
import logger from 'koa-logger'

import path from 'path'
import pkgDir from 'pkg-dir'

import views from './server/views.js'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const ROOT_DIR = pkgDir.sync()
const STATIC_CLIENT_DIR = path.resolve(ROOT_DIR, './dist/client')

const app = new Koa()

app.use(serve(STATIC_CLIENT_DIR))

app.use(logger())

// Parse body
app.use(koaBody())

app.use(views.routes(), views.allowedMethods())

app.listen(port, () => {
  consola.info(`🚀 Server ready at http://localhost:${port}`)
})
