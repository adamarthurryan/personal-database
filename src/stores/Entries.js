import Entry from "./Entry"
import * as PathTools from './PathTools'


/* V8 doesn't support extending builtins (like Map) so we have to implement this as a wrapper.*/

/*!!! Map is not the correct datastructure for this collection.
Instead, we should have something with easy querying by prefix string or path. A doubly-linked tree?*/ 

/*!!! the get functions should all return instances of Entries, which should be iterable */



export default class Entries  {

  constructor(entries) {
    this.map=new Map(entries);

    ["get", "set", "has", "keys", "values", "entries", "forEach"].forEach(fn => {
      this[fn] = this.map[fn].bind(this.map);
    });
  }


  getRoot() {
    return this.map.get('/');
  }

  getDescendants(parentPath) {
    var parentPath = PathTools.normalize(parentPath);

    return Array.from(this.map.values())
      .filter(entry => PathTools.isDescendantOf(entry.path, parentPath));
  }

  getChildren(parentPath) {
    var parentPath = PathTools.normalize(parentPath);

    return Array.from(this.map.values())
      .filter(entry => PathTools.isChildOf(entry.path, parentPath));
  }

  getParent(childPath) {
    var childPath = PathTools.normalize(childPath);

    return Array.from(this.map.values())
      .find(entry => PathTools.isChildOf(childPath, entry.path));
  }

  getAncestors(childPath) {
    var childPath = PathTools.normalize(childPath);

    return Array.from(this.map.values())
      .filter(entry => PathTools.isDescendantOf(childPath, entry.path));
  }
}

