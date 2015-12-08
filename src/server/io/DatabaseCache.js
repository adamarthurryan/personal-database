import fs from 'fs'

import Database from '../../common/database/Database'

//!!! this scheme is not going to respect deletion of files between server instances
// a better scheme would load the cache while also reading the live database from scratch
// then, after a specified timeout, the live database would be substituted?
// if this happens, a cacheReset event would be emitted to clients

// another scheme would be to deep compare the cached to live database
// and then to perform the minimum number of delete operations to bring them back in sync

// yet a final scheme would be to save the cache with a comprehensive file listing of the database
// if that listing differs from the cached version, then the cache would be invalidated
// under that scheme, for a valid cache, chokidar would be initialized with the `ignoreInitial` option set

export default class DatabaseCacher {
  constructor(cacheFilePath) {
    this.updateDb = null
    this.cacheFilePath = cacheFilePath
    this.interval = setInterval(this.writeCache.bind(this), 10000)
  }

  //notify the cache that the db has changed
  notifyUpdate(db) {
    this.updateDb = db
  }

  //read the cache and return the database
  //returns a new empty database if the cache does not exist or there is an exception
  readCache() {
    //!!! this is syncronous - lame?

    try {
      fs.accessSync(this.cacheFilePath, fs.R_OK)
      let dbString = fs.readFileSync(this.cacheFilePath, 'utf8')
      let dbJS = JSON.parse(dbString)
      let db = Database.fromJS(dbJS)
      return db
    }
    catch (err) {
      console.log("Error reading cache file: ", err)
      return new Database()
    }
  }

  writeCache() {
    if (!this.updateDb)
      return

    let dbJS = this.updateDb.toJS()
    let dbString = JSON.stringify(dbJS)
    fs.writeFile(this.cacheFilePath, dbString, 'utf8',  err => { 
      if (err) 
        console.log("Error writing cache file: ", err)
    })
    //write the cache
  }

}