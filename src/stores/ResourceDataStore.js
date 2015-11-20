import alt from 'components/Dispatcher';
import ResourceDataActions from 'actions/ResourceDataActions';
import ResourceDataSource from 'sources/ResourceDataSource';
import ResourceData from 'stores/ResourceData';

class ResourceDataStore {

  constructor() {
    this.resources = new Map();

    this.bindListeners({
      handleLoadSuccess: ResourceDataActions.LOAD_RESOURCE_SUCCESS,
      handleLoad: ResourceDataActions.LOAD_RESOURCE,
      handleLoadFailure: ResourceDataActions.LOAD_RESOURCE_FAILURE,
    });  

    this.registerAsync(ResourceDataSource);

  }

  //this doesn't seem to actually pass any resource
  // cf. https://github.com/goatslacker/alt/blob/master/src/store/StoreMixin.js
  handleLoad(resource) {
//    this.state.set(resource.path, new ResourceData(resource));
  }

  handleLoadSuccess(args) {
    let [resource, data] = args;
    this.resources.set(resource.path, new ResourceData(resource).loaded(data));
  }

  handleLoadFailure(args) {
    let [resource, error] = args;
    this.resources.set(resource.path, new ResourceData(resource).failed(error));
  }
}

export default alt.createStore(ResourceDataStore, 'ResourceDataStore');
