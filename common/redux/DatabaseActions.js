// action types

export const ADD_ENTRY = 'ADD_ENTRY'
export const REMOVE_ENTRY = 'REMOVE_ENTRY'
export const ADD_RESOURCE = 'ADD_RESOURCE'
export const REMOVE_RESOURCE = 'REMOVE_RESOURCE'
export const UPDATE_INDEX = 'UPDATE_INDEX'
export const REMOVE_INDEX = 'REMOVE_INDEX'


// action creators

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
export function REMOVE_INDEX(entryId) {
 return { type: REMOVE_INDEX, indexPath }
}

