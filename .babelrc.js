const presets = [
  '@babel/preset-env',
  '@babel/preset-react'
]

const plugins = [
  'react-hot-loader/babel',
  [
    '@babel/plugin-proposal-class-properties',
    {
      'loose': true
    }
  ],
  ['@babel/plugin-transform-runtime', {
    'corejs': 2
  }],
  'astroturf/plugin',
  'macros'
]

if (process.env.SERVER) {
  plugins.push('babel-plugin-dynamic-import-node')
}

module.exports = { presets, plugins }
