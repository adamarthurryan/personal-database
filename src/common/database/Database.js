import Immutable from 'immutable'

import * as PathTools from './PathTools'
import * as TitleTools from './TitleTools'

import Index from './Index'

//wu.js
//immutable.js ?

var Database = Immutable.Record({
  entries: Immutable.Map(),
  resources: Immutable.Map(),
  indices: Immutable.Map(), //of Index records
//  collections: Immutable.Map()
});
export default Database;


var Entry = Immutable.Record({
  id: null, 
  childIds: Immutable.Set(), //of strings
  parentId: null
}); 

var Resource = Immutable.Record({
  entryId: null,
  paths: Immutable.Set() //of strings
});
 


/* collections give a reverse lookup of the entries for each key
   this is an optimization which might be implemented later

var Collections = Immutable.Record({
  key: null,
  values: Immutable.Map() //of Value records
})

var Value = Immutable.Record({
  name: null,
  entryIds: Immutable.Set()
});
*/


Database.fromJS = function fromJS(object) {

  let entries = Immutable.fromJS(object.entries, (key, value) => {
    let isKeyed = Immutable.Iterable.isKeyed(value);
    if (isKeyed) 
      return (key=='') ? value.toMap() : new Entry(value)
    else
      return value.toSet()
  })

  let resources = Immutable.fromJS(object.resources, (key, value) => {
    let isKeyed = Immutable.Iterable.isKeyed(value);
    if (isKeyed) 
      switch (key) {
        case '':
          return value.toMap()
        case 'paths':
          return value.toMap()
        default:
          return new Resource(value)
      }      
    else
      return value.toSet()
  })

  let indices = Immutable.fromJS(object.indices, (key, value) => {
    let isKeyed = Immutable.Iterable.isKeyed(value);
    if (isKeyed) 
      switch (key) {
        case '':
          return value.toMap()
        case 'attributes':
          return value.toMap()
        default:
          return new Index(value)
      }
    else
      return value.toSet()
  })


  return new Database({entries, resources, indices})

}


Database.prototype.addEntry = function addEntry(id) {
  let db = this;

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

  db = db.setIn(['resources', id], new Resource({entryId:id}));
  db = db.setIn(['indices', id], new Index({entryId:id}));

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

//add a resource to the given entry
Database.prototype.addResource = function addResource(entryId, path) {
  let db = this;

  db = db.updateIn(['resources', entryId, "paths"], paths=>paths.add(path));

  return db
}

//remove a resource from the given entry
Database.prototype.removeResource = function removeResource(entryId, path) {
  let db = this;

  if (db.resources.has(entryId)) {
    db = db.updateIn(['resources', entryId, "paths"], paths => paths.delete(path));
  }
  return db;
}

//set the body of the entry
Database.prototype.setBody = function setBody(entryId, body) {
  let db = this;

  db = db.setIn(['indices', entryId, 'body'], body);
  return db;
}


//set the title of the entry
Database.prototype.setTitle = function setTitle(entryId, title) {
  let db = this;

  db = db.setIn(['indices', entryId, 'title'], title);
  return db;
}

//set the values for an attribute of the entry
Database.prototype.setAttribute = function setAttribute(entryId, key, values) {
  let db = this;

  db = db.setIn(['indices', entryId, 'attributes', key], Immutable.Set(values));

  return db;
}

//set the attributes map of the entry
//??? should this be controlled for shape?
Database.prototype.setAttributes = function setAttributes(entryId, attributes) {
  let db = this;

  db = db.setIn(['indices', entryId, 'attributes'], attributes);

  return db;
}

//remove an attribute from the entry
Database.prototype.removeAttribute = function removeAttribute(entryId, key) {
  let db = this;

  db = db.deleteIn(['indices', entryId, 'attributes', key]);

  return db;
}

//get all resources for an entry
Database.prototype.getResources = function getResource(entryId) {
  return this.getIn(['resources', entryId, 'paths']);
}

//get all values for an attribute
Database.prototype.getAttribute = function getAttribute(entryId, key) {
  return this.getIn(['indices', entryId, 'attributes', key]);
}

//get all attributes that have been set for an entry
Database.prototype.getAttributeKeys = function getAttributes(entryId) {
  return Immutable.Set(this.getIn(['indices', entryId, 'attributes']).keys())
}

//get all entries that have a particular value for an attribute
Database.prototype.getEntriesForAttibute = function getEntriesForAttibute(key, value) {
  let indices = this.indices.toSet().filter(index => index.attributes.has(key) && index.attributes.get(key).has(value));

  return indices.map(index => index.entryId);
}

//get title for an entry
Database.prototype.getTitle = function getTitle(entryId) {
  let title = this.indices.get(entryId).title;
  if (title == null)
    title = TitleTools.titleize(entryId);

  return title;
}

//get body for an entry
Database.prototype.getBody = function getBody(entryId) {
  return this.indices.get(entryId).body;
}

//get all children for an entry
Database.prototype.getChildren = function getChildren(entryId) {
  return this.entries.get(entryId).childIds;
}

//erase all index data for an entry
Database.prototype.wipeIndex = function wipeIndex(entryId) {
  return this
    .setIn(['indices', entryId, 'title'], null)
    .setIn(['indices', entryId, 'body'], null)
    .setIn(['indices', entryId, 'attributes'], Immutable.Map())
}