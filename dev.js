// SEE: https://github.com/parcel-bundler/parcel/issues/1131

import Bundler from 'parcel-bundler'
import 'loud-rejection/register'

import _ from 'lodash'
import { promisify } from 'bluebird'
import exitHook from 'async-exit-hook'
import kill from 'tree-kill'
import consola from 'consola'
import sane from 'sane'
import touch from 'touch'
import path from 'path'

import fork from './src/server/utils/fork'
import generateRoutesJson from './src/server/utils/generateRoutesJson'

import {
  ROUTES_DIR
} from './src/server/config'

const aKill = promisify(kill)

// SEE: https://parceljs.org/api.html
// Bundler options
const options = {
  outDir: './dist', // The out directory to put the build files in, defaults to dist
  // outFile: 'index.html', // The name of the outputFile
  publicUrl: '/', // The url to serve on, defaults to '/'
  watch: true, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: true, // Enabled or disables caching, defaults to true
  cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
  contentHash: false, // Disable content hash from being included on the filename
  global: 'moduleName', // Expose modules as UMD under this name, disabled by default
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: 'browser', // Browser/node/electron, defaults to browser
  bundleNodeModules: false, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
  // https: { // Define a custom {key, cert} pair, use true to generate one or false to use http
  //   cert: './ssl/c.crt', // Path to custom certificate
  //   key: './ssl/k.key' // Path to custom key
  // },
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors
  hmr: true, // Enable or disable HMR while watching
  hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  hmrHostname: '', // A hostname for hot module reload, default to ''
  detailedReport: false, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  ignored: [
    /json/
  ]
}

let server = null

const DEBOUNCE_DELAY = 200

// Generate routes.json for /routes rendering.
generateRoutesJson()

// Restart bundled server process.
const restartServer = _.debounce(async (e) => {
  // Kill old process.
  if (server) {
    await aKill(server.pid)
  }

  // Fork new server.
  server = fork(require.resolve('./dist/server/server.js'))

  consola.info('Restarted server.')
}, DEBOUNCE_DELAY)

const main = async () => {
  const bundler = new Bundler([
    'src/server.js'
  ], {
    ...options,
    outDir: 'dist/server',
    target: 'node'
  })

  bundler.on('buildEnd', restartServer)

  consola.debug(`Start watching changes for routes.`)

  // Watch for /routes changes.
  const watcher = sane(ROUTES_DIR)

  const onChange = _.debounce(() => {
    // Touch route entryPoint for trigger re-bundle.
    touch.sync(path.resolve(ROUTES_DIR, './_routes.js'))
  }, DEBOUNCE_DELAY)

  watcher.on('ready', () => {
    watcher.on('add', onChange)
    watcher.on('delete', onChange)
  })

  await bundler.bundle()
}

const pid = process.pid

exitHook(async (cb) => {
  console.debug('\r\nTry to exit with all child process.')

  await aKill(pid).catch((err) => {
    console.error(err)
    return process.exit(1)
  })

  console.info('Goodbye.\r\n')
  cb()
  process.exit(0)
})

main()
