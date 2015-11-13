import alt from 'components/Dispatcher';

import EntrySource  from '../sources/EntrySource'

class EntryActions {
  /*
  addEntry(path) {
    this.dispatch(path);
  }
  */
  addResource(path, filename) {
    this.dispatch([path, filename]);
  } 

  setIndex(path, index) {
    this.dispatch([path, index]);
  }

  setBody(path, body) {
    this.dispatch([path, body]);
  }

  updateEntries(entries) {
    this.dispatch(entries);
  }

  updateEntry(entry) {
    this.dispatch(entry);
  }


  fetchEntries() {
    // we dispatch an event here so we can have "loading" state.
    this.dispatch();
    EntrySource.fetch( (entry, err) => {
      if (err)
        this.actions.fetchEntriesFailed(err);

      this.actions.updateEntry(entry);
      console.log(entry);
    });
  }

  fetchEntriesFailed(errorMessage) {
    this.dispatch(errorMessage);
  }

}

export default alt.createActions(EntryActions);
