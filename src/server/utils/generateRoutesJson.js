const _ = require('lodash')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

const { ROUTES_DIR } = require('../config')

module.exports = () => {
  // Find files from `/routes`
  let files = _.map(glob.sync('**/*.js', {
    cwd: ROUTES_DIR,
    ignore: ['**/_*.js']
  }), (file) => {
    let pathname = path.basename(file, '.js')
    if (path.dirname(file) !== '.') {
      // Omit trailing index for `dir/index.js`
      if (pathname === 'index') return path.dirname(file)
      pathname = `${path.dirname(file)}/${pathname}`
    }
    return pathname
  })

  // Concat and normalize as path name. (eg: `foo`)
  return _.uniq(_.map(files, (route) => _.toLower(route)))
}
