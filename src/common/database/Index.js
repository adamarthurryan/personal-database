import Immutable from 'immutable'

var Index = Immutable.Record({
  entryId: null,
  title: null,
  body: null,
  attributes: Immutable.Map() //of value Sets
})

export default Index