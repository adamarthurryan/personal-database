import React from 'react';


export default class ResourceLink extends React.Component { 
  render() {
    if (! this.props.resource)
      //should have a better loading display
      return <p>Loading</p> 


    return <div className="resource resource-link">
      <a href={"/static/"+this.props.resource.path}>
        {this.props.resource.name}
      </a>
    </div>
  }
}
