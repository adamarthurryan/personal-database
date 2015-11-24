import React from 'react';
import ReactDOM from 'react-dom';

import EntryActions from 'actions/EntryActions';
import Main  from 'components/Main';



EntryActions.fetchEntries();

// Render the main component into the dom
ReactDOM.render(
      <Main/>
, document.getElementById('app'));
