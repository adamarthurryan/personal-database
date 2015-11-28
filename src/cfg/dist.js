var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');

var baseConfig = require('./base');

// Add needed plugins here
var BowerWebpackPlugin = require('bower-webpack-plugin');

var srcPath = path.join(__dirname, '..');

var config = _.merge({
  entry: path.join(srcPath, 'client/client.js'),
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin()
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
  loader: 'babel'+"?"+JSON.stringify(babelQuery),
  include: [
    path.join(srcPath,'client'), path.join(srcPath,'common'), path.join(srcPath,'cfg')
  ]
});

module.exports = config;
