import React from 'react'
import {Link} from 'react-router'

export default class EntriesList extends React.Component {

  render () {
    const {db, entryIds} = this.props
    return <ul>
      {entryIds.map( id => {
        return <li key={id}><Link to={'/'+(id)}>{db.getTitle(id) }</Link></li> 
      })}
    </ul>
  }
}