/*eslint no-console:0 */
"use strict";

import webpack from 'webpack'
import config from '../../webpack.config'
import open  from 'open'
import express from 'express'
import serveIndex from 'serve-index'
import path from 'path'
import {Server} from 'http'

import FileWatcher from './io/FileWatcher'
import startDatabaseWatcher from './startDatabaseWatcher'
import Renderer from './Renderer'
import DatabaseCache from './io/DatabaseCache'

import View from '../common/view/View'

import { createStore, combineReducers, applyMiddleware } from 'redux'



import reducer from '../common/redux/reducer'

var SocketIo = require('socket.io')



var databaseFolder = 'static'
var databasePath = path.resolve(__dirname, '..', '..', databaseFolder);
var assetsPath = path.resolve(__dirname, '..', '..', 'dist')
var cacheFilePath = path.resolve(__dirname, '..', '..', 'cache', 'db.json')
console.log('assets path: ',assetsPath)
console.log('database path: ',databasePath)

//the main server
var app = express();
var server = Server(app)
server.listen(8080)
var io = SocketIo(server)



//express-thumbnail allows serving on-demand thumbnails
//how do we handle errors here, so the thumbnail requests don't just get passed on? 
var expressThumbnail = require('express-thumbnail');
app.use('/static', expressThumbnail.register(databasePath));

//serve the static files
app.use('/static', express.static(databasePath));
//serve the static files and the json index
//app.use( '/static', serveIndex(databasePath, {'jsonStats':true}));

app.use(express.static(assetsPath))


//create database cache
let databaseCache = new DatabaseCache(cacheFilePath)


//this middleware emits a socket event if the action results in a change to the database
//otherwise, no event is emittted
const socketEventMiddleware = store => next => action => {
  let initialState = store.getState()
  let result = next(action)

  if (! store.getState().database.equals(initialState.database)) {
    io.emit('databaseAction', action)
  }

  return result
}

const notifyCacheMiddleware = store => next => action => { 
  let result = next(action)

  databaseCache.notifyUpdate(store.getState().database)

  return result
}

//dispatch logging middleware for redux store
const loggerMiddleware = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}


var store=createServerStore(databasePath, reducer, socketEventMiddleware, notifyCacheMiddleware 
  /*loggerMiddleware*/ 
  );


function createServerStore(databasePath, reducer, ...middlewares) {
  // applyMiddleware takes createStore() and returns
  // a function with a compatible API 
  let createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)

  //load the cached database from the cache
  let cachedDb = databaseCache.readCache()  

  let state = {database:cachedDb, view:new View()}
  let store = createStoreWithMiddleware(reducer, state)



  startDatabaseWatcher(store, databasePath)
  return store
}


let renderer = new Renderer(store)
app.use(renderer.handleRender.bind(renderer))

//this middleware doesn't seem to work:
//var webpackDevMiddleware = require("webpack-dev-middleware");
//app.use(webpackDevMiddleware(webpack(config), config.devMiddleware));

/*
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



//here is the webpackServer
var webpackDevServer = require('webpack-dev-server');
console.log("config.webtool: ",config.devtool);

new webpackDevServer(webpack(config), config.devServer)
 .listen(config.port);

*/

//app.listen(8080);


var compiler = webpack(config)
compiler.watch({
  aggregateTimeout: 300,
  //poll: true
}, (err, stats) => {
  if (err)
    console.log("webpack.watch error:", err)

  //if (stats)
  //  console.log("webpack.watch stats:", stats)
})


io.on('connection', function (socket) {
  socket.emit('status', {message: 'Connected'})
})


