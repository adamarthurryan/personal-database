/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

//import alt from 'components/Dispatcher';
import * as DB from 'stores/Database';
//import AltTestingUtils from 'alt/utils/AltTestingUtils';

describe('Database', () => {

  let db; 

  beforeEach(() => {
    db = DB.newDatabase();
  });

  it('should start with an empty database', () => {
    expect(db).to.be.ok; 
    expect(db.entries.size).to.eql(0);
    expect(db.resources.size).to.eql(0);
    expect(db.indices.size).to.eql(0);
  });

  it('should add a root entry', () => {
    db = DB.addEntry(db, '');
    
    expect(db.entries.size).to.eql(1);
    expect(db.entries.has('')).to.be.true;
  })

  it('should add parent entries', () => {
    db = DB.addEntry(db, 'a/b');    
    db = DB.addEntry(db, 'a/c');
    
    expect(db.entries.size).to.eql(4);
    expect(db.entries.has('')).to.be.true
    expect(db.entries.has('a')).to.be.true
    expect(db.entries.has('a/c')).to.be.true
    expect(db.entries.has('a/b')).to.be.true
  })

  it('should set child entries of parent', () => {
    db = DB.addEntry(db, 'a/b');
    db = DB.addEntry(db, 'a/c');
    
    let children = db.entries.get('a').childIds;
    expect(children.size).to.eql(2);
    expect(children.has('a/b')).to.be.true
    expect(children.has('a/c')).to.be.true
  })

  it('should remove children and child entries of parent (but not remove parent', () => {
    db = DB.addEntry(db, 'a/b');
    db = DB.addEntry(db, 'a/c/d');
    db = DB.removeEntry(db, 'a/c');

    expect(db.entries.has('a/c')).to.be.false;
    expect(db.entries.has('a/c/d')).to.be.false;
    let children = db.entries.get('a').childIds;
    expect(children.size).to.eql(1);
    expect(children.has('a/c')).to.be.false
    expect(children.has('a/b')).to.be.true
  })

  it('should create empty resources and indices for new entries and their parents', () => {
    db = DB.addEntry(db, 'a/b');
    expect(db.resources.has('a/b')).to.be.true;
    expect(db.indices.has('a/b')).to.be.true;
  })

  it('should set the root entry correctly', () => {
    db = DB.addEntry(db, 'a/b');
    expect(db.root).to.equal('');
  })

  it('should not overwrite existing parent resources or indices', () => {
    db = DB.addEntry(db, 'a/b');
    db = DB.addResource(db, 'a', 'a/test.jpg')
    db = DB.setTitle(db, 'a', 'a title');

    db = DB.addEntry(db, 'a/c');

    expect(db.indices.get('a').title).to.equal('a title');
    expect(db.resources.get('a').paths.has('a/test.jpg')).to.be.true;
  })

  it('should add resources to the appropriate entry', () => {
    db = DB.addEntry(db, 'a/b');
    db = DB.addResource(db, 'a/b', 'a/b/test.jpg');
    expect(db.resources.get('a/b').paths.has('a/b/test.jpg')).to.be.true;
    expect(db.resources.get('a/b').paths.size).to.equal(1);
  })

  it('should delete resources and index when entry is deleted', () => {
    db = DB.addEntry(db, 'a/b');
    db = DB.addResource(db, 'a/b', 'a/b/test.jpg');
    db = DB.removeEntry(db, 'a/b');

    expect(db.resources.has('a/b')).to.be.false;
    expect(db.indices.has('a/b')).to.be.false;
  })

  it('should delete resources and index when parent entry is deleted', () => {
    db = DB.addEntry(db, 'a/b');
    db = DB.addResource(db, 'a/b', 'a/b/test.jpg');
    db = DB.removeEntry(db, 'a');

    expect(db.resources.has('a/b')).to.be.false;
    expect(db.indices.has('a/b')).to.be.false;
  })

  it('should delete resources when requested', () => {
    db = DB.addEntry(db, 'a/b');
    db = DB.addResource(db, 'a', 'a/b/test.jpg');
    db = DB.removeResource(db, 'a', 'a/b/test.jpg');

    expect(db.resources.get('a').paths.size).to.equal(0);
  });

  it('should allow setting index information', () => {
    db = DB.addEntry(db, 'a/b');
    db = DB.setTitle(db, 'a/b', 'title a');
    db = DB.setBody(db, 'a/b', 'body a');

    expect(db.indices.get('a/b').title).to.equal('title a');
    expect(db.indices.get('a/b').body).to.equal('body a');
  })

  it('should allow setting new attributes', () => {
    db = DB.addEntry(db, 'a/b');
    db = DB.setAttribute(db, 'a/b', 'thekey', [1,2,"3"]);

    let values = db.indices.get('a/b').attributes.get('thekey').values;
    expect(values.size).to.equal(3); 
    expect(values.has(1)).to.be.true;
    expect(values.has(2)).to.be.true;
    expect(values.has("3")).to.be.true;
  })

  it('should allow removing attributes', () => {

  })

  it('should allow updating attributes', () => {

  })
  // Clean up localStorage before each try
  //beforeEach(() => {
  //  storeClass = AltTestingUtils.makeStoreTestable(alt, EntryStore);
  //});
});
