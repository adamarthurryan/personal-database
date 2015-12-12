
import View from '../../common/view/View'
import * as Actions from './ViewActions'

export default function viewReducer(view = new View(), action = {type:"NONE"}) {
  switch(action.type) {
    case Actions.UPDATE_DISPLAY:
      return view.setDisplay (action.entryId, action.display)

    case Actions.UPDATE_ATTRIBUTE:
      return view.setAttribute(action.entryId, action.key, action.values)

    case Actions.UPDATE_ATTRIBUTES:
      return view.setAttributes(action.entryId, action.attributes)

    default:
      return view
  }
}