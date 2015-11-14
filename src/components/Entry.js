
import React from 'react';
import Entries  from './Entries';
import EntriesContainer  from '../stores/Entries';
import {Link} from 'react-router-component';
import ResourceThumb from './ResourceThumb';


export default class Entry extends React.Component { 

  constructor() {
    super();
  }  

  render () {
    var entries = this.props.entries;
    
    var path = this.props.path;


    var entry = entries.get(path);

    var parent = entries.getParent(path)
    var children = entries.getChildren(path);
    var childEntries = new EntriesContainer(children.map(entry => [entry.path, entry]));

    if (!entry)
      return <div>Loading...</div>


    return (
      <div className="entry">
        {(parent? <i><Link href={"/"+parent.path}>up</Link></i>: null)}
        <h1>{path}</h1>
        {entry.resources.map( resource => {
          return <ResourceThumb entry={entry} resource={resource}/>
        })}
        {(children? <Entries entries={childEntries}/> : null)}
      </div> 
    );
  }
}
