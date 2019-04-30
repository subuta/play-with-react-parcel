import Router from 'koa-router'
import ssr from './ssr'

import App from 'src/client/App'

const router = new Router()

// GET /
router.get('/:id', async (ctx) => {
  ctx.body = await ssr(ctx, App)
})

export default router
