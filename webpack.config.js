const currentTask = process.env.npm_lifecycle_event
const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const fse = require("fs-extra")
const Dotenv = require("dotenv-webpack")
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin")

const postCSSPlugins = [require("autoprefixer")]

/* For Build only: Copy Images to distribution folder */
class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", function () {
      fse.copySync("./app/assets", "./dist/assets")
    })
  }
}

let cssConfig = {
  test: /\.(css|s[ac]ss)$/i,
  use: ["css-loader?url=false", { loader: "postcss-loader", options: { plugins: postCSSPlugins } }, "sass-loader"]
}

/* deal with multiple html files to be compiled */
let pages = fse
  .readdirSync("./app")
  .filter(function (file) {
    return file.endsWith(".html")
  })
  .map(function (page) {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./app/${page}`
    })
  })
pages.unshift(new Dotenv())
pages.push(new HtmlWebpackHarddiskPlugin())
let config = {
  entry: "./app/assets/scripts/App.js",
  plugins: pages,
  module: {
    rules: [
      cssConfig,
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]]
          }
        }
      } // end of babel rule
    ]
  }
}

if (currentTask == "dev" || currentTask == "webpackDev") {
  cssConfig.use.unshift("style-loader")
  config.output = {
    publicPath: "/",
    filename: "bundled.js",
    path: path.resolve(__dirname, "app")
  } //need to specify public path so that /post/:id can find bundled.js
  config.devServer = {
    before: function (app, server) {
      server._watch("./app/**/*.html")
    },
    contentBase: path.join(__dirname, "app"),
    hot: true,
    port: 3000,
    host: "0.0.0.0",
    historyApiFallback: { index: "index.html" },
    historyApiFallback: true
  }
  config.mode = "development"
}
if (currentTask == "build" || currentTask == "webpackBuild") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader)
  postCSSPlugins.push(require("cssnano"))
  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist")
  }
  config.mode = "production"
  config.optimization = {
    splitChunks: { chunks: "all" }
  }
  config.plugins.push(new CleanWebpackPlugin(), new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }), new RunAfterCompile())
}

module.exports = config
