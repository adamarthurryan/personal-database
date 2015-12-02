import { createStore, combineReducers, applyMiddleware } from 'redux'

import * as Actions from '../common/redux/DatabaseActions'
import reducer from '../common/redux/databaseReducer'
import IndexLoader from './io/IndexLoader'
import FileWatcher from './io/FileWatcher'


function startDatabase(store, databasePath) {
  var indexLoader = new IndexLoader(databasePath);
  var watcher = new FileWatcher(databasePath);

  watcher.on('addEntry', id => store.dispatch(Actions.addEntry(id)))
  watcher.on('removeEntry', id => store.dispatch(Actions.removeEntry(id)))
  watcher.on('addResource', (entryId, resourcePath) => store.dispatch(Actions.addResource(entryId, resourcePath)))
  watcher.on('removeResource', (entryId, resourcePath) => store.dispatch(Actions.removeResource(entryId, resourcePath)))
  watcher.on('removeIndex', entryId => store.dispatch(Actions.wipeIndex(entryId)))

  watcher.on('updateIndex', (entryId, indexPath) => indexLoader.loadIndex(entryId, indexPath)) 

  watcher.on('error', (error) => console.log("Error watching database: ", error))

  indexLoader.on('loaded', (entryId, index) => {
    store.dispatch(Actions.updateTitle(entryId, index.title))
    store.dispatch(Actions.updateBody(entryId, index.body))
    store.dispatch(Actions.updateAttributes(entryId, index.attributes))
  })
  indexLoader.on('error', (entryId, indexPath, message) => 
    console.log ("Error loading index for ", entryId, " from ", indexPath, ": ", message))
}





export default function createServerStore(databasePath, ...middlewares) {
  // applyMiddleware takes createStore() and returns
  // a function with a compatible API.
  let createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)

  // Use it like you would use createStore()
  let store = createStoreWithMiddleware(reducer)
  startDatabase(store, databasePath)

  return store
}
