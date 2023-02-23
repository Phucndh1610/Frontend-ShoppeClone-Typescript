/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin').TsconfigPathsPlugin
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  // file đầu vào cho webpack, file này import bao gồm các file khác
  entry: path.resolve(__dirname, '../src', 'index.tsx'),
  optimization: {
    minimize: false
  },
  // Quy định cách webpack giải quyết các file
  resolve: {
    // các file cùng một tên nhưng các đuôi mở rộng
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    // Thêm mã hash tên file dựa vào content để tránh bị cache bởi CDN hay browser.
    filename: 'static/js/main.[contenthash:6].js',
    // Build ra thư mục build
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        // duyệt các file .ts || .tsx
        test: /\.tsx?$/,
        // Giúp dịch code TS, React sang JS,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true
        }
      },
      {
        // duyệt các file sass || scss || css
        test: /\.(s[ac]ss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            // dùng import 'filename.css' trong file tsx, ts
            loader: 'css-loader'
          },
          {
            // biên dịch sass sang css
            loader: 'sass-loader'
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        // Dùng để import file ảnh, nếu có video/ảnh định dạng khác thì thêm vào đây
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      {
        // Dùng để import font
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    // Đưa css ra thành một file .css riêng biệt thay vì bỏ vào file .js
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),
    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          filter: (name) => {
            return !name.endsWith('index.html')
          }
        }
      ]
    }),
    // plugin support add style and script to index.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public', 'index.html'),
      filename: 'index.html'
    }),
    // Thêm eslint cho webpack
    new ESLintPlugin({
      extensions: ['.tsx', '.ts', '.js', '.jsx']
    })
  ]
}
