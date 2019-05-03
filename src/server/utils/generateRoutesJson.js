import _ from 'lodash'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

import {
  ROUTES_DIR,
  ROUTES_JSON_PATH
} from 'server/config'

const generateRoutesJson = () => {
  // Find directories from `/routes`
  const directories = _.map(glob.sync('**/', { cwd: ROUTES_DIR }), (dir) => _.trimEnd(dir, '/'))

  // Find files from `/routes`
  let files = _.map(glob.sync('**/*.js', {
    cwd: ROUTES_DIR,
    ignore: ['**/_*.js', '**/index.js']
  }), (file) => path.basename(file, '.js'))

  // Check for index(/) route.
  if (fs.existsSync(path.resolve(ROUTES_DIR, './index.js'))) {
    files.unshift('index')
  }

  // Concat and normalize as path name. (eg: `foo`)
  const routes = _.uniq(_.map([...directories, ...files], (route) => _.toLower(route)))

  // Write routes as json.
  fs.writeFileSync(ROUTES_JSON_PATH, JSON.stringify(routes), { encoding: 'utf8' })
}

// Run generateRoutesJson only if called from cli.
if (!module.parent) {
  generateRoutesJson()
}

export default generateRoutesJson
