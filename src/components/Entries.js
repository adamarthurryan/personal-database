import React from 'react';
import {Link} from 'react-router-component';
import ResourceList from './ResourceList';


export default class Entries extends React.Component { 

  constructor() {
    super();
  }

  render () {
    var entries = this.props.entries;

    var entryComps = Array.from(entries.keys()).map(path => {
      return <div className="entry">
        <h4><Link href={"/"+path}>{path}</Link></h4>
        {entries.get(path).resources.map( resource => {
          return <ResourceList entry={entries.get(path)} resource={resource}/>
        })}
      </div> 
    });

    return <div className = "entries">
      {entryComps}
    </div>
  }
}
