import superagent from 'superagent';

export var EntrySource = {
  fetch: function(callback) {
    load('.','', callback);
  },
  remoteAction: {
    remote(state) {},
    local(state) {
      return null;
    },
    shouldFetch(state) {
      return true;
    },
    loading() {},
    success() {},
    error() {}
  }
};

export default EntrySource;

function load (parent, path, callback) {
  console.log("load("+(path?parent+"/"+path:parent)+")");

  superagent
      .get("/static/"+(path?parent+"/"+path:parent))
      .set('Accept', 'application/json')
      .end( (err, res)  => {
        if (err) 
          callback(null, err);

        var dirs = res.body.filter(item => item.stat.isDirectory);
        dirs.forEach(dir => load((path?parent+"/"+path:parent), dir.name, callback));

        var files =  res.body.filter(item => item.stat.isFile);
        var filenames = files.map(file => file.name);
        
        var entry = {path: (path?parent+"/"+path:parentpath?parent+"/"+path:parent), resources: filenames};
        callback(entry);
  });
}