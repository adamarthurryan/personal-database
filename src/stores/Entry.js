import * as PathTools from './PathTools'

export default class Entry {
  constructor(path) {
    let normPath = PathTools.normalize(path);
    this.path = normPath
    this.name = PathTools.getNamePart(normPath);
    this.title = Entry.titleize(this.name);
    this.resources = [];
    this.indexResource = null;
  }
  static titleize(name) {
    let title = name.replace(/-/g, ' ');
    let words = title.split(' ');
    words=words.map(word => word.slice(0,1).toUpperCase()+word.slice(1).toLowerCase());
    return words.join(' ');
  }
}
