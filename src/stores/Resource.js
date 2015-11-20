import Entry from './Entry';
import * as PathTools from './PathTools';

export default class Resource {
  constructor(path) {
    let normPath = PathTools.normalize(path);
    this.path = normPath
    this.name = PathTools.getNamePart(normPath);

    this.canThumbnail = Resource.matchExtension(IMAGE_EXTENSIONS, path);
    this.canLoadText = Resource.matchExtension(TEXT_EXTENSIONS, path);
    //this.loadingState = this.canLoadText() ? Resource.LOADABLE : Resource.NOT_LOADABLE;
  }
  //returns true if the resource has the given extension
  static matchExtension(exts, path) {
    var path = path.toLowerCase();
    return exts.some(ext => path.endsWith(ext));
  }

}

var IMAGE_EXTENSIONS = [".jpg", ".png", ".jpeg", ".gif"];
var TEXT_EXTENSIONS = [".txt", ".md"];
/*
Resource.LOADED = "loaded";
Resource.LOADABLE = "loadable";
Resource.LOADING = "loading";
Resource.LOAD_FAILED ="load failed";
Resource.NOT_LOADABLE = "not loadable";
*/