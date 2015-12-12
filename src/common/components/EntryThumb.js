
import React from 'react';
import {Link} from 'react-router';
import ResourceThumb from './ResourceThumb';
import * as PathTools from '../database/PathTools'




export default class EntryThumb extends React.Component { 

  constructor() {
    super();
  }   

  render () {
    const {entryId, db, size} = this.props
    
    let thumbResource = _findThumbResource(db, entryId)

    if (thumbResource)
      return <div className="entry entry-thumb" style={{width:300, height:300, position: "relative"}} key={entryId}>
          <Link to={"/"+entryId}>
            <ResourceThumb resource={thumbResource} size={size}/>
          </Link>
          <h4 style={{width:"100%", position: "absolute", backgroundColor:"rgba(255,255,255,0.5)", top: "0px"}}>
            <Link style={{fontWeight: "bold", color: "black", textDecoration: "none"}} to={'/'+entryId}>{db.getTitle(entryId)}</Link>
          </h4>
        </div>
    else
      return <div className="entry entry-thumb" style={{width:300, height:300, position: "relative"}} key={entryId}>
          <p>{db.getBody(entryId)}</p>
          <h4 style={{width:"100%",position: "absolute", backgroundColor:"rgba(255,255,255,0.5)", top: "0px"}}>
            <Link style={{fontWeight: "bold", color: "black", textDecoration: "none"}} to={'/'+entryId}>{db.getTitle(entryId)}</Link>
          </h4>
        </div>
  }   
}


function _findThumbResource (db, entryId) {
  let resourcePaths = db.getResources(entryId)
  let thumbResource = resourcePaths.find(path => _canThumbnail(path));

  if (thumbResource)
    return thumbResource
  
  if (!db.hasChildren(entryId))
    return undefined

  return db.getChildren(entryId).reduce((result, childId) => {
    if (result)
      return result

    return _findThumbResource(db, childId)
  }, undefined)


}
function _canThumbnail(path) {
  let ext = PathTools.getExtension(path)
  ext = ext.toLowerCase()
  return (ext == '.jpg' || ext == '.gif' || ext == '.png' || ext=='.jpeg' )
}