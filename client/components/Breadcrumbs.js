import React from 'react';
import Entries  from './Entries';

import {Link} from 'react-router-component';

export default class Breadcrumbs extends React.Component { 
  render() {

    if (! this.props.entry)
      //should have a better loading display
      return <p>Loading</p> 

    if (this.props.entry.path =="")
      return null;

    var parts = this.props.entry.path.split('/');

    parts.pop();

    var partComps = parts.map((pathPart, index) => {
      var path = parts.slice(0, index+1).join('/');
      return <Link key={index+1} href={"/"+path}>{pathPart}</Link>
    } );

    partComps.unshift(<Link key={0} href={"/"}>home</Link>)

    for (var i=partComps.length-2;i>=0;i--) {
      partComps.splice(i+1, 0, <span key={'s'+i}>&nbsp;/&nbsp;</span>);
    }

    return <i className="breadcrumbs">{partComps}</i>

  }
}
