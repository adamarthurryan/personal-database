import alt from 'components/Dispatcher';

import EntrySource  from 'sources/EntrySource'

class EntryActions {

/*  
  addEntry(path) {
    this.dispatch(path);
  }
  
  addResource(path, filename) {
    this.dispatch([path, filename]);
  } 

  setIndex(path, index) {
    this.dispatch([path, index]);
  }

  setBody(path, body) {
    this.dispatch([path, body]);
  }
*/
 
  updateEntry(entry) {
    this.dispatch(entry);
  }


  fetchEntries() {
    // we dispatch an event here so we can have "loading" state.
    this.dispatch();
    EntrySource.fetch(this.actions);
  }

  fetchEntriesFailed(errorMessage) {
    this.dispatch(errorMessage);
  }

  //called when all the entries have been fetched (regardless of error state)
  fetchEntriesDone() {
    this.dispatch();
  }

}

export default alt.createActions(EntryActions);
