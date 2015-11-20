import superagent from 'superagent';

import ResourceDataActions from 'actions/ResourceDataActions';

//!!! The connection of actions to specific resources is not quite right
//how do we get that information about the resource in question to the loading, success and error actions?

const ResourceDataSource = {
  fetchResource: {
    remote(state, resource) {
      //load the resource from the remote source
      //returns a promise
      //when the promise resolves, it will be passed to the success action 
      
//      console.log("ResourceDataSource fetchResource", resource);
      return new Promise((resolve, reject) => {
        superagent
          .get("/static/"+resource.path)
          .set('Accept', 'text/xmarkdown')
          .end( (err, res)  => {
            if (err) 
              reject([resource, err]);

//            console.log("ResourceDataSource fetchResource success", res.text)
            resolve([resource, res.text]);
          });
      });
    },

    local(state, path) {
      return state.resources.get(path);
    },

    //shouldFetch(state) {
    //  return true;
    //},
    loading: ResourceDataActions.loadResource,
    success: ResourceDataActions.loadResourceSuccess,
    error: ResourceDataActions.loadResourceFailure,
  }
};

export default ResourceDataSource;

