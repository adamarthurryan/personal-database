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
import Main from '../common/components/Main'
import createServerStore from './createServerStore'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

var SocketIo = require('socket.io')



var databaseFolder = 'static/other-images'
var databasePath = path.resolve(__dirname, '..', '..', databaseFolder);
var assetsPath = path.resolve(__dirname, '..', '..', 'dist')
console.log('assets path: ',assetsPath)
console.log('database path: ',databasePath)

//the main server
var app = express();
var server = Server(app)
server.listen(8080)
var io = SocketIo(server)


const socketEventMiddleware = store => next => action => {
  io.emit('databaseAction', action)

  return next(action)
}

//express-thumbnail allows serving on-demand thumbnails 
var expressThumbnail = require('express-thumbnail');
app.use('/static', expressThumbnail.register(databasePath));

//serve the static files and the json index
//app.use('/static', express.static(databasePath));
app.use( '/static', serveIndex(databasePath, {'jsonStats':true}));


app.use( express.static(assetsPath))



//dispatch logging middleware for redux store
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

var store=createServerStore(databasePath, /*logger,*/ socketEventMiddleware);
app.use(handleRender)


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




function handleRender(req, res) {

  // Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      <Main />
    </Provider>
  )

  // Grab the initial state from our Redux store
  const initialState = store.getState()

  // Send the rendered page back to the client
  res.send(renderFullPage(html, initialState))
}

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <!-- <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script> -->
        <script type="text/javascript" src="assets/app.js"></script>
      </body>
    </html>
    `
}
