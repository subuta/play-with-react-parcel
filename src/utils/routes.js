import {
  findRoute,
  matchRoute
} from '/routes/_routes'
import { createLocation } from 'history'

export default (url) => {
  // Ignore unknown route.
  const route = findRoute(url)
  // console.log(ctx.url, 'route = ', route)
  if (!route) return

  const location = createLocation(url)

  return {
    route,
    routerProps: {
      location,
      match: matchRoute(location.pathname, route)
    }
  }
}
