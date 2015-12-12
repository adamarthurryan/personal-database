import Immutable from 'immutable'

var ViewOptions = Immutable.Record({
  id: null,
  display: null,
  attributes: Immutable.Map()
});
export default ViewOptions


ViewOptions.DISPLAY_LIST = "list"
ViewOptions.DISPLAY_GRID = "grid"
ViewOptions.DISPLAY_OUTLINE = "outline"

var validDisplays = Immutable.Set([ViewOptions.DISPLAY_LIST, ViewOptions.DISPLAY_GRID, ViewOptions.DISPLAY_OUTLINE])

ViewOptions.isValidDisplay = function(display) {
  return display===null || validDisplays.has(display)
}