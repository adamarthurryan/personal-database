require('normalize.css');
require('styles/App.css');

import React from 'react';
import Entries  from './Entries';


export default class Entry extends React.Component { 

  constructor() {
    super();
  }  

  render () {
    var entries = this.props.entries;
    var entryPaths = Object.keys(entries);

    var path = this.props.path;

    //this regex should return the immediate children of the entry
    var reChildren = new RegExp(path+"/([^/]*)$")

    var childPaths = entryPaths.filter(entryPath => {
      return entryPath.match(reChildren);
    });

    console.log(childPaths);

    var children = {};

    childPaths.forEach(childPath => children[childPath] = entries[childPath]);



    if (!entries[path])
      return <div>Loading...</div>

    return (
      <div>
        <h1>{path}</h1>
        {entries[path].resources.map( resource => {
          return <p>{resource}</p>
        })}
        <Entries entries={children}/>
      </div> 
    );
  }
}
