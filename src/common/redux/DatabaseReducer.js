
import Database from '../../common/database/Database'
import * as Actions from './DatabaseActions'

export default function databaseReducer(db = new Database(), action = {type:"NONE"}) {
  switch (action.type) {
    case Actions.ADD_ENTRY:
      return db.addEntry(action.id)

    case Actions.REMOVE_ENTRY:
      return db.removeEntry(action.id)
      
    case Actions.ADD_RESOURCE:
      return db.addResource(action.entryId, action.resourcePath)

    case Actions.REMOVE_RESOURCE:
      return db.removeResource(action.entryId, action.resourcePath)

    case Actions.UPDATE_TITLE:
      return db.setTitle(action.entryId, action.title)

    case Actions.UPDATE_BODY:
      return db.setBody(action.entryId, action.body)

    case Actions.UPDATE_ATTRIBUTE:
      return db.setAttribute(action.entryId, action.key, action.values)

    case Actions.UPDATE_ATTRIBUTES:
      return db.setAttributes(action.entryId, action.attributes)

    case Actions.WIPE_INDEX:
      return db.wipeIndex(action.entryId);
    
    default:
      return db
  }
}