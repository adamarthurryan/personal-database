/*eslint no-console:0 */
"use strict";

import webpack from 'webpack';
import config from '../webpack.config';
import open  from 'open';
import express from 'express';
import serveIndex from 'serve-index';
import path from 'path';

import FileWatcher from './api/FileWatcher';

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



var databaseFolder = 'static/actual'
var databasePath = path.resolve(__dirname, '..', databaseFolder);


var app = express();

//express-thumbnail allows serving on-demand thumbnails 
var expressThumbnail = require('express-thumbnail');
console.log(__dirname);
app.use('/static', expressThumbnail.register(databasePath));

//serve the static files and the json index
//app.use('/static', express.static(databasePath));
app.use( '/static', serveIndex(databasePath, {'jsonStats':true}));


//var database = new API.Database(__dirname +path.sep+ databasePath);

//app.use( '/api', API.serve(database));


var watcher = new FileWatcher(databasePath);

//for any watcher events, we should 
  // 1) dispatch the appropriate actions
  // 2) dispatch an WebSockets event
watcher.on('addEntry', path=>
  console.log('addEntry:', path));
watcher.on('addResource', (path, resourceFile)=>
  console.log('addResource:', path, resourceFile));
watcher.on('removeEntry', path=>
  console.log('removeEntry:', path));
watcher.on('removeResource', (path, resourceFile)=>
  console.log('removeResource:', path, resourceFile));
watcher.on('updateIndex', (path, indexFile)=>
  console.log('updateIndex:', path, indexFile));
watcher.on('removeIndex', path=>
  console.log('removeIndex:', path));

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