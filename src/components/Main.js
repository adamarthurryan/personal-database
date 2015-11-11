require('normalize.css');
require('styles/App.css');

import EntryStore from '../stores/EntryStore';
import React from 'react';
import Entries  from './Entries';
import Entry  from './Entry';
import AltContainer from 'alt-container';
import {Locations, Location} from 'react-router-component';

let yeomanImage = require('../images/yeoman.png');



var EntriesContainer = <AltContainer store={EntryStore}>
    <Entries />
  </AltContainer> 

class EntryContainer extends React.Component {
  render() {
    console.log("Entry Container props:",this.props);
    return <AltContainer store={EntryStore}>
      <Entry path={this.props._[0]}/>
    </AltContainer> 
  }
}

class AppComponent extends React.Component {
  constructor() {
    super();
  }


  render () {

    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />

        <Locations >
          <Location path="/" handler={EntriesContainer} />
          <Location path="/*" handler={EntryContainer}/>
        </Locations>
            
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
