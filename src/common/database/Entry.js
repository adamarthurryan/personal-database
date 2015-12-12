import Immutable from 'immutable'

var Entry = Immutable.Record({
  id: null,
  childIds: Immutable.Set(),
  parentId: null,
  resourcePaths: Immutable.Set(),
  title: null,
  body: null,
  attributes: Immutable.Map()
});

export default Entry