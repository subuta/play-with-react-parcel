import {
  findRoute,
  matchRoute
} from '/routes/_routes'
import { createLocation } from 'history'

export default (ctx) => {
  // Ignore unknown route.
  // FIXME: Better 404 handling.
  const route = findRoute(ctx.url)
  // console.log(ctx.url, 'route = ', route)
  if (!route) return

  const location = createLocation(ctx.url)

  return {
    route,
    routerProps: {
      location,
      match: matchRoute(location.pathname, route)
    }
  }
}
