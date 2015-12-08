import React from 'react';
import * as PathTools from '../database/PathTools'


export default class ResourceLink extends React.Component { 
  render() {

    return <div className="resource resource-link">
      <a href={"/static/"+this.props.resource}>
        {PathTools.getName(this.props.resource)}
      </a>
    </div>
  }
}
