import Immutable from 'immutable'

var Attribute = Immutable.Record({
  key: null, 
  values: Immutable.Set() //of strings
})

export default Attribute