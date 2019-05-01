const tailwindConfig = require('./tailwind')

module.exports = {
  modules: true,
  plugins: {
    'postcss-modules': {
      globalModulePaths: [
        'index.css'
      ]
    },
    'postcss-import': true,
    'autoprefixer': true,
    'precss': true,
    'tailwindcss': tailwindConfig
  }
}
