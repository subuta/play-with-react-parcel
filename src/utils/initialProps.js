import _ from 'lodash'

const isBrowser = typeof window !== 'undefined'
const KEY = '__INITIAL_PROPS__'

export const setInitialProps = (ctx, initialProps) => {
  _.set(ctx, ['state', KEY], initialProps)
}

// Get initialProps from ctx.
export const getInitialProps = (ctx) => {
  // Get initialProps from window if browser
  if (isBrowser) return _.get(window, KEY, {})
  // Get initialProps from ctx otherwise.
  return _.get(ctx, ['state', KEY], {})
}

export const getScriptTag = (ctx) => {
  return `<script>${`window.${KEY} = ${JSON.stringify(getInitialProps(ctx))};`}</script>`
}
