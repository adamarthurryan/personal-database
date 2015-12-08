import React from 'react';

import * as PathTools from '../database/PathTools'


export default class ResourceThumb extends React.Component { 
  render() {
    let thumbOptions = "thumb="+this.props.size;

    let [_, width, height]= this.props.size.match(/(\d+)x(\d+)/)

    var style = {
      width, height
    }

    //!!! Not sure if the <a> tags are a good idea
    // perhaps the image should be shown in a react component

    return <div style={style} className="resource resource-thumb">
      <img className='u-max-full-width' src={"/static/"+this.props.resource+"?"+thumbOptions} alt={PathTools.getName(this.props.resource)}/>
    </div>
  }
}
