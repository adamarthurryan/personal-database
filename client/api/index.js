"use strict";

// chokidar for file watching
var chokidar = require('chokidar');


exports.serve = serve;

exports.Database = class Database {
  constructor (databasePath) {
    this.databasePath = databasePath;

    // initialize chokidar to watch for changes to the database
    var watcher = chokidar.watch(databasePath, {
      ignored: /[\/\\]\./,
      persistent: true
    });

    //Available events: add, addDir, change, unlink, unlinkDir, ready, raw, error. 
    //Additionally all is available which gets emitted with the underlying event name 
    //and path for every event other than ready, raw, and error.
    watcher.on('add', this.ckAdd);
    watcher.on('addDir', this.ckAddDir);
    watcher.on('change', this.ckChange) 
    watcher.on('unlink', this.ckAdd);
    watcher.on('unlinkDir', this.ckAddDir);

  }

  ckAdd(path) {
    //interpret the resource
  }
  ckAddDir(path) {

  }
  ckUnlink(path) {

  }
  ckUnlinkDir(path) {

  }
  ckChange(path) {

  }


  // register listener for database changes

  // request current database state
}

function serve(database) {

  //initialize the API



  return function (req, res, next) {
    res.status(501);
    res.send("Not yes implemented!")
  } 
}