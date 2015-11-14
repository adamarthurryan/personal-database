import superagent from 'superagent';
import Entry from '../stores/Entry';

export var EntrySource = {
  fetch: function(callback, callbackAllDone) {
    load(new Counter(), '', callback, callbackAllDone);
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

class Counter {
  constructor() {
    this.count = 0;
  }
}

function load (counter, path, callback, callbackAllDone) {

  counter.count = counter.count+1;

  superagent
      .get("/static/"+path)
      .set('Accept', 'application/json')
      .end( (err, res)  => {
        if (err) 
          callback(null, err);


        var dirs = res.body.filter(item => item.stat.isDirectory);
        dirs.forEach(dir => load(counter, path+"/"+ dir.name, callback));

        var files =  res.body.filter(item => item.stat.isFile);

        var filenames = files.map(file => file.name);

        var entry = new Entry(path);
        entry.resources = filenames;

        if (callback)
          callback(entry);

        counter.count = counter.count-1;
        if (counter.count == 0 && callbackAllDone)
          callbackAllDone();


  });
}