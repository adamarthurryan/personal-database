import React from 'react';

import ViewActions from '../../common/redux/ViewActions'
import ViewOptions from '../../common/view/ViewOptions'
import Immutable from 'immutable'

export default class DisplaySelector extends React.Component { 
  render() {

    const {currentDisplay, onSelect} = this.props

    const buttons = Object.keys(displayCodes).map((code) => 
      <button key={code} className={(displayCodes[code]==currentDisplay)?"selected":null} onClick={e=>{onSelect(displayCodes[code])}}>{code}</button>
    )

    return <div>
      {buttons}
    </div>
  }

  handleClick(ev, display) {

  }
}



const displayCodes = {
  'L':ViewOptions.DISPLAY_LIST,
  'G':ViewOptions.DISPLAY_GRID,
  'O':ViewOptions.DISPLAY_OUTLINE
}