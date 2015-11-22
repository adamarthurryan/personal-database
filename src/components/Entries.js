import React from 'react';
import {Link} from 'react-router-component';
import ResourceThumb from 'components/ResourceThumb';
import IndexResource from 'components/IndexResource';
import ResourceDataStore from 'stores/ResourceDataStore';
import AltContainer from 'alt-container';
import LazyLoad from 'react-lazy-load';


export default class Entries extends React.Component { 

  constructor() {
    super();
  }

  render () {
    var entries = this.props.entries;

    //With lazy loading, this needs to be rethought
    Array.from(entries.values()).forEach(entry => {
      if (entry.indexResource)
        //!!! this should happen in didReceiveProps or something? 
        ResourceDataStore.fetchResource(entry.indexResource);

    });

    var entryComps = Array.from(entries.values()).map(entry => {
      return <div key={entry.path} className="entry">
        <h2><Link href={"/"+entry.path}>{entry.title}</Link></h2>
        <LazyLoad>
          {entry.indexResource ? 
            <AltContainer store={ResourceDataStore}>
              <IndexResource resource={entry.indexResource}/>
            </AltContainer>
            : null
          }
          {entry.resources.map( resource => {
            if (resource.canThumbnail)
              return <ResourceThumb resource={resource} size="200x200"/>
            else
              return null;
          })}
        </LazyLoad>
      </div> 
    });

    return <div className = "entries">
      {entryComps}
    </div>
  }
}
