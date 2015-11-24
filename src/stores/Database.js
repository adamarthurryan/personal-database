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
      values (Array)
  
  // collections give a reverse lookup of the entries for each key
  collections (Map):
    key
    values (Map):
      name
      entryIds (Set)
*/


let entries = new Map();
let resources = new Map();
let indices = new Map();
let collections = new Map();

var db = {entries, resources, indices, collections}

addEntry(id) {
  //calculate parent id
  let parentId = getParentId(id);

  //add the entry
  entries.set(id, {id, parentId, new Set(}));

  //add this entry to the parent's list of children
  let parentEntry = entries.get(parentId);
  parentEntry.childIds.add(id);
  entries.set(parentId, parentEntry);
}


removeEntry(id) {
  //!!! should this be recursive?
  //call child entries recursively?
  // entries.get(id).childIds.forEach(removeEntry);

  //calculate parent id
  let parentId = getParentId(id);

  //remove the entry
  entries.delete(id);

  //remove this entry from the parent's list of children
  let parentEntry = entries.get(parentId);
  parentEntry.childIds.delete(id);
  entries.set(parentId, parentEntry);

  //remove the associated index, resources and collections
  resources.delete(entryId);
  dropIndex(entryId);
}

addResource(entryId, path) {
  let paths = null;
  if (resources.has(entryId))
    paths = resources.get(entryId);
  else
    paths = new Set();

  paths.add(path)

  resources.set(entryId, paths);
}

removeResource(entryId, path) {
  if (resources.has(entryId)) {
    let paths = resources.get(entryId);
    paths.delete(path);
    resources.set(entryId, paths);
  }
}


updateIndex(entryId, indexData) {
  let {title, body, attributes} = indexData;

  indices.set(entryId, {entryId, title, body, attributes});

  for (let attr of attributes) {
    let collection = null;
    if (collections.has(attr.key))
      collection = collections.get(attr.key);
    else
      collection = new Map();

    for (let value of attr.values) {
      if (collection.values.has(value)) 
        record = collection.values.get(value)
      else
        record = new Set();

      record.add(entryId);
      collection.values.set(value, record);
    }

    collections.set(attr.key, collection)
  }
}

dropIndex(entryId) {
  //load the index
  //expunge this entry from every collection that it appears in
  //expunge the index
}
