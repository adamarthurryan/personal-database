/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';


import Database from 'common/database/Database'
import Immutable from 'immutable'
import * as PathTools from 'common/database/PathTools'

//!!! This could be written more cleanly with chai-immutable

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
    db = db.addEntry(PathTools.ROOT);
    
    expect(db.entries.size).to.eql(1);
    expect(db.entries.has(PathTools.ROOT)).to.be.true;
  })

  it('should add parent entries', () => { 
    db = db.addEntry('a/b');    
    db = db.addEntry('a/c');
    
    expect(db.entries.size).to.eql(4);
    expect(db.entries.has(PathTools.ROOT)).to.be.true
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

  it('should not re-add an existing entry', () => {
    db = db
      .addEntry('a/b')
      .addResource('a', 'theresource')
      .addResource('a/b', 'theresource')
      .setTitle('a', 'thetitle')
      .setTitle('a/b', 'thetitle')

    let updateDb = db
        .addEntry('a')
        .addEntry('a/b')

    expect(updateDb).to.equal(db)
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

  it('should not overwrite existing parent resources or indices', () => {
    db = db.addEntry('a/b');
    db = db.addResource('a', 'a/test.jpg')
    db = db.setTitle('a', 'a title');

    db = db.addEntry('a/c');

    expect(db.indices.get('a').title).to.equal('a title');
    expect(db.resources.get('a').resourcePaths.has('a/test.jpg')).to.be.true;
  })

  it('should add resources to the appropriate entry', () => {
    db = db.addEntry('a/b');
    db = db.addResource('a/b', 'a/b/test.jpg');
    expect(db.resources.get('a/b').resourcePaths.has('a/b/test.jpg')).to.be.true;
    expect(db.resources.get('a/b').resourcePaths.size).to.equal(1);
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

    expect(db.resources.get('a').resourcePaths.size).to.equal(0);
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

    let values = db.indices.get('a/b').attributes.get('thekey');
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
    expect(entries).to.equal(Immutable.Set(['a/b', 'e/f']));
  })

  it('should get all values for an attribute', () => {
    db = db.addEntry('a/b');
    db = db.setAttribute('a/b', 'thekey', [1,2,"3"]);

    let values=db.getAttribute('a/b', 'thekey');
    expect(values).to.equal(Immutable.OrderedSet([1,2,'3']));
  })

  it('should get all resources for an entry', () => {
    db = db.addEntry('a/b');
    db = db.addResource('a/b', 'a/b/item1.pdf');
    db = db.addResource('a/b', 'a/b/item2.pdf');
    db = db.addResource('a/b', 'a/b/item3.pdf');

    let paths = db.getResources('a/b');
    expect(paths.equals(Immutable.OrderedSet(['a/b/item1.pdf', 'a/b/item2.pdf', 'a/b/item3.pdf']))).to.be.true;
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

  it('should get all children for an entry', () => {
    db = db.addEntry('a/b/c').addEntry('a/b/d').addEntry('a/b/e');

    expect(db.getChildren('a/b').equals(Immutable.OrderedSet(['a/b/c', 'a/b/d', 'a/b/e']))).to.be.true;
  });

  it('should get attribute keys for an entry', () => {
    db = db
      .addEntry('a/b')
      .setAttribute('a/b','thekey',[1])
      .setAttribute('a/b','anotherkey', [2])

    expect(db.getAttributeKeys('a/b').equals(Immutable.OrderedSet(['thekey', 'anotherkey']))).to.be.true
  });

  it('should revive properly after serialization', () => {
    db = db
      .addEntry('a/b')
      .addResource('a/b', 'theresource')
      .setAttribute('a/b', 'thekey', ['thevalue', 'anothervalue'])
      .setTitle('a/b', 'thetitle')

    let newdb = Database.fromJS(JSON.parse(JSON.stringify(db)))

    newdb = newdb.addEntry('a/c')
    newdb = newdb.addResource('a/c', 'theotherresource')
    newdb = newdb.setAttribute('a/c', 'theotherkey', ['theothervalue'])
    newdb = newdb.setAttribute('a/b', 'theotherkey', ['theothervalue'])

    expect(newdb.getChildren('a')).equals(Immutable.OrderedSet(['a/b', 'a/c']))
    expect(newdb.getResources('a/b')).equals(Immutable.OrderedSet(['theresource']))
    expect(newdb.getAttribute('a/b', 'thekey')).equals(Immutable.OrderedSet(['thevalue', 'anothervalue']))
    expect(newdb.getAttribute('a/b', 'theotherkey')).equals(Immutable.OrderedSet(['theothervalue']))
    expect(newdb.getTitle('a/b')).equals('thetitle')

    expect(newdb.getResources('a/c')).equals(Immutable.OrderedSet(['theotherresource']))
    expect(newdb.getAttribute('a/c', 'theotherkey')).equals(Immutable.OrderedSet(['theothervalue']))

    expect(newdb.entries.get('a').id).equals('a')
    expect(newdb.entries.get('a/b').id).equals('a/b')

  })

  it('should be invariant when updating with identical data', () => {
    db = db
      .addEntry('a/b').addEntry('a/c')
      .addResource('a/b', 'theresource')
      .setTitle('a/b', 'thetitle')
      .setAttribute('a/c', 'thekey', ['thevalue', 'anothervalue'])
      .setBody('a/b', 'blahblah')

    let db2 = db
      .addEntry('a/b').addEntry('a/c')
      .addResource('a/b', 'theresource')
      .setTitle('a/b', 'thetitle')
      .setBody('a/b', 'blahblah')
      .setAttribute('a/c', 'thekey', ['thevalue', 'anothervalue'])

    expect(db).to.equal(db2)
  })

  it('should return a complete entry object when requested', () => {
    db = db.addEntry('a/b')
      .addResource('a/b', 'theresource')
      .setTitle('a/b', 'thetitle')
      .setBody('a/b', 'thebody')
      .setAttribute('a/b', 'thekey', ['thevalue'])

    let entry = db.getEntry('a/b')
    expect(entry).to.include.keys(['id', 'title', 'body', 'attributes', 'resourcePaths', 'parentId', 'childIds'])
    expect(entry.isSuperset(Immutable.OrderedMap({id:'a/b', title:'thetitle', resourcePaths:Immutable.OrderedSet(['theresource']), parentId:'a', childIds:Immutable.OrderedSet([])}))).to.be.true
  })
});
