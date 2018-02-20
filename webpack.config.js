const webpack = require('webpack')
const path = require('path')
const config = require('./src/config')
const _ = require('lodash')

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const StringReplacePlugin = require('string-replace-webpack-plugin')

const __DEV__ = process.env.NODE_ENV === 'development'
const __PROD__ = process.env.NODE_ENV === 'production'

const paths = {
  source: path.resolve(__dirname, './src'),
  dist: path.resolve(__dirname, './dist'),
  assets: path.resolve(__dirname, './assets'),
  app: path.resolve(__dirname, './src/app/pictogram.js'),
}

const appName = 'pictogrify'
const currentColors = loadReplaceColors().join('|')

function loadPlugins () {
  const base = [
    new webpack.DefinePlugin({
      __DEV__,
      __PROD__
    }),

    new SpriteLoaderPlugin({
      plainSprite: true,
      spriteAttrs: {
        id: ''
      }
    }),

    new StringReplacePlugin(),
  ]

  const prod = [
    new CleanWebpackPlugin([paths.dist]),
    new webpack.optimize.UglifyJsPlugin()
  ]

  if (__PROD__) {
    return [ ...base, ...prod ]
  } else {
    return base
  }
}

function loadReplaceColors () {
  const colors = _(config.themes).flatMap((theme) => _.map(theme.shapes, (shape) => shape.currentColor)).compact().value()
  return colors
}

const build = {
  target: 'web',

  entry: path.join(paths.app),

  output: {
    path: paths.dist,
    filename: `${appName}.js`,
    library: 'Pictogrify',
    libraryTarget: 'umd',
  },

  devServer: {
    open: true,
  },

  resolve: {
    extensions: ['.js']
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'sprite.svg'
            }
          },
          {
            loader: StringReplacePlugin.replace({
              replacements: [
                {
                  pattern: new RegExp(`(fill)="(${currentColors})"`, 'g'),
                  replacement: function (match, p1, p2, string) {
                    // return `${p1}=param(${p1}) ${p2}`
                    return p1 + '="param(' + p1 + ') ' + p2 + '"'
                  }
                }
              ]
            }),
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { inlineStyles: { onlyMatchedOnce: false } },
                { removeAttrs: { attrs: ['data.*', 'viewBox', 'serif.*'] } },
                { mergePaths: true },
                { removeXMLNS: true },
                { cleanupIDs: true },
                { removeUnknownsAndDefaults: true },
                { collapseGroups: true },
              ]
            }
          },
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', `imports-loader?sprite=>{url: "${__PROD__ ? '/' + appName : ''}/dist/sprite.svg"}`]
      }
    ]
  },

  plugins: loadPlugins()
}

module.exports = build
