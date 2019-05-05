import Router from 'koa-router'
import ssr from './ssr'

import App from '/client/App'

const router = new Router()

// GET /
router.get('/*', async (ctx) => {
  ctx.body = await ssr(ctx, App)
})

export default router
