import React from 'react'
import EntryThumb from './EntryThumb'


export default class EntriesGrid extends React.Component {

  render () {
    const {entries, size} = this.props

    //expects entries to be an array of 
      // {entryId, resources, body, title} objects
    return <div className="u-cf">
      {entries.map( entry => {
          return <div key={entry.id} className='u-pull-left'><EntryThumb 
              entry={entry}
              size={size}
            /></div>
      })}
    </div>
  }
}