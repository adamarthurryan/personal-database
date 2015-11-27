
import * as Actions from './DatabaseActions'

export function ADD_ENTRY(id) {
 return { type: ADD_ENTRY, id }
}
export function REMOVE_ENTRY(id) {
 return { type: REMOVE_ENTRY, id }
}
export function ADD_RESOURCE(entryId, resourcePath) {
 return { type: ADD_RESOURCE, entryId, resourcePath }
}
export function REMOVE_RESOURCE(entryId, resourcePath) {
 return { type: REMOVE_RESOURCE, entryId, resourcePath }
}
export function UPDATE_INDEX(entryId, indexPath) {
 return { type: UPDATE_INDEX, indexPath }
}
export function REMOVE_INDEX(entryId, indexPath) {
 return { type: REMOVE_INDEX, indexPath }
}


export default function reducer(db = new Database(), action) {
  switch (action.type) {}
    case ADD_ENTRY:
      db.addEntry(action.id)

    case REMOVE_ENTRY:
      db.removeEntry(action.id)
      
    case ADD_RESOURCE:
      db.addResource(action.id, action.resourcePath)

    case REMOVE_RESOURCE:
      db.removeResource(action.id, action.resourcePath)

    case UPDATE_INDEX:
    case REMOVE_INDEX:
    
    default:
      return state
  }
}