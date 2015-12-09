import React from 'react';

import {Link} from 'react-router';

import * as PathTools from '../database/PathTools'

export default class Breadcrumbs extends React.Component { 
  render() {

    if (PathTools.isRoot(this.props.path))
      return null;

    var parts = this.props.path.split('/');

    parts.pop();

    var partComps = parts.map((pathPart, index) => {
      var path = parts.slice(0, index+1).join('/');
      return <Link key={"link-"+(index+1)} to={"/"+path}>{pathPart}</Link>
    } );

    partComps.unshift(<Link key={0} to={"/"}>root</Link>)

    for (var i=partComps.length-2;i>=0;i--) {
      partComps.splice(i+1, 0, <span key={'s'+i}>&nbsp;/&nbsp;</span>);
    }

    return <i className="breadcrumbs">{partComps}</i>

  }
}
