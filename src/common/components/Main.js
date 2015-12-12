//require ('../../../bower_components/skeleton/css/normalize.css')
//require ('../../../bower_components/skeleton/css/skeleton.css')

import React from 'react'
import { connect } from 'react-redux'
import * as PathTools from '../database/PathTools'
import * as TitleTools from '../database/TitleTools'
import { Link } from 'react-router' 

import ViewOptions from '../view/ViewOptions'
import * as ViewActions from '../redux/ViewActions'

import Entry from './Entry'
import EntryThumb from './EntryThumb'
import EntriesList from './EntriesList'
import EntriesGrid from './EntriesGrid'
import EntriesOutline from './EntriesOutline'

import DisplaySelector from './DisplaySelector'
import Breadcrumbs from './Breadcrumbs'
  
class Main extends React.Component {
  constructor() {
    super()
  }

  render () {
    // Injected by connect() call:
    const { dispatch, db, view } = this.props
     
    //lets figure out what the path is
    
    //decode location url
    let id = decodeURI(this.props.location.pathname)
    id = PathTools.normalize(id)

    console.log('Main path:', id)
    //console.log('Main children: ', db.getChildren(path))

    let displayMode = view.getDisplay(id)

    console.log('Display:', displayMode)

    let entry = db.getEntry(id)
    if (! entry.title)
      entry = entry.set('title', TitleTools.titleize(id))



    //sort the entries by title
    //we don't really need to do this subtree bit 
    // - the idea is that it just protects sub components from having to re-render if one part of the db changes
    // - does that even work?

    // !!! in order for this optimization to work, we need to implement something like PureRenderMixin for the components
    // !!! also the components would need to themselves use subtrees for their children
    let subtreeDb = db.getSubtree(id)
    let entriesView = null
    
    switch (displayMode) {
      case "grid":
        //!!! we should give the grid a whole subtree of children so that it can search deeper for thumbnail images
        entriesView = <EntriesGrid key="gridview" db={subtreeDb}  entryIds={entry.childIds} size="300x300"/>
        break

      case "outline":
        entriesView = <EntriesOutline key="outlineview" db={subtreeDb} entryIds={entry.childIds} depth={4}/>
        break

      case "list": default:
        entriesView = <EntriesList key="listview" db={subtreeDb}  entryIds={entry.childIds}/>
        break
    }

    return (
      <div className='container'>
        <Breadcrumbs path={id}/>
        <DisplaySelector entryId={id} currentDisplay={displayMode} onSelect={( display) => dispatch(ViewActions.updateDisplay(id, display)) }/>

        <div className="entry" key={id}>
          <h1>{entry.title}</h1>
          <Entry entry={entry}/>
          {entriesView}
        </div>
      </div>
    );
  }


}




// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
// If we could include the currently displayed entry in this (ie. location.pathname) 
// then we could restrict the db to only the relevant part of the database - a performance win
// if other parts of the database are changing.
function select(state) {
  return { db:state.database, view:state.view }
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