import React from 'react'
//import Link from 'react-router'


//!!! The body should be markdown-ized

import * as  PathTools from '../database/PathTools'

function h (title, depth) {
  title = ">".repeat(depth) + " " + title
  switch(depth) {
    case 1:
      return <h2>{title}</h2>
    case 2:
      return <h3>{title}</h3>
    case 3:
      return <h4>{title}</h4>
    case 4:
      return <h5>{title}</h5>
    case 5:default:
      return <h6>{title}</h6>
  }
}
export default class EntriesOutline extends React.Component {

  render () {
    const {entries, parentId, depth} = this.props
    const currentDepth = this.props.currentDepth ? this.props.currentDepth : 1
    

    console.log(this.props)
    return <div>
      {entries.filter(entry => entry.parentId == parentId).map( entry => {
        return (
          <div key={entry.id}>
            {h(entry.title, currentDepth)}
            <p>{entry.body}</p>

            {(depth>1 ? <EntriesOutline 
              entries={entries.filter(childEntry => PathTools.isDescendantOf(childEntry.id, entry.id))} 
              depth={depth-1}
              parentId={entry.id}
              currentDepth={currentDepth+1}
              />
              : null)}
          </div>
        )
      })}
    </div>
  }
}