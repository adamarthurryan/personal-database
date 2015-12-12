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
    const {entryIds, db , depth} = this.props
    //!!! should really look up how to specify props in react
    const currentDepth = this.props.currentDepth ? this.props.currentDepth : 1
    
    return <div>
      {entryIds.map( entryId => {
        return (
          <div key={entryId}>
            {h(db.getTitle(entryId), currentDepth)}
            <p>{db.getBody(entryId)}</p>

            {(depth>1 ? <EntriesOutline 
              db={db}
              depth={depth-1}
              entryIds={db.getChildren(entryId)}
              currentDepth={currentDepth+1}
              />
              : null)}
          </div>
        )
      })}
    </div>
  }
}