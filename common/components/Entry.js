
import React from 'react';
import Entries  from './Entries';
import EntriesContainer  from '../stores/Entries';
import {Link} from 'react-router-component';
import ResourceThumb from './ResourceThumb';
import ResourceLink from './ResourceLink';
import Breadcrumbs from './Breadcrumbs';
import ResourceDataStore from 'stores/ResourceDataStore'
import IndexResource from './IndexResource';
import AltContainer from 'alt-container';

export default class Entry extends React.Component { 

  constructor() {
    super();
  }  

  render () {
    var entries = this.props.entries;
    
    var path = this.props.path;


    var entry = entries.get(path);

    if (!entry)
      return <div>Loading...</div>

    var children = entries.getChildren(path);
    var childEntries = new EntriesContainer(children.map(entry => [entry.path, entry]));

    var thumbResources = entry.resources.filter(res => res.canThumbnail);
    var nonThumbResources = entry.resources.filter(res => ! res.canThumbnail);

    
    var indexResource = entry.indexResource;
    if (indexResource) {
      //!!! this should happen in didReceiveProps or something? 
      ResourceDataStore.fetchResource(indexResource);
    }


    return (
      <div className="entry">
        <Breadcrumbs entry={entry}/>
        <h1>{entry.title}</h1>
        <h6><i>{entry.indexPath}</i></h6>
        {indexResource ? 
          <AltContainer store={ResourceDataStore}>
            <IndexResource resource={indexResource}/>
          </AltContainer>
          : null
        }
        
        {nonThumbResources.map( resource => {
          return <ResourceLink resource={resource}/>
        })}
        {thumbResources.map( resource => {
          return <ResourceThumb resource={resource} size="400x400"/>
        })}
        {(children? <Entries entries={childEntries}/> : null)}
      </div> 
    );
  }
}
