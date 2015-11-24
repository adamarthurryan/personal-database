require('normalize.css');
require('styles/Main.css');

import EntryStore from '../stores/EntryStore';
import React from 'react';
import Entries  from './Entries';
import Entry  from './Entry';
import AltContainer from 'alt-container';
import {Locations, Location} from 'react-router-component';

let yeomanImage = require('../images/yeoman.png');



var RootEntryContainer = <AltContainer store={EntryStore}>
    <Entry path="" />
  </AltContainer> 

class EntryContainer extends React.Component {
  render() {
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
        

        <div className="content">
          <Locations >
            <Location path="/" handler={RootEntryContainer} />
            <Location path="/*" handler={EntryContainer}/>
          </Locations>
        </div>  
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
