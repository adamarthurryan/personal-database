// action types

export const ADD_ENTRY = 'ADD_ENTRY'
export const REMOVE_ENTRY = 'REMOVE_ENTRY'
export const ADD_RESOURCE = 'ADD_RESOURCE'
export const REMOVE_RESOURCE = 'REMOVE_RESOURCE'
export const UPDATE_TITLE = 'UPDATE_TITLE'
export const UPDATE_BODY = 'UPDATE_BODY'
export const UPDATE_ATTRIBUTE = 'UPDATE_ATTRIBUTE'
export const WIPE_INDEX = 'WIPE_INDEX'
export const UPDATE_ATTRIBUTES = 'UPDATE_ATTRIBUTES'


// action creators

export function addEntry(id) {
 return { type: ADD_ENTRY, id }
}
export function removeEntry(id) {
 return { type: REMOVE_ENTRY, id }
}
export function addResource(entryId, resourcePath) {
 return { type: ADD_RESOURCE, entryId, resourcePath }
}
export function removeResource(entryId, resourcePath) {
 return { type: REMOVE_RESOURCE, entryId, resourcePath }
}

export function updateTitle(entryId, title) {
 return { type: UPDATE_TITLE, entryId, title }
}
export function updateBody(entryId, body) {
 return { type: UPDATE_BODY, entryId, body }
}
export function updateAttribute(entryId, key, values) {
 return { type: UPDATE_ATTRIBUTE, entryId, key, values }
}
export function updateAttributes(entryId, attributes) {
  return { type: UPDATE_ATTRIBUTES, entryId, attributes }
}

export function wipeIndex(entryId) {
 return { type: WIPE_INDEX, entryId }
}

