/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import Database from 'stores/Database';
import Immutable from 'immutable';

describe('Database', () => {

  let db;  

  beforeEach(() => {
    db =  new Database();
  });

  it('should start with an empty database', () => {
    expect(db).to.be.ok; 
    expect(db.entries.size).to.eql(0);
    expect(db.resources.size).to.eql(0);
    expect(db.indices.size).to.eql(0);
  });

  it('should add a root entry', () => {
    db = db.addEntry('');
    
    expect(db.entries.size).to.eql(1);
    expect(db.entries.has('')).to.be.true;
  })

  it('should add parent entries', () => { 
    db = db.addEntry('a/b');    
    db = db.addEntry('a/c');
    
    expect(db.entries.size).to.eql(4);
    expect(db.entries.has('')).to.be.true
    expect(db.entries.has('a')).to.be.true
    expect(db.entries.has('a/c')).to.be.true
    expect(db.entries.has('a/b')).to.be.true
  })

  it('should set child entries of parent', () => {
    db = db.addEntry('a/b');
    db = db.addEntry('a/c');
    
    let children = db.entries.get('a').childIds;
    expect(children.size).to.eql(2);
    expect(children.has('a/b')).to.be.true
    expect(children.has('a/c')).to.be.true
  })

  it('should remove children and child entries of parent (but not remove parent', () => {
    db = db.addEntry('a/b');
    db = db.addEntry('a/c/d');
    db = db.removeEntry('a/c');

    expect(db.entries.has('a/c')).to.be.false;
    expect(db.entries.has('a/c/d')).to.be.false;
    let children = db.entries.get('a').childIds;
    expect(children.size).to.eql(1);
    expect(children.has('a/c')).to.be.false
    expect(children.has('a/b')).to.be.true
  })

  it('should create empty resources and indices for new entries and their parents', () => {
    db = db.addEntry('a/b');
    expect(db.resources.has('a/b')).to.be.true;
    expect(db.indices.has('a/b')).to.be.true;
  })

  it('should set the root entry correctly', () => {
    db = db.addEntry('a/b');
    expect(db.root).to.equal('');
  })

  it('should not overwrite existing parent resources or indices', () => {
    db = db.addEntry('a/b');
    db = db.addResource('a', 'a/test.jpg')
    db = db.setTitle('a', 'a title');

    db = db.addEntry('a/c');

    expect(db.indices.get('a').title).to.equal('a title');
    expect(db.resources.get('a').paths.has('a/test.jpg')).to.be.true;
  })

  it('should add resources to the appropriate entry', () => {
    db = db.addEntry('a/b');
    db = db.addResource('a/b', 'a/b/test.jpg');
    expect(db.resources.get('a/b').paths.has('a/b/test.jpg')).to.be.true;
    expect(db.resources.get('a/b').paths.size).to.equal(1);
  })

  it('should delete resources and index when entry is deleted', () => {
    db = db.addEntry('a/b');
    db = db.addResource('a/b', 'a/b/test.jpg');
    db = db.removeEntry('a/b');

    expect(db.resources.has('a/b')).to.be.false;
    expect(db.indices.has('a/b')).to.be.false;
  })

  it('should delete resources and index when parent entry is deleted', () => {
    db = db.addEntry('a/b');
    db = db.addResource('a/b', 'a/b/test.jpg');
    db = db.removeEntry('a');

    expect(db.resources.has('a/b')).to.be.false;
    expect(db.indices.has('a/b')).to.be.false;
  })

  it('should delete resources when requested', () => {
    db = db.addEntry('a/b');
    db = db.addResource('a', 'a/b/test.jpg');
    db = db.removeResource('a', 'a/b/test.jpg');

    expect(db.resources.get('a').paths.size).to.equal(0);
  });

  it('should allow setting index information', () => {
    db = db.addEntry('a/b');
    db = db.setTitle('a/b', 'title a');
    db = db.setBody('a/b', 'body a');

    expect(db.indices.get('a/b').title).to.equal('title a');
    expect(db.indices.get('a/b').body).to.equal('body a');
  })

  it('should allow setting new attributes', () => {
    db = db.addEntry('a/b');
    db = db.setAttribute('a/b', 'thekey', [1,2,"3"]);

    let values = db.indices.get('a/b').attributes.get('thekey').values;
    expect(values.size).to.equal(3); 
    expect(values.has(1)).to.be.true;
    expect(values.has(2)).to.be.true;
    expect(values.has("3")).to.be.true;
  })

  it('should allow removing attributes', () => {
    db = db.addEntry('a/b');
    db = db.setAttribute('a/b', 'thekey', [1,2,"3"]);
    db = db.removeAttribute('a/b', 'thekey');

    expect(db.indices.get('a/b').attributes.has('thekey')).to.be.false;
  })

  it('should get all entries that have a particular value for an attribute', () => {
    db = db.addEntry('a/b').addEntry('c/d').addEntry('e/f').addEntry('g/h');

    db = db.setAttribute('a/b', 'thekey', [1,2,3])
          .setAttribute('c/d', 'thekey', [4,5,6])
          .setAttribute('e/f', 'thekey', [7,1,8])
          .setAttribute('g/h', 'theotherkey', [1,2,3]);

    let entries = db.getEntriesForAttibute('thekey', 1);
    expect(entries.equals(Immutable.Set(['a/b', 'e/f']))).to.be.true;
  })

  it('should get all values for an attribute', () => {
    db = db.addEntry('a/b');
    db = db.setAttribute('a/b', 'thekey', [1,2,"3"]);

    let values=db.getAttribute('a/b', 'thekey');
    expect(values.equals(Immutable.Set([1,2,'3']))).to.be.true;
  })

  it('should get all resources for an entry', () => {
    db = db.addEntry('a/b');
    db = db.addResource('a/b', 'a/b/item1.pdf');
    db = db.addResource('a/b', 'a/b/item2.pdf');
    db = db.addResource('a/b', 'a/b/item3.pdf');

    let paths = db.getResources('a/b');
    expect(paths.equals(Immutable.Set(['a/b/item1.pdf', 'a/b/item2.pdf', 'a/b/item3.pdf']))).to.be.true;
  })

  it('should get a title and a body for an entry', () => {
    db = db.addEntry('a/b')
          .setTitle('a/b', "Bee Lore")
          .setBody('a/b','Blah blah blah...');

    expect(db.getTitle('a/b')).to.equal("Bee Lore");
    expect(db.getBody('a/b')).to.equal('Blah blah blah...');
  })

  it('should generate a title for an entry that has not had one set', () => {
    db = db.addEntry('a/bob-carson');
    db = db.addEntry('b/dan savage');
    db = db.addEntry('c/wondering - wandering');
    
    expect(db.getTitle('a/bob-carson')).to.equal('Bob Carson');
    expect(db.getTitle('b/dan savage')).to.equal('Dan Savage');
    expect(db.getTitle('c/wondering - wandering')).to.equal('Wondering - Wandering');

  })

  //get all children for an entry

});
