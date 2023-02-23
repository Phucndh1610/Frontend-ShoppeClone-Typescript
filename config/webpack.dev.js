/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpackD = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  // Set the mode to development
  // Spin up a server for quick development
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../public', 'index.html'),
      serveIndex: false,
      // khi thay đổi content trong index.html thì cũng sẽ reload
      watch: true
    },
    hot: true,
    port: 3004,
    historyApiFallback: true
  },
  // Control how source maps are generated
  devtool: 'inline-source-map',
  plugins: [
    // Only update what has changed on hot reload
    new webpackD.HotModuleReplacementPlugin()
  ]
})
