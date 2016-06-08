"use strict";

const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const isEnabled = require("./public/js/configs/feature").isEnabled;

let config = {
  entry: "./public/js/main.js",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "public/build"),
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      "devtools": "/Users/james/projects/mozilla/debugger.html/public/js/lib/devtools",
      "ff-devtools-libs": "/Users/james/projects/mozilla/debugger.html/public/js/lib/devtools-sham",
      "sdk": "/Users/james/projects/mozilla/debugger.html/public/js/lib/devtools-sham/sdk"
    }
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json"
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css")
  ]
};

// NOTE: This is only needed to fix a bug with chrome devtools' debugger and
// destructuring params https://github.com/jlongster/debugger.html/issues/67
if (isEnabled("transformParameters")) {
  config.module.loaders.push({
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: "babel",
    query: {
      plugins: ["transform-es2015-parameters"]
    }
  });
}

module.exports = config;
