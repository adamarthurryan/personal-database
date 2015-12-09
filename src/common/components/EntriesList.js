import React from 'react'
//import Link from 'react-router'

export default class EntriesList extends React.Component {

  render () {
    const {entries} = this.props
    return <ul>
      {entries.map( entry => {
        return <li key={entry.id}><a href={'/'+(entry.id)}>{entry.title }</a></li> 
      })}
    </ul>
  }
}