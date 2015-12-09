import Immutable from 'immutable'

var Index = Immutable.Record({
  id: null,
  title: null,
  body: null,
  attributes: Immutable.OrderedMap() //of value Sets
})

export default Index