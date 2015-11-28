var path = require('path');
var srcPath = path.join(__dirname, '/..');


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
          path.join(srcPath,'client'), path.join(srcPath,'common'), path.join(srcPath,'test'), path.join(srcPath,'cfg')
        ]
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel'+"?"+JSON.stringify(babelQuery),
        include: [
          path.join(srcPath,'client'), path.join(srcPath,'common'), path.join(srcPath,'test'), path.join(srcPath,'cfg')
        ],
        loader: 'isparta'
      }
    ]
  },
  
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      cfg: path.join(srcPath,'cfg'),
      client: path.join(srcPath,'client'),
      common: path.join(srcPath,'common'),
      server: path.join(srcPath,'server'),
      test: path.join(srcPath,'test'),
      //'client\config': path.join(srcPath,'config', process.env.REACT_WEBPACK_ENV)
    }
  },  
  plugins: [
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ]
};
