import databaseReducer from './DatabaseReducer'
import viewReducer from './ViewReducer'

import { combineReducers } from 'redux'

const reducer = combineReducers({
  database: databaseReducer,
  view: viewReducer
})

export default reducer

 