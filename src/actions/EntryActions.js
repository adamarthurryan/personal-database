import alt from 'components/Dispatcher';

import EntrySource  from '../sources/EntrySource'

class EntryActions {
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

  updateEntries(entries) {
    this.dispatch(entries);
  }


  fetchEntries() {
    // we dispatch an event here so we can have "loading" state.
    this.dispatch();
    EntrySource.fetch()
      .then((entries) => {
        // we can access other actions within our action through `this.actions`
        this.actions.updateEntries(entries);
      })
      .catch((errorMessage) => {
        this.actions.fetchEntriesFailed(errorMessage);
      });
  }

  fetchEntriesFailed(errorMessage) {
    this.dispatch(errorMessage);
  }

}

export default alt.createActions(EntryActions);
