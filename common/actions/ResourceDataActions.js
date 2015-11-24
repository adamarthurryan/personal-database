import alt from 'components/Dispatcher';

class ResourceDataActions {
  loadResource(resource) {
    this.dispatch(resource);
  }
  //arguments are [resource, data]
  loadResourceSuccess(args) {
    this.dispatch(args);
  }
  //arguments are [resource, error]
  loadResourceFailure(args) {
    this.dispatch(args );
  }
}

export default alt.createActions(ResourceDataActions);
