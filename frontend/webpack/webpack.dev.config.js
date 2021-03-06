const webpack = require('webpack');
const path = require('path');
require('babel-polyfill');
const parentDir = path.join(__dirname, '../');

module.exports = {
  mode: 'development',
  entry: {
    app: ['./index.js', 'babel-polyfill']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [

      {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
      },
      {
      test: /\.js$/, // include .js files
      exclude:  /node_modules/,
      enforce: "pre", // preload the jshint loader
      use: [{
        loader: 'babel-loader',
        options: {}
      }]
    }, {
        test: /\.(gif|svg|jpg|png)$/,
        use:[{
            loader: "file-loader",
            options:{}
        }]
    }]
  },
};
