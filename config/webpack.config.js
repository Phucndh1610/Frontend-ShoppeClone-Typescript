/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

// Cái dòng này giúp Editor gợi ý được các giá trị cho dòng code config ngay phía dưới nó
// (giống như đang dùng Typescript vậy đó 😉)
/** @type {(env: any, arg: {mode: string}) => import('webpack').Configuration} **/
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const isAnalyze = Boolean(env?.analyze)
  /** @type {import('webpack').Configuration} **/
  const config = {
    // Quy định cách webpack giải quyết các file
    resolve: {
      // Giải quyết các file theo thứ tự ưu tiên từ trái sang phải nếu import
      // các file cùng một tên nhưng các đuôi mở rộng
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@Components': path.resolve(__dirname, '../src/components'),
        '@Utils': path.resolve(__dirname, '../src/utils'),
        '@Pages': path.resolve(__dirname, '../src/pages'),
        '@Layouts': path.resolve(__dirname, '../src/layouts'),
        '@Assets': path.resolve(__dirname, '../src/assets'),
        '@Types': path.resolve(__dirname, '../src/types'),
        '@Apis': path.resolve(__dirname, '../src/apis')
      }
    },
    // File đầu vào cho webpack, file này thường là file import mọi file khác
    entry: ['./src/index.tsx'],
    // Khai báo các module dùng trong webpack
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
          include: path.resolve(__dirname, './src')
        },
        {
          // duyệt các file sass || scss || css
          test: /\.(s[ac]ss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              // dùng import 'filename.css' trong file tsx, ts
              loader: 'css-loader',
              // Hiển thị sourcemap ở môi trường dev cho dễ debug
              options: { sourceMap: !isProduction }
            },
            {
              // biên dịch sass sang css
              loader: 'sass-loader',
              options: { sourceMap: !isProduction }
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
                name: isProduction ? 'static/media/[name].[contenthash:6].[ext]' : '[path][name].[ext]'
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
                name: isProduction ? 'static/fonts/[name].[ext]' : '[path][name].[ext]'
              }
            }
          ]
        }
      ]
    },

    output: {
      // Thêm mã hash tên file dựa vào content để tránh bị cache bởi CDN hay browser.
      filename: 'static/js/main.[contenthash:6].js',
      // Build ra thư mục build
      path: path.resolve(__dirname, '../build'),
      publicPath: '/',
      clean: true
    },
    devServer: {
      // enable Hot Module Replacement, kiểu như reload nhanh
      hot: true,
      // Chạy port 3000 khi dev
      port: 3000,
      // Phải set true nếu không khi bạn dùng lazyload module React thì sẽ gặp lỗi không load được file.
      historyApiFallback: true,
      // Cấu hình phục vụ file html trong public
      static: {
        directory: path.resolve(__dirname, '../public', 'index.html'),
        serveIndex: true,
        // khi thay đổi content trong index.html thì cũng sẽ reload
        watch: true
      }
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      // Đưa css ra thành một file .css riêng biệt thay vì bỏ vào file .js
      new MiniCssExtractPlugin({
        filename: isProduction ? 'static/css/[name].[contenthash:6].css' : '[name].css'
      }),
      // Dùng biến môi trường env trong dự án
      new Dotenv({
        path: 'env.development'
      }),
      // Copy mọi files trong folder public trừ file index.html
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

      // Plugin hỗ trợ thêm thẻ style và script vào index.html
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

  //🚀 Nếu build thì sẽ thêm một số config
  if (isProduction) {
    config.plugins = [
      ...config.plugins,
      // Hiển thị % khi build
      new webpack.ProgressPlugin(),
      // Nén brotli css và js nhưng không hiểu sao chỉ có js được nén 🥲
      new CompressionPlugin({
        test: /\.(css|js)$/,
        algorithm: 'brotliCompress'
      }),
      // Dọn dẹp thư mục build trước đó để chuẩn bị cho bản build hiện tại
      new CleanWebpackPlugin()
    ]
    if (isAnalyze) {
      config.plugins = [...config.plugins, new BundleAnalyzerPlugin()]
    }
    config.optimization = {
      // minimizer: [
      //   `...`, // Cú pháp kế thừa bộ minimizers mặc định trong webpack 5 (i.e. `terser-webpack-plugin`)
      //   new CssMinimizerPlugin() // minify css
      // ]
      minimize: true,
      minimizer: [
        new TerserPlugin({
          // Sử dụng chạy song song nhiều quy trình để cải thiện tốc độ xây dựng
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
    }
    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  }
  return config
}
