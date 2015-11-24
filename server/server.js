"use strict";
/*eslint no-console:0 */

var webpack = require('webpack');
var config = require('./webpack.config');
var open = require('open');
var express = require('express');
var serveIndex = require('serve-index');
var path = require('path');

var API = require('./src/api');

//allows recursive watching of a folder
//var watch = require('node-watch');

/*
var WebpackDevServer = require('webpack-dev-server');
new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, 'localhost', function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
  console.log('Opening your system browser...');
  open('http://localhost:' + config.port + '/webpack-dev-server/');
});
*/



var databasePath = './static'

var app = express();

//express-thumbnail allows serving on-demand thumbnails 
var expressThumbnail = require('express-thumbnail');
console.log(__dirname);
app.use('/static', expressThumbnail.register(__dirname +path.sep+ databasePath));

//serve the static files and the json index
//app.use('/static', express.static(databasePath));
app.use( '/static', serveIndex(databasePath, {'jsonStats':true}));


var database = new API.Database(__dirname +path.sep+ databasePath);

app.use( '/api', API.serve(database));

//this middleware doesn't seem to work:
//var webpackDevMiddleware = require("webpack-dev-middleware");
//app.use(webpackDevMiddleware(webpack(config), config.devMiddleware));

//so we make a separate server for webpackDevServer and proxy to it
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
app.all('/*', function (req, res) {
  proxy.web(req, res, {
      target: 'http://localhost:'+config.port
  });
});

//we have handle proxy errors so when webpack is rebundling it doesn't bring down the server
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

//the main server
app.listen(8080);

//here is the webpackServer
var webpackDevServer = require('webpack-dev-server');
console.log("config.webtool: ",config.devtool);

new webpackDevServer(webpack(config), config.devServer)
 .listen(config.port);