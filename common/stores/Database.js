import Immutable from 'immutable'

import * as PathTools from 'stores/PathTools'

//wu.js
//immutable.js ?

/*
  entries (Map):
    id (key)
    childIds (Set)
    parentId

  resources (Map):
    entryId (key)
    paths (Set)

  indices (Map):
    entryId (key)
    title
    body
    attributes (Map):
      key
      values (Set)
  
  // collections give a reverse lookup of the entries for each key
  // this is an optimization which might be implemented later
  collections (Map):
    key
    values (Map):
      name
      entryIds (Set)
*/

var Database = Immutable.Record({
  root: null,
  entries: Immutable.Map(),
  resources: Immutable.Map(),
  indices: Immutable.Map(),
//  collections: Immutable.Map()
});

var Entry = Immutable.Record({
  id: null, 
  childIds: Immutable.Set(), //of strings
  parentId: null
});

var Resource = Immutable.Record({
  entryId: null,
  paths: Immutable.Set() //of strings
});

var Index = Immutable.Record({
  entryId: null,
  title: null,
  body: null,
  attributes: Immutable.Map() //of Attribute records
});

var Attribute = Immutable.Record({
  key: null, 
  values: Immutable.Set() //of strings
});

/*
var Collections = Immutable.Record({
  key: null,
  values: Immutable.Map() //of Value records
})

var Value = Immutable.Record({
  name: null,
  entryIds: Immutable.Set()
});
*/

export function newDatabase() {
  return new Database();
}

export function addEntry(db, id) {

  if (!PathTools.isRoot(id)) {
    //calculate parent id
    let parentId = PathTools.getParent(id);

    //if the parent entry doesn't exist, create it
    if (! db.entries.has(parentId))
      db = addEntry(db, parentId)

    //add this entry to the parent's list of children
    db = db.mergeIn(['entries', parentId, 'childIds'], [id]);

    //add the entry
    db = db.setIn(['entries', id], new Entry({id, parentId}));
  }
  else {
    //add the root entry
    db = db.setIn(['entries', id], new Entry({id}));
    db = db.setIn(['root'], id);
  }

  db = db.setIn(['resources', id], new Resource({id}));
  db = db.setIn(['indices', id], new Index({id}));

  return db;
}


//remove an entry and its children without worrying about its parent
export function simpleRemoveEntry(db, id) {
  //remove all the children
  db = db.entries.get(id).childIds.reduce((db, childId)=>simpleRemoveEntry(db, childId), db);

  //delete the entry itself
  db = db.deleteIn(['entries', id]);

  //remove the associated index, resources and collections
  db = db.deleteIn(['resources', id]);
  db = db.deleteIn(['indices', id]);

  return db;
}

export function removeEntry(db, id) {
  //call child entries recursively?
  // entries.get(id).childIds.forEach(removeEntry);

  //if this entry doesn't meaningfully have a parent, the parentId will be null

  db = simpleRemoveEntry(db, id);

  if (PathTools.hasParent(id)) {
    //calculate parent id
    let parentId = PathTools.getParent(id);
  
    //remove this entry from the parent's list of children
    db = db.updateIn(['entries', parentId, 'childIds'], childIds=>childIds.delete(id));
  }

  return db;
}


//// below to update to Immutable

export function addResource(db, entryId, path) {
  db = db.updateIn(['resources', entryId, "paths"], paths=>paths.add(path));

  return db
}

export function removeResource(db, entryId, path) {
  if (db.resources.has(entryId)) {
    db = db.updateIn(['resources', entryId, "paths"], paths => paths.delete(path));
  }
  return db;
}

export function setBody(db, entryId, body) {
  db = db.setIn(['indices', entryId, 'body'], body);
  return db;
}


export function setTitle(db, entryId, title) {
  db = db.setIn(['indices', entryId, 'title'], title);
  return db;
}

export function setAttribute(db, entryId, key, values) {
  if (! db.hasIn(['indices', entryId, 'attributes', key]))
    db = db.setIn(['indices', entryId, 'attributes', key], new Attribute({key}));

  db = db.updateIn(['indices', entryId, 'attributes', key, 'values'], oldValues => Immutable.Set(values));
  return db;
}

function removeAttribute(db, entryId, key) {
  db = db.deleteIn(['indices', entryId, 'attributes', key]);

  return db;
}

