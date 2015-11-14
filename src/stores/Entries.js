import Entry from "./Entry"


/* V8 doesn't support extending builtins (like Map) so we have to implement this as a wrapper.*/
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
    var parentPath = Entry.normalizePath(parentPath);

    return Array.from(this.map.values())
      .filter(entry => entry.path.match("^"+parentPath+"(^|/).*$"));
  }

  getChildren(parentPath) {
    var parentPath = Entry.normalizePath(parentPath);

//    console.log("getChildren", parentPath);
    return Array.from(this.map.values()).filter(entry => {
//      console.log(" > ", entry.path, entry.path.match(parentPath+"(^|/)[^/]*$"))
      return (
        entry.path.match("^"+parentPath+"(^|/)[^/]*$") 
        && (parentPath.length < entry.path.length)
      );
    });
  }

  getParent(childPath) {
    var childPath = Entry.normalizePath(childPath);

    return Array.from(this.map.values()).find(entry =>
      ( childPath.match("^"+entry.path+"(^|/)[^/]*$")
        && childPath.length > entry.path.length)
    );
  }

  getAncestors(childPath) {
    var childPath = Entry.normalizePath(childPath);

    return Array.from(this.map.values()).filter(entry =>
      childPath.match("^"+entry.path+"(^|/).*$")   
    );
  }
}

