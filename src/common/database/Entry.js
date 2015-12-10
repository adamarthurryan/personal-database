var Entry = Immutable.Record({
  id: null,
  childIds: Immutable.Set(),
  parentId: null,
  resourcePaths: Immutable.Set(),
  title: null,
  body: null,
  attributes: Immutable.Map()
});
