//require ('../../../bower_components/skeleton/css/normalize.css')
//require ('../../../bower_components/skeleton/css/skeleton.css')

import React from 'react'
import { connect } from 'react-redux'
import * as PathTools from '../database/PathTools'
import * as TitleTools from '../database/TitleTools'
import { Link } from 'react-router' 

import Entry from './Entry'
import EntryThumb from './EntryThumb'
import EntriesList from './EntriesList'
import EntriesGrid from './EntriesGrid'
import EntriesOutline from './EntriesOutline'

import Breadcrumbs from './Breadcrumbs';
  
class Main extends React.Component {
  constructor() {
    super()
  }

  render () {
    // Injected by connect() call:
    const { dispatch, db } = this.props
     
    //lets figure out what the path is
    
    //decode location url
    let id = decodeURI(this.props.location.pathname)
    id = PathTools.normalize(id)

    console.log('Main path:', id)
    //console.log('Main children: ', db.getChildren(path))

    let displayValues = db.getAttribute(id, "display")
    let displayMode = displayValues? displayValues.first(): null;

    let entry = db.getEntry(id)
    if (! entry.title)
      entry = entry.set('title', TitleTools.titleize(id))



    //sort the entries by title

    let entriesView = null
    let entries = null

    switch (displayMode) {
      case "grid":
        entries = collectChildren(db, id, 1)
        entries = db.getChildren(id).map(id => db.getEntry(id))
        entries = entries.map(entry => (entry.title? entry: entry.set('title', TitleTools.titleize(entry.id))))
        entriesView = <EntriesGrid key="gridview" entries={entries} size="300x300"/>
        break

      case "outline":
        entries = collectChildren(db, id, 4)
        entriesView = <EntriesOutline key="outlineview" entries={entries} parentId={id} depth={4}/>
        break

      case "list": default:
        entries = collectChildren(db, id, 1)
        entries = db.getChildren(id).map(id => db.getEntry(id))
        entries = entries.map(entry => (entry.title? entry: entry.set('title', TitleTools.titleize(entry.id))))
        entriesView = <EntriesList key="listview" entries={entries}/>
        break
    }

    return (
      <div className='container'>
        <Breadcrumbs path={id}/>

        <div className="entry" key={id}>
          <h1>{entry.title}</h1>
          <Entry entry={entry}/>
          {entriesView}
        </div>
      </div>
    );
  }
//        {entriesView}

}


// collect all the children for a specified id
// set their titles to a titleized version of the title if necesary
function collectChildren(db, id, depth) {
  if (depth < 1)
    return []

  let children = db.getChildren(id)

  let entries = children.reduce( (entries, childId) => {
    let child = db.getEntry(childId)
    child = child.title ? child : child.set('title', TitleTools.titleize(child.id))
    return entries.concat([child], collectChildren(db, childId, depth-1))
  }, [])

  return entries
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