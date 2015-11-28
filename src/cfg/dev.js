var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');

var baseConfig = require('./base');

// Add needed plugins here
var BowerWebpackPlugin = require('bower-webpack-plugin');

var srcPath = path.join(__dirname, '..');

var config = _.merge({
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:8000',
    'webpack/hot/only-dev-server',
    path.join(srcPath, 'client/client.js'),

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


var babelQuery =  {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: true,
    presets: ['es2015', 'react', 'stage-2']
}

// Add needed loaders
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'react-hot!babel'+"?"+JSON.stringify(babelQuery),

  include: [
    path.join(srcPath,'client'), path.join(srcPath,'common'), path.join(srcPath,'cfg')
  ]
});


module.exports = config;
