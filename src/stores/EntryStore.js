import alt from 'components/Dispatcher';
import EntryActions from '../actions/EntryActions';

class EntryStore {

  constructor() {

    this.entries = {};

    this.bindListeners({
      /*handleAddEntry: EntryActions.ADD_ENTRY,*/
      handleAddResource: EntryActions.ADD_RESOURCE,
      handleSetIndex: EntryActions.SET_INDEX,
      handleSetBody: EntryActions.SET_BODY,
      handleFetchEntries: EntryActions.FETCH_ENTRIES,
      handleUpdateEntries: EntryActions.UPDATE_ENTRIES,
      handleUpdateEntry: EntryActions.UPDATE_ENTRY,
      handleFetchEntriesFailed: EntryActions.FETCH_ENTRIES_FAILED
    });
  }

  /* Resets the entries on fetch. */
  handleFetchEntries() {
    this.entries = {};
    this.error = false;
    this.errorMessage = null;
  }

  /* Bulk update of all entries. */
  handleUpdateEntries(entries) {
    this.entries = entries;
  }

  /* Replace the existing entry with the given entry. */
  handleUpdateEntry(entry) {
    this.entries[entry.path] = entry;
  }

  handleFetchEntriesFailed(message) {
    this.error = true;
    this.errorMessage = message;
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
  handleAddResource(params) {
    [path, resource] = params;
    entry = this.entries[path];
    entry.addResource(resource);
  }


  /* Sets the index for the given entry in the store.
     It is assumed that:
        - the entry exists*/
  handleSetIndex(params) {
    [path, index] = params;
    entry = this.entries[path];
    entry.setIndex(index);
  }

  /* Sets the body for the given entry in the store.
     It is assumed that:
        - the entry exists*/
  handleSetBody(params) {
    [path, body] = params;
    entry = this.entries[path];
    entry.setBody(body);
  }
}

class Resource {
  constructor(path, filename) {
    this.path=path;
    this.filename=filename;
  }
}







class Entry {
  constructor(path) {
    this.path = path;
    this.resources = [];
    this.index = null;
    this.body = null;
  }

  

  addResource(resource) {
    this.resources.append(resource);
  }

  setIndex(index) {
    this.index = index;
  }

  setBody(body) {
    this.body = body;
  }
}

module.exports = alt.createStore(EntryStore, 'EntryStore');
