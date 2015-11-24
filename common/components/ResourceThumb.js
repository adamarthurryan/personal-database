import React from 'react';


export default class ResourceThumb extends React.Component { 
  render() {
    if (! this.props.resource)
      //should have a better loading display
      return <p>Loading</p> 

    var thumbOptions = "thumb="+this.props.size;

    //!!! Not sure if the <a> tags are a good idea
    // perhaps the image should be shown in a react component

    return <div className="resource resource-thumb">
      <a href={"/static/"+this.props.resource.path}>
        <img src={"/static/"+this.props.resource.path+"?"+thumbOptions} alt={this.props.resource.name}/>
      </a>
    </div>
  }
}
