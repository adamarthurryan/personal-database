var path = require('path');

var port = 8000;
var srcClientPath = path.join(__dirname, '/../client');
var srcCommonPath = path.join(__dirname, '/../common');
var publicPath = '/assets/';

module.exports = {
  port: port,
  debug: true,
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    publicPath: publicPath
  },
  devServer: {
    contentBase: './client/',
    historyApiFallback: true,
    hot: true,
    port: port,
    publicPath: publicPath,
    noInfo: false
  }, 
  //because webpack-dev-middleware doesn't have a contentBase parameter
  //we'll have to arrange for static assets to be served separately
  devMiddleware: {   
    noInfo: false,
    quiet: false,
    publicPath: publicPath,
    stats: {
        color: true
    }
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      actions: srcCommonPath + '/actions/',
      components: srcCommonPath + '/components/',
      sources: srcCommonPath + '/sources/',
      stores: srcCommonPath + '/stores/',
      styles: srcClientPath + '/styles/',
      config: srcClientPath + '/config/' + process.env.REACT_WEBPACK_ENV
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        include: srcClientPath,
        loader: 'eslint-loader'
      },
      {
        test: /\.(js|jsx)$/,
        include: srcCommonPath,
        loader: 'eslint-loader'
      }

    ],
    loaders: [
      {
        test: /\.json/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&indentedSyntax'
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
      },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  }
};
