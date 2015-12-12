import Immutable from 'immutable'

import ViewOptions from './ViewOptions'

import * as PathTools from '../../common/database/PathTools'

// Immutable objects are sometimes exposed out of the database
// !!! it should be possible to set attributes, etc with simple js objects


var View = Immutable.Record({
  options: Immutable.Map(), //of entry ids -> ViewOptions
});
export default View;


View.fromJS = function fromJS(object) {

  //!!! should actually do the thing
  return new View()
}


View.prototype.getDisplay = function getDisplay(entryId) {
  let view = this
  return _recursiveGetInOptionsEntry(view, entryId,  ['display'])
}

View.prototype.getAttribute = function getAttribute(entryId, key) {
  let view = this
  return _recursiveGetInOptionsEntry(view, entryId, ['attributes', key])
}

//set the diplay mode for the given entry
//children will inherit this display mode if they do not have their own display mode set
View.prototype.setDisplay = function setDisplay(entryId, display) {
  //!!! should verify that this is a valid display type
  let view = this
  view = _createViewOptions(view, entryId)
  view = view.setIn(['options', entryId, 'display'], display)
  return view
}

//set the attribute mode for the given entry
//children will inherit this display mode if they do not have their own display mode set
View.prototype.setAttribute = function setAttribute(entryId, key, value) {
  let view = this
  view = _createViewOptions(view, entryId)
  view = view.setIn(['options', entryId, 'attributes', key], value)
  return view
}


//get all attributes that have been set for an entry
View.prototype.getAttributeKeys = function getAttributeKeys(entryId) {
  if (!this.hasIn(['options', entryId, 'attributes']))
    return Immutable.Set([])

  let keys = this.getIn(['options', entryId, 'attributes']).keys()
  return Immutable.Set(keys)
}


//set the attributes map of the entry
//??? should this be controlled for shape?
//!!! should accept either JS or Immutable instances
View.prototype.setAttributes = function setAttributes(entryId, attributes) {
  let view = this;

  view = view.setIn(['options', entryId, 'attributes'], Immutable.fromJS(attributes, (key, value) => {
    switch (key) {
      case '':
        return value.toMap()
      default:
        return value.toSet(value)
    }
  }));
  return view;
}

//create the options record for the given view tree and entry id
function _createViewOptions(view, entryId) {
  if (! view.options.has(entryId))
    return view.setIn(['options', entryId], new ViewOptions())
  else
    return view
}

//does a lookup for the specified keys in the given entry
//if the given entry does not specify a value, then the parent will be checked and so on
//if no parent specifies a value, the value is null
function _recursiveGetInOptionsEntry(view, entryId, keys) {
  //if no display is set for this entry, check with the parent
  if (! view.hasIn(["options", entryId].concat(keys)))
    if (PathTools.hasParent(entryId))
      return _recursiveGetInOptionsEntry(view, PathTools.getParent(entryId), keys)
    else  
      return null
  else 
    return view.getIn(["options", entryId].concat(keys))

}

