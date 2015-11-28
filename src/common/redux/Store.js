import { createStore } from 'redux';
import databaseReducer from './databaseReducer';

let Store = createStore(databaseReducer);

export default Store;