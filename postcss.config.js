const tailwindConfig = require('./tailwind')

module.exports = {
  modules: true,
  plugins: {
    'postcss-import': true,
    'autoprefixer': true,
    'precss': true,
    'tailwindcss': tailwindConfig
  }
}
