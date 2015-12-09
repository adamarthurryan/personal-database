import Immutable from 'immutable'

import * as PathTools from './PathTools'
import * as TitleTools from './TitleTools'

import Index from './Index'

//!!! this interface should be simplified and refactored
  //expose entry/resource/index objects instead?

//!!! Immutable objects should not be exposed out of the database 
  // - simple JS objects are better
  // - expect JS at get/set interfaces

//??? should entry/resource/index be merged into a single object? Why are they separate?

var Database = Immutable.Record({
  entries: Immutable.Map(), //of Entries
});
export default Database;


var Entry = Immutable.Record({
  id: null,
  childIds: Immutable.Set(),
  parentId: null,
  resourcePaths: Immutable.Set(),
  title: null,
  body: null,
  attributes: Immutable.Map()
});

/* collections give a reverse lookup of the entries for each attribute key
   this is an optimization which might be implemented later

var Collections = Immutable.Record({
  key: null,
  values: Immutable.Map() //of Value records
})

var Value = Immutable.Record({
  name: null,
  ids: Immutable.Set()
});
*/


Database.fromJS = function fromJS(object) {

  let entries = Immutable.fromJS(object.entries, (key, value) => {
    let isKeyed = Immutable.Iterable.isKeyed(value);
    if (isKeyed) 
      switch (key) {
        case '':
          return value.toMap()
        //resourcePaths and childIds should be non-keyed
        //case 'resourcePaths': case 'childIds'
        //  return value.toSet()
        case 'attributes': 
          return value.toMap()
        default:
          return new Entry(value)
      }      
    else
      return value.toSet()
  })

  return new Database({entries:entries.toMap()})

}


Database.prototype.addEntry = function addEntry(id) {
  let db = this;

  //do nothing if this entry is already in the database
  //we assume that it has all the necessary bits and pieces
  if (db.entries.has(id))
    return db;

  if (!PathTools.isRoot(id)) {
    //calculate parent id
    let parentId = PathTools.getParent(id);

    //if the parent entry doesn't exist, create it
    if (! db.entries.has(parentId))
      db = db.addEntry(parentId)

    //add this entry to the parent's list of children
    db = db.mergeIn(['entries', parentId, 'childIds'], [id]);

    //add the entry
    db = db.setIn(['entries', id], new Entry({id, parentId}));
  }
  else {
    //add the root entry
    db = db.setIn(['entries', id], new Entry({id}));
  }

  return db;
}


//remove an entry and its children without worrying about its parent
function _simpleRemoveEntry(db, id) {
  //remove all the children
  db = db.entries.get(id).childIds.reduce((db, childId)=>_simpleRemoveEntry(db, childId), db);

  //delete the entry itself
  db = db.deleteIn(['entries', id]);


  return db;
}

//remove the entry, all its children and all associated resources and indices
//will also remove the entry from list of its parents children
Database.prototype.removeEntry = function removeEntry(id) {
  let db = this;

  db = _simpleRemoveEntry(db, id);

  if (PathTools.hasParent(id)) {
    //calculate parent id
    let parentId = PathTools.getParent(id);
  
    //remove this entry from the parent's list of children
    db = db.updateIn(['entries', parentId, 'childIds'], childIds=>childIds.delete(id));
  }

  return db;
}

//return true if the entry exists
Database.prototype.hasEntry = function hasEntry(id) {
  let db = this;

  return db.entries.has(id);
}

//create a new object with all the fields of the given entry: its resource and index values as well
// ??? this might be better implemented with something like rackt/reselect
Database.prototype.getEntry = function getEntry(id) {
  let db = this;

  return db.entries.get(id)
}

//add a resource to the given entry
Database.prototype.addResource = function addResource(id, path) {
  let db = this;

  db = db.updateIn(['entries', id, "resourcePaths"], paths=>paths.add(path));

  return db
}

//remove a resource from the given entry
Database.prototype.removeResource = function removeResource(id, path) {
  let db = this;

  db = db.updateIn(['entries', id, "resourcePaths"], paths => paths.delete(path));
  return db;
}

//set the body of the entry
Database.prototype.setBody = function setBody(id, body) {
  let db = this;

  db = db.setIn(['entries', id, 'body'], body);
  return db;
}


//set the title of the entry
Database.prototype.setTitle = function setTitle(id, title) {
  let db = this;

  db = db.setIn(['entries', id, 'title'], title);
  return db;
}
 
//set the values for an attribute of the entry
Database.prototype.setAttribute = function setAttribute(id, key, values) {
  let db = this;

  db = db.setIn(['entries', id, 'attributes', key], Immutable.Set(values));

  return db;
}

//set the attributes map of the entry
//??? should this be controlled for shape?
Database.prototype.setAttributes = function setAttributes(id, attributes) {
  let db = this;

  db = db.setIn(['entries', id, 'attributes'], Immutable.fromJS(attributes, (key, value) => {
    switch (key) {
      case '':
        return value.toMap()
      default:
        return value.toSet(value)
    }
  }));
  return db;
}

//remove an attribute from the entry
Database.prototype.removeAttribute = function removeAttribute(id, key) {
  let db = this

  db = db.deleteIn(['entries', id, 'attributes', key])

  return db
}

//get all resources for an entry
Database.prototype.getResources = function getResource(id) {
  return this.getIn(['entries', id, 'resourcePaths'])
}

//get all values for an attribute
Database.prototype.getAttribute = function getAttribute(id, key) {
  if (!this.hasIn(['entries', id, 'attributes', key]))
    return undefined
  return this.getIn(['entries', id, 'attributes', key])
}

Database.prototype.hasAttribute = function hasAttribute(id, key) {
  return this.hasIn(['entries', id, 'attributes', key])
}

//get all attributes that have been set for an entry
Database.prototype.getAttributeKeys = function getAttributeKeys(id) {
  if (!this.hasIn(['entries', id, 'attributes']))
    return Immutable.Set([])

  let keys = this.getIn(['entries', id, 'attributes']).keys()
  return Immutable.Set(keys)
}

//get all entries that have a particular value for an attribute
Database.prototype.getEntriesForAttibute = function getEntriesForAttibute(key, value) {
  let entries = this.entries.filter((entry) => entry.attributes.has(key) && entry.attributes.get(key).has(value))

  return entries.map(entry=>entry.id).toSet()
}

//get title for an entry
Database.prototype.getTitle = function getTitle(id) {
  let title = this.entries.get(id).title
  if (title == null)
    title = TitleTools.titleize(id)

  return title
}

//get body for an entry
Database.prototype.getBody = function getBody(id) {
  return this.entries.get(id).body
}

//get all children for an entry
Database.prototype.getChildren = function getChildren(id) {
  return this.entries.get(id).childIds
}

//erase all index data for an entry
Database.prototype.wipeIndex = function wipeIndex(id) {
  return this
    .setIn(['entries', id, 'title'], null)
    .setIn(['entries', id, 'body'], null)
    .setIn(['entries', id, 'attributes'], Immutable.Map())
}