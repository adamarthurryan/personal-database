// action types

export const UPDATE_DISPLAY = 'UPDATE_DISPLAY'
export const UPDATE_ATTRIBUTE = 'UPDATE_ATTRIBUTE'
export const UPDATE_ATTRIBUTES = 'UPDATE_ATTRIBUTES'

// action creators

export function updateDisplay(entryId, display) {
 return { type: UPDATE_DISPLAY, entryId, display }
}
export function updateAttribute(entryId, key, values) {
 return { type: UPDATE_ATTRIBUTE, entryId, key, values }
}
export function updateAttributes(entryId, attributes) {
  return { type: UPDATE_ATTRIBUTES, entryId, attributes }
}
