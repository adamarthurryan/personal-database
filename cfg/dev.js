var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');

var baseConfig = require('./base');

// Add needed plugins here
var BowerWebpackPlugin = require('bower-webpack-plugin');

var config = _.merge({
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:8000',
    'webpack/hot/only-dev-server',
    './client/client.js'
  ],
  cache: true,
  //devtool: 'cheap-module-inline-source-map, cheap-eval-source-map, #@source-map',
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ]
}, baseConfig);


var srcClientPath = path.join(__dirname, '/../client');
var srcCommonPath = path.join(__dirname, '/../common');

var babelQuery =  {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: true,
    presets: ['es2015', 'react', 'stage-2']
}

// Add needed loaders
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'react-hot!babel'+"?"+JSON.stringify(babelQuery),

  include: [srcClientPath, srcCommonPath]
});


module.exports = config;
