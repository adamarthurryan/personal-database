//require('normalize.css');
//require('styles/Main.css');

import React from 'react'
import { connect } from 'react-redux'

import {Locations, Location} from 'react-router-component'


class Main extends React.Component {
  constructor() {
    super();
  }

  render () {
    // Injected by connect() call:
    const { dispatch, db } = this.props

    let entries = db.entries.valueSeq().map( entry => <li key={entry.id}>{db.getTitle(entry.id) }</li> );

    return (
      <div className="index">
        <ul>
          {entries}
        </ul>
      </div>
    );
  }

}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return { db:state }
}

Main.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default connect(select)(Main)