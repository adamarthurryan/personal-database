"use strict";

// chokidar for file watching
import chokidar from 'chokidar';
import EventEmitter from 'events';
import Path from 'path';
import * as PathTools from '../../common/stores/PathTools'


export default class FileWatcher extends EventEmitter {
  //absolute (?) path to database
  constructor (databasePath) {
    super();
    this.databasePath = databasePath;

    // initialize chokidar to watch for changes to the database
    var watcher = chokidar.watch(databasePath, {
      ignored: /[\/\\]\./,
      persistent: true
    });


    //watcher.on('all', (event, path) => console.log("CK:", event, ", ", path));

    //Available events: add, addDir, change, unlink, unlinkDir, ready, raw, error. 
    //Additionally all is available which gets emitted with the underlying event name 
    //and path for every event other than ready, raw, and error.
    watcher.on('add', this.ckAdd.bind(this));
    watcher.on('addDir', this.ckAddDir.bind(this));
    watcher.on('change', this.ckChange.bind(this)) 
    watcher.on('unlink', this.ckUnlink.bind(this));
    watcher.on('unlinkDir', this.ckUnlinkDir.bind(this));
  }


  ckAdd(fullPath) {
    let path = stripPathPrefix(fullPath, this.databasePath);
    path = PathTools.normalize(path);

    if (isIndex(path)) {
      if (!isSubdirIndex(path))
        this.emit('addEntry', indexOf(path));
      this.emit('updateIndex', indexOf(path), path);
    }
    else 
      this.emit('addResource', resourceOf(path), path);

  }
  ckAddDir(fullPath) {
    let path = stripPathPrefix(fullPath, this.databasePath);
    path = PathTools.normalize(path);
    this.emit('addEntry', path);

  }
  ckUnlink(fullPath) {
    let path = stripPathPrefix(fullPath, this.databasePath);
    path = PathTools.normalize(path);

    if (isIndex(path)) {
      if (!isSubdirIndex(path))
        this.emit('removeEntry', indexOf(path));
      else 
        this.emit('removeIndex', indexOf(path));
    }
    else 
      this.emit('removeResource', resourceOf(path), path);
  }
  ckUnlinkDir(fullPath) {
    let path = stripPathPrefix(fullPath, this.databasePath);
    path = PathTools.normalize(path);
    this.emit('removeEntry', path)
  }
  ckChange(fullPath) {
    let path = stripPathPrefix(fullPath, this.databasePath);
    path = PathTools.normalize(path);
    if (isIndex(path)) 
      this.emit('updateIndex', indexOf(path), path);
    else 
      this.emit('updateResource', resourceOf(path), path);
  }
}

//return the base path, relative to the database root
function stripPathPrefix(path, basePath) {
  return path.slice(basePath.length);
}

//return true if this path represents an index file
function isIndex(path) {
  return (PathTools.getExtension(path) == '.md') 
}

function isSubdirIndex(path) {
  return (PathTools.getName(path) == 'index.md')
}

//return the entry id (entry path) for which this file is the index
function indexOf(path) {
  if (isSubdirIndex(path))
    return PathTools.getParent(path)
  else
    return PathTools.getParent(path)+"/"+PathTools.stripExtension(PathTools.getName(path));
}

//return the entry id (entry path) for which this file is a resource
function resourceOf(path) {
  return Path.dirname(path)+"/"+Path.basename(path, '.md');
}
