var path = require('path');

var port = 8000;
var srcPath = path.join(__dirname, '..');
var publicPath = '/assets/';

module.exports = {
  port: port,
  debug: true,
  output: {
    path: path.join(__dirname, '/../../dist/assets'),
    filename: 'app.js',
    publicPath: publicPath
  },
  devServer: {
    contentBase: '../../assets/',
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
      cfg: path.join(srcPath,'cfg'),
      client: path.join(srcPath,'client'),
      common: path.join(srcPath,'common'),
      server: path.join(srcPath,'server'),
      test: path.join(srcPath,'test'),
      //'client/config': path.join(srcPath,'config', process.env.REACT_WEBPACK_ENV)
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.join(srcPath,'client'), path.join(srcPath,'common'), path.join(srcPath,'test'), path.join(srcPath,'cfg')
        ],
        loader: 'eslint-loader'
      },

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
