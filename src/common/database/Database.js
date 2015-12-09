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
  entries: Immutable.OrderedMap(),
  resources: Immutable.OrderedMap(),
  indices: Immutable.OrderedMap(), //of Index records
//  collections: Immutable.OrderedMap()
});
export default Database;


var FullEntry = Immutable.Record({
  id: null,
  childIds: Immutable.OrderedSet(),
  parentId: null,
  resourcePaths: Immutable.OrderedSet(),
  title: null,
  body: null,
  attributes: Immutable.OrderedMap()
});

var Entry = Immutable.Record({
  id: null, 
  childIds: Immutable.OrderedSet(), //of strings
  parentId: null
}); 

var Resource = Immutable.Record({
  id: null,
  resourcePaths: Immutable.OrderedSet() //of strings
});

/* collections give a reverse lookup of the entries for each key
   this is an optimization which might be implemented later

var Collections = Immutable.Record({
  key: null,
  values: Immutable.OrderedMap() //of Value records
})

var Value = Immutable.Record({
  name: null,
  ids: Immutable.OrderedSet()
});
*/


Database.fromJS = function fromJS(object) {

  let entries = Immutable.fromJS(object.entries, (key, value) => {
    let isKeyed = Immutable.Iterable.isKeyed(value);
    if (isKeyed) 
      return (key=='') ? value.toMap() : new Entry(value)
    else
      return value.toOrderedSet()
  })

  let resources = Immutable.fromJS(object.resources, (key, value) => {
    let isKeyed = Immutable.Iterable.isKeyed(value);
    if (isKeyed) 
      switch (key) {
        case '':
          return value.toOrderedMap()
        case 'resourcePaths':
          return value.toOrderedMap()
        default:
          return new Resource(value)
      }      
    else
      return value.toOrderedSet()
  })

  let indices = Immutable.fromJS(object.indices, (key, value) => {
    let isKeyed = Immutable.Iterable.isKeyed(value);
    if (isKeyed) 
      switch (key) {
        case '':
          return value.toOrderedMap()
        case 'attributes':
          return value.toOrderedMap()
        default:
          return new Index(value)
      }
    else
      return value.toOrderedSet()
  })


  return new Database({entries:entries.toOrderedMap(), resources:resources.toOrderedMap(), indices:indices.toOrderedMap()})

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

  db = db.setIn(['resources', id], new Resource({id:id}));
  db = db.setIn(['indices', id], new Index({id:id}));

  return db;
}


//remove an entry and its children without worrying about its parent
function _simpleRemoveEntry(db, id) {
  //remove all the children
  db = db.entries.get(id).childIds.reduce((db, childId)=>_simpleRemoveEntry(db, childId), db);

  //delete the entry itself
  db = db.deleteIn(['entries', id]);

  //remove the associated index, resources and collections
  db = db.deleteIn(['resources', id]);
  db = db.deleteIn(['indices', id]);

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

  if (!db.entries.has(id))
    return undefined


  return (new FullEntry()).merge(db.entries.get(id), db.resources.get(id), db.indices.get(id))
}

//add a resource to the given entry
Database.prototype.addResource = function addResource(id, path) {
  let db = this;

  db = db.updateIn(['resources', id, "resourcePaths"], paths=>paths.add(path));

  return db
}

//remove a resource from the given entry
Database.prototype.removeResource = function removeResource(id, path) {
  let db = this;

  if (db.resources.has(id)) {
    db = db.updateIn(['resources', id, "resourcePaths"], paths => paths.delete(path));
  }
  return db;
}

//set the body of the entry
Database.prototype.setBody = function setBody(id, body) {
  let db = this;

  db = db.setIn(['indices', id, 'body'], body);
  return db;
}


//set the title of the entry
Database.prototype.setTitle = function setTitle(id, title) {
  let db = this;

  db = db.setIn(['indices', id, 'title'], title);
  return db;
}
 
//set the values for an attribute of the entry
Database.prototype.setAttribute = function setAttribute(id, key, values) {
  let db = this;

  db = db.setIn(['indices', id, 'attributes', key], Immutable.OrderedSet(values));

  return db;
}

//set the attributes map of the entry
//??? should this be controlled for shape?
Database.prototype.setAttributes = function setAttributes(id, attributes) {
  let db = this;

  db = db.setIn(['indices', id, 'attributes'], Immutable.fromJS(attributes, (key, value) => {
    switch (key) {
      case '':
        return value.toOrderedMap()
      default:
        return value.toOrderedSet(value)
    }
  }));
  return db;
}

//remove an attribute from the entry
Database.prototype.removeAttribute = function removeAttribute(id, key) {
  let db = this

  db = db.deleteIn(['indices', id, 'attributes', key])

  return db
}

//get all resources for an entry
Database.prototype.getResources = function getResource(id) {
  return this.getIn(['resources', id, 'resourcePaths'])
}

//get all values for an attribute
Database.prototype.getAttribute = function getAttribute(id, key) {
  if (!this.hasIn(['indices', id, 'attributes', key]))
    return undefined
  return this.getIn(['indices', id, 'attributes', key])
}

Database.prototype.hasAttribute = function hasAttribute(id, key) {
  return this.hasIn(['indices', id, 'attributes', key])
}

//get all attributes that have been set for an entry
Database.prototype.getAttributeKeys = function getAttributes(id) {
  if (!this.hasIn(['indices', id, 'attributes']))
    return Immutable.OrderedSet([])

  return Immutable.OrderedSet(this.getIn(['indices', id, 'attributes']).keys())
}

//get all entries that have a particular value for an attribute
Database.prototype.getEntriesForAttibute = function getEntriesForAttibute(key, value) {
  let indices = this.indices.toSet().filter(index => index.attributes.has(key) && index.attributes.get(key).has(value))

  return indices.map(index => index.id)
}

//get title for an entry
Database.prototype.getTitle = function getTitle(id) {
  let title = this.indices.get(id).title
  if (title == null)
    title = TitleTools.titleize(id)

  return title
}

//get body for an entry
Database.prototype.getBody = function getBody(id) {
  return this.indices.get(id).body
}

//get all children for an entry
Database.prototype.getChildren = function getChildren(id) {
  return this.entries.get(id).childIds
}

//erase all index data for an entry
Database.prototype.wipeIndex = function wipeIndex(id) {
  return this
    .setIn(['indices', id, 'title'], null)
    .setIn(['indices', id, 'body'], null)
    .setIn(['indices', id, 'attributes'], Immutable.OrderedMap())
}