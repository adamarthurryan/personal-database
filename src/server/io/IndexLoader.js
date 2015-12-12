"use strict";

import Index from '../../common/database/Index'
import * as Parser from '../../common/database/MarkdownIndexParser'
import FS from 'fs'
import Path from 'path'
import EventEmitter from 'events'
/* Emits events:
  - loaded: entryId, index
  - error: entryId, indexPath, message
*/

export default class IndexLoader extends EventEmitter {

  constructor(databasePath) {
    super()
    this.databasePath = databasePath
  }

  loadIndex(entryId, indexPath) {
    let filePath = Path.join(this.databasePath, indexPath)
    FS.readFile(Path.join(this.databasePath, indexPath), (err, data) => {
      if (err) 
        this.emit('error', entryId, indexPath, err)

      try {
        let index = Parser.parse(data.toString())
        this.emit('loaded', entryId, index)
      }
      catch (ex) {
        this.emit('error', entryId, indexPath, ex)
      }
    })
  }
}