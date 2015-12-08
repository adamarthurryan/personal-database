//require ('../../../bower_components/skeleton/css/normalize.css')
//require ('../../../bower_components/skeleton/css/skeleton.css')

import React from 'react'
import { connect } from 'react-redux'
import * as PathTools from '../database/PathTools'
import { Link } from 'react-router' 

import Entry from './Entry'
import EntryThumb from './EntryThumb'

import MasonryGrid from './MasonryGrid'

import Breadcrumbs from './Breadcrumbs';

class Main extends React.Component {
  constructor() {
    super();
  }

  render () {
    // Injected by connect() call:
    const { dispatch, db } = this.props
    
    //lets figure out what the path is
    
    //decode location url
    let path = decodeURI(this.props.location.pathname)
    path = PathTools.normalize(path)

    console.log('Main path:', path)
    //console.log('Main children: ', db.getChildren(path))

    let entry = 
              <div className="entry" key={path}>
                <h1>{db.getTitle(path)}</h1>
                <Entry 
                  entry={path} 
                  resources={db.getResources(path)} 
                  body={db.getBody(path)} 
                />
              </div>
    
    let entries = db.getChildren(path).map( entryId => {
      return <div className='u-pull-left'><EntryThumb 
              entryId={entryId} 
              resources={db.getResources(entryId)}
              body={db.getBody(entryId)}
              title={db.getTitle(entryId)}
              size="300x300"
              /></div>
      //return <li key={entryId}><Link to={'/'+(entryId)}>{db.getTitle(entryId) }</Link></li> 
    });

    return (
      <div className='container'>
        <Breadcrumbs path={path}/>
        {entry}
        <div className="u-cf">
          {entries}
        </div>
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



//this pure render magic comes from https://gist.github.com/ryanflorence/a93fd88d93cbf42d4d24/17ebc319c649affb99907a7d4d8f5f6c4142596f 
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

var pureRender = (Component) => {
  Object.assign(Component.prototype, {
    shouldComponentUpdate (nextProps, nextState) {
      return !shallowEqual(this.props, nextProps) ||
             !shallowEqual(this.state, nextState);
    }
  });
};



pureRender(Main)

// Wrap the component to inject dispatch and state into it
export default connect(select)(Main)