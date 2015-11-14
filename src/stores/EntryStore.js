import alt from 'components/Dispatcher';
import EntryActions from '../actions/EntryActions';
import Entry from './Entry';
import Entries from './Entries';

class EntryStore {

  constructor() {

    this.entries = new Entries();

    this.bindListeners({
      handleUpdateEntry: EntryActions.UPDATE_ENTRY,
      
      handleFetchEntries: EntryActions.FETCH_ENTRIES,
      handleFetchEntriesFailed: EntryActions.FETCH_ENTRIES_FAILED,
      handleFetchEntriesDone: EntryActions.FETCH_ENTRIES_DONE,

      /*
      handleAddEntry: EntryActions.UPDATE_ENTRY,
      handleAddResource: EntryActions.ADD_RESOURCE,
      handleSetIndex: EntryActions.SET_INDEX,
      handleSetBody: EntryActions.SET_BODY,
      handleUpdateEntries: EntryActions.UPDATE_ENTRIES,
      */

    });
  }

  /* Resets the entries on fetch. */
  handleFetchEntries() {
    this.entries = new Entries();
    this.loading = true;
    this.errors = false;
    this.errorMessages = [];
  }


  /* Sets the error message when fetching fails.*/
  handleFetchEntriesFailed(message) {
    this.errors = true;
    this.errorMessages.push(message);
  }
  /* Sets the error message when fetching fails.*/
  handleFetchEntriesDone(message) {
    this.loading = false;
  }


  /* Replace the existing entry with the given entry. */
  handleUpdateEntry(entry) {
    this.entries.set(entry.path, entry);
  }



  /* Adds the given entry to the store.
     Existing records at the path will be replaced with a new empty instance.*/
  /*
  handleAddEntry(path) {
    this.entries[path] = new Entry(path);
  }
  */

  /* Adds the given resource to the store.
     It is assumed that:
        - the entry exists
        - no existing resource with that name has been added.*/
/*  handleAddResource(params) {
    [path, resource] = params;
    entry = this.entries[path];
    entry.addResource(resource);
  }
*/

  /* Sets the index for the given entry in the store.
     It is assumed that:
        - the entry exists*/
/*  handleSetIndex(params) {
    [path, index] = params;
    entry = this.entries[path];
    entry.setIndex(index);
  }
*/
  /* Sets the body for the given entry in the store.
     It is assumed that:
        - the entry exists*/
/*  handleSetBody(params) {
    [path, body] = params;
    entry = this.entries[path];
    entry.setBody(body);
  }
*/
}
/*
class Resource {
  constructor(path, filename) {
    this.path=path;
    this.filename=filename;
  }
}
*/

module.exports = alt.createStore(EntryStore, 'EntryStore');
