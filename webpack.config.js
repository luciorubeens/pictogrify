const webpack = require('webpack')
const path = require('path')
const config = require('./src/config')
const _ = require('lodash')

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const StringReplacePlugin = require('string-replace-webpack-plugin')
const { replaceInModuleSource, getAllModules } = require('svg-sprite-loader/lib/utils')

const __DEV__ = process.env.NODE_ENV === 'development'
const __PROD__ = process.env.NODE_ENV === 'production'

const paths = {
  source: path.resolve(__dirname, './src'),
  dist: path.resolve(__dirname, './dist'),
  assets: path.resolve(__dirname, './assets'),
  app: path.resolve(__dirname, './src/app/pictogram.js'),
  spritePrefix: 'sprite-'
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

    {
      apply (compiler) {
        compiler.plugin('compilation', (compilation) => {
          compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
            const { assets } = compilation
            const spriteAssets = _.pickBy(assets, (value, key) => key.startsWith('sprite-'))
            if (_.isEmpty(spriteAssets) || _.isNil(spriteAssets)) throw new Error('Sprites are not compiled!')

            const spriteSources = _.transform(spriteAssets, (result, value, key) => result[key.replace(/(sprite-|.svg)/g, '')] = value.source())

            getAllModules(compilation).forEach((module) => {
              replaceInModuleSource(module, {
                __SPRITE_SOURCES__: JSON.stringify(spriteSources)
              })
            })

            callback()
          })
        })
      }
    }
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
  const colors = _(config.themes).flatMap((theme) => _.map(theme.shapes, (shape) => shape.currentColor)).compact().uniq().value()
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
              spriteFilename: svgPath => {
                const tree = path.dirname(svgPath).split(path.sep)
                const theme = tree[_.indexOf(tree, 'themes') + 1]
                return `${paths.spritePrefix}${theme}.svg`
              }
            }
          },
          {
            loader: StringReplacePlugin.replace({
              replacements: [
                {
                  pattern: new RegExp(`(fill)="(${currentColors})"`, 'g'),
                  replacement: function (match, p1, p2) {
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
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          `imports-loader?__SPRITE_DIST__=>{url: "${__PROD__ ? '/' + appName : ''}/dist/${paths.spritePrefix}"}`,
        ]
      }
    ]
  },

  plugins: loadPlugins()
}

module.exports = build
