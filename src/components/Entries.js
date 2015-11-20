import React from 'react';
import {Link} from 'react-router-component';
import ResourceThumb from './ResourceThumb';


export default class Entries extends React.Component { 

  constructor() {
    super();
  }

  render () {
    var entries = this.props.entries;

    var entryComps = Array.from(entries.values()).map(entry => {
      return <div key={entry.path} className="entry">
        <h4><Link href={"/"+entry.path}>{entry.title}</Link></h4>
        {entry.resources.map( resource => {
          if (resource.canThumbnail)
            return <ResourceThumb resource={resource} size="200x200"/>
          else
            return null;
        })}
      </div> 
    });

    return <div className = "entries">
      {entryComps}
    </div>
  }
}
