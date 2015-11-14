import React from 'react';


export default class ResourceThumb extends React.Component { 
  render() {
    if (! this.props.entry || ! this.props.resource)
      //should have a better loading display
      return <p>Loading</p> 

    var resourcePath = this.props.entry.path+"/"+this.props.resource;

    if (isImage(this.props.resource)) {
      var thumbOptions = "thumb=400x400";

      //!!! Not sure if the <a> tags are a good idea
      // perhaps the image should be shown in a react component

      return <div className="resource resource-thumb-thumb">
        <a href={"/static/"+resourcePath}>
          <img src={"/static/"+resourcePath+"?"+thumbOptions}/>
        </a>
      </div>
    }
    else {
      return <div className="resource resource-thumb-name">
        <a href={"/static/"+resourcePath}>
          <span>{this.props.resource}</span>
        </a>
      </div>
    }
  }
}

function isImage(resource) {
  return resource.toLowerCase().match(/\.(jpg|jpeg|png)$/);
}
