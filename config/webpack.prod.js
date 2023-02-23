/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const mergeP = require('webpack-merge').merge
const commonP = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { gzip } = require('@gfx/zopfli')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = mergeP(commonP, {
  mode: 'production',
  devtool: false,
  output: {
    // Thêm mã hash tên file dựa vào content để tránh bị cache bởi CDN hay browser.
    filename: 'static/js/main.[contenthash:6].js',
    // Build ra thư mục build
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
    clean: true
  },
  plugins: [
    // show % in build
    new webpack.ProgressPlugin(),
    // Extracts CSS into separate files
    // Note: style-loader is for development, MiniCssExtractPlugin is for production
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: '[id].css'
    }),
    new CompressionPlugin({
      test: /\.(css|js)$/,
      compressionOptions: {
        verbose: false,
        verbose_more: false,
        numiterations: 15,
        blocksplitting: true,
        blocksplittingmax: 15
      },
      minRatio: 0.8,
      algorithm(input, compressionOptions, callback) {
        return gzip(input, compressionOptions, callback)
      }
    }),

    new CleanWebpackPlugin()

    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/'
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        extractComments: false,
        terserOptions: {
          format: {
            comments: false
          },
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
})
