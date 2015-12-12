import React from 'react'
import EntryThumb from './EntryThumb'


export default class EntriesGrid extends React.Component {

  render () {

    const {entryIds, db, size} = this.props

    //expects entries to be an array of 
      // {entryId, resources, body, title} objects
    return <div className="u-cf">
      {entryIds.map( id => {
          return <div key={id} className='u-pull-left'><EntryThumb 
              entryId={id}
              db={db}
              size={size}
            /></div>
      })}
    </div>
  }
}