import Koa from 'koa'
import consola from 'consola'

import koaBody from 'koa-body'
import serve from 'koa-static'
import logger from 'koa-logger'

import views from './server/views.js'

import {
  STATIC_CLIENT_DIR
} from './server/config'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = new Koa()

app.use(serve(STATIC_CLIENT_DIR))

app.use(logger())

// Parse body
app.use(koaBody())

app.use(views.routes(), views.allowedMethods())

app.listen(port, () => {
  consola.info(`🚀 Server ready at http://localhost:${port}`)
})
