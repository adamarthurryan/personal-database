var path = require('path');
var srcClientPath = path.join(__dirname, '/../client');
var srcCommonPath = path.join(__dirname, '/../common');
var srcTestPath = path.join(__dirname, '/../test');


// Add needed plugins here
var BowerWebpackPlugin = require('bower-webpack-plugin');


var babelQuery =  {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: true,
    presets: ['es2015', 'react', 'stage-2']
}

module.exports = {
  devtool: 'eval-source-map',
  module: {
    loaders: [
      {
        test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel'+"?"+JSON.stringify(babelQuery),
        include: [
          srcClientPath,
          srcCommonPath,
          srcTestPath
        ]
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel'+"?"+JSON.stringify(babelQuery),
        include: [
          srcClientPath,
          srcCommonPath
        ],
        loader: 'isparta'
      }
    ]
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    alias: {
      actions: path.join(srcCommonPath, 'actions/'),
      helpers: path.join(__dirname, '/../test/helpers'),
      components: path.join(srcCommonPath, 'components/'),
      sources: path.join(srcCommonPath, 'sources/'),
      stores: path.join(srcCommonPath, 'stores/'),
      styles: path.join(srcClientPath, 'styles/'),
      config: path.join(srcClientPath, 'config', process.env.REACT_WEBPACK_ENV)
    }
  },
  plugins: [
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ]
};
