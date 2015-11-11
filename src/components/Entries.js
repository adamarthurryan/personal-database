require('normalize.css');
require('styles/App.css');

import React from 'react';
import {Link} from 'react-router-component';


export default class Entry extends React.Component { 

  constructor() {
    super();
  }

  render () {
    var entries = this.props.entries;

    var entryComps = Object.keys(entries).map(path => {
      return <div>
        <h1><Link href={"/"+path}>{path}</Link></h1>
        {entries[path].resources.map( resource => {
          return <p>{resource}</p>
        })}
      </div> 
    });

    return <div>
      {entryComps}
    </div>
  }
}
