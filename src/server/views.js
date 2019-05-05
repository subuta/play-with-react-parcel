import Router from 'koa-router'
import ssr from './ssr'

import App from '/client/App'

const router = new Router()

// Render all routes by SSR module.
router.get('/*', async (ctx) => {
  ctx.body = await ssr(ctx, App)
})

export default router
