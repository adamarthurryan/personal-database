
export default class Entry {
  constructor(path) {
    this.path = Entry.normalizePath(path);
    this.name = path.match(/[^\/]*$/)[0];
    this.resources = [];
    this.index = null;
    this.body = null;
  }
  static normalizePath(path) {
    return path.replace(/\/$/, "").replace(/^\//, "");
  }
}
