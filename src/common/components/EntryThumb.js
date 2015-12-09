
import React from 'react';
import {Link} from 'react-router';
import ResourceThumb from './ResourceThumb';
import * as PathTools from '../database/PathTools'




export default class EntryThumb extends React.Component { 

  constructor() {
    super();
  }   

  render () {
    const {id, resourcePaths, title, body} = this.props.entry;
    const size = this.props.size
    

    let thumbResource = resourcePaths.find(path => canThumbnail(path));



    if (thumbResource)
      return <div className="entry entry-thumb" style={{width:300, height:300, position: "relative"}} key={id}>
          <Link to={"/"+id}>
            <ResourceThumb resource={thumbResource} size={size}/>
          </Link>
          <h4 style={{width:"100%", position: "absolute", backgroundColor:"rgba(255,255,255,0.5)", top: "0px"}}>
            <Link style={{fontWeight: "bold", color: "black", textDecoration: "none"}} to={'/'+id}>{title}</Link>
          </h4>
        </div>
    else
      return <div className="entry entry-thumb" style={{width:300, height:300, position: "relative"}} key={id}>
          <p>{body}</p>
          <h4 style={{width:"100%",position: "absolute", backgroundColor:"rgba(255,255,255,0.5)", top: "0px"}}>
            <Link style={{fontWeight: "bold", color: "black", textDecoration: "none"}} to={'/'+id}>{title}</Link>
          </h4>
        </div>
  }   
}


function canThumbnail(path) {
  let ext = PathTools.getExtension(path)
  ext = ext.toLowerCase()
  return (ext == '.jpg' || ext == '.gif' || ext == '.png' || ext=='.jpeg' )
}