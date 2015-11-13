var mockData = {
  'entry/1': {
    'path': 'entry/1',
    'resources' : ['image1.jpg', 'image2.jpg', 'image3.jpg']
  },

  'entry/1/hello': {
    'path': 'entry/1/hello',
    'resources' : ['document.pdf']
  },

  'entry-2': {
    'path': 'entry-2',
    'resources' : ['imageA.jpg', 'imageB.jpg', 'imageC.jpg']
  }
  
}


var MockEntrySource = {
  fetch: function() {
    return new Promise(function(resolve, reject) {
      setTimeout( () => resolve(mockData), 250);

    });
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

export default MockEntrySource;