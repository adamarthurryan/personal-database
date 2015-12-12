
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Main from 'common/components/Main'
import Database from 'common/database/Database'
import View from 'common/view/View'
import reducer from 'common/redux/Reducer'

import SocketIo from 'socket.io-client'

import { Router } from 'react-router'
import  createBrowserHistory  from 'history/lib/createBrowserHistory'
import routes from 'common/routes'

// Grab the state from a global injected into server-generated HTML
const initialDb = Database.fromJS(window.__INITIAL_STATE__.database)
const initialView = View.fromJS(window.__INITIAL_STATE__.view)
const initialState = {database:initialDb, view:initialView}

// Create Redux store with initial state
const store = createStore(reducer, initialState)

//whenever a database action is received through the socket, dispatch it
let socket = SocketIo.connect('localhost:8080') 

socket.on('status', data => console.log('Socket Status: ', data))
socket.on('databaseAction', action => {
  store.dispatch(action)
})


ReactDOM.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app')
)

//store.dispatch(Actions.addEntry('client-side code is working'))
