import React from 'react';


export default class ResourceList extends React.Component { 
  render() {
    if (! this.props.entry || ! this.props.resource)
      //should have a better loading display
      return <p>Loading</p> 

    if (isImage(this.props.resource)) {
      var resourcePath = this.props.entry.path+"/"+this.props.resource;
      var thumbOptions = "thumb=200x200";

      return <div  className="resource resource-list-thumb">
        <img src={"/static/"+resourcePath+"?"+thumbOptions}/>
        {false?<span>&nbsp; {this.props.resource}</span>:null}
      </div>
    }
    else {
      return <div  className="resource resource-list-name"><span>{this.props.resource}</span></div>
    }

  }
}

function isImage(resource) {
  return resource.toLowerCase().match(/\.(jpg|jpeg|png)$/);
}
