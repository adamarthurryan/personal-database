import superagent from 'superagent';
import Entry from '../stores/Entry';
import Resource from '../stores/Resource';

/* 
!!! Refactor this to conform to the pattern defined at http://alt.js.org/docs/async/
  
  the fetch method becomes an instance of an object defining remote, loading, success and error methods
  
*/

export var EntrySource = {
  fetch: function(actions) {
    load(new Counter(), '', actions);
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

function load (counter, path, actions) {

  counter.count = counter.count+1;

  superagent
      .get("/static/"+path)
      .set('Accept', 'application/json')
      .end( (err, res)  => {
        if (err) 
          actions.fetchEntriesFailed(err);


        //create a new entry
        var entry = new Entry(path);

        //find all the resources and add them to the entry
        //resources are stored by complete path
        var resources =  res.body.filter(item => item.stat.isFile && ! item.name.toLowerCase().endsWith('.md'));
        var resourceObjs = resources.map(file => new Resource(path+'/'+file.name));
        entry.resources = resourceObjs;


        //find index files, if they exist, and add them to the entry
        var indexFile = res.body.find(item => item.stat.isFile && item.name.toLowerCase() == 'index.md');
        if (indexFile)
          entry.indexResource = new Resource(path+'/'+indexFile.name);

        //trigger the entry update action
        actions.updateEntry(entry);


        //find any morkdown files
        //these will each create their own entries
        var markdownFiles = res.body.filter(item => item.stat.isFile && item.name.toLowerCase().endsWith('.md') && item.name.toLowerCase() != 'index.md');
        markdownFiles.forEach(item => {
          //should we drop the extension? I think so
          var entry = new Entry(path+'/'+item.name.match(/(.*).md$/)[1]);
          entry.indexResource = new Resource(path+'/'+item.name);

          //this doesn't handle the edge case that the folder has both a markdown and directory entry with the same title
          actions.updateEntry(entry);
        })


        //make an entry for each child directory
        var dirs = res.body.filter(item => item.stat.isDirectory);
        dirs.forEach(dir => load(counter, path+"/"+ dir.name, actions));


        //decrement the count and check if all entries have been loaded
        counter.count = counter.count-1;
        if (counter.count == 0 )
          actions.fetchEntriesDone  ();

  });
}

