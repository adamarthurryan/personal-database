'use strict';

import * as Actions from 'common/redux/DatabaseActions'
import reducer from 'common/redux/databaseReducer'
import Database from 'common/database/Database'

import * as PathTools from 'common/database/PathTools'

import Immutable from 'immutable'

import chaiImmutable from'chai-immutable'
chai.use(chaiImmutable)
let expect = chai.expect //is this necessary?

let A = Actions

describe('databaseReducer', () => { 


  beforeEach(() => {
  });

  it('should return the initial state', () => {
    let initial = reducer()
    expect(initial).to.be.an.instanceof(Database)
    expect(initial.entries).to.be.empty
    expect(initial.resources).to.be.empty
    expect(initial.indices).to.be.empty
  });

  it('should add a new entry', () => {
    let actions = [A.addEntry('a/b'), A.addEntry('a/c')]
    let db = reduceAll(actions)
    expect(db.entries).to.have.all.keys(PathTools.ROOT, 'a', 'a/b', 'a/c')
  });

  it('should remove an entry', () => {
    let actions = [A.addEntry('a/b/d'), A.addEntry('a/b/c'), A.removeEntry('a/b')]
    let db = reduceAll(actions)
    expect(db.entries).to.have.all.keys(PathTools.ROOT, 'a')
  });

  it('should add a resource', () => {
    let actions = [A.addEntry('a/b/c'), A.addResource('a/b', 'a/b/test.jpg')]
    let db = reduceAll(actions)

    expect(db.getResources('a/b')).to.include('a/b/test.jpg')
  })
  it('should remove a resource', () => {
    let actions = [
      A.addEntry('a/b/c'), 
      A.addResource('a/b', 'a/b/test.jpg'), 
      A.addResource('a/b', 'a/b/test2.jpg'), 
      A.removeResource('a/b', 'a/b/test.jpg')]
    let db = reduceAll(actions)

    expect(db.getResources('a/b')).to.equal(Immutable.Set(['a/b/test2.jpg']))
  })

  it('should set the title and body', () => {
    let actions = [A.addEntry('a/b'), A.updateTitle('a/b', 'Buster'), A.updateBody('a/b', 'Blah blah blah')]
    let db = reduceAll(actions)

    expect(db.getTitle('a/b')).to.equal('Buster')
    expect(db.getBody('a/b')).to.equal('Blah blah blah')
  })

  it('should wipe the title and body', () => {
    let actions = [
      A.addEntry('a/b'), 
      A.updateTitle('a/b', 'Buster'), 
      A.updateBody('a/b', 'Blah blah blah'), 
      A.wipeIndex('a/b')
    ]
    let db = reduceAll(actions)

    expect(db.getTitle('a/b')).to.equal('B')
    expect(db.getBody('a/b')).to.be.null
  })

  it('should set attributes', () => {
    let actions = [
      A.addEntry('a/b'), 
      A.updateAttribute('a/b', 'thekey', [1,2,3]), 
      A.updateAttribute('a/b', 'anotherkey', ['one', 'two', 'three'])
    ]
    let db = reduceAll(actions)

    expect(db.getAttribute('a/b', 'thekey')).to.equal(Immutable.Set([1,2,3]))
  })

  it('should update attributes', () => {
    let actions = [
      A.addEntry('a/b'), 
      A.updateAttribute('a/b', 'thekey', [1,2,3]), 
      A.updateAttribute('a/b', 'anotherkey', ['one', 'two', 'three']),
      A.updateAttribute('a/b', 'thekey', ['a','b', 'c'])
    ]
    let db = reduceAll(actions)

    expect(db.getAttribute('a/b', 'thekey')).to.equal(Immutable.Set(['a', 'b', 'c']))
  })

  it('should wipe attributes', () => {
    let actions = [
      A.addEntry('a/b'), 
      A.updateAttribute('a/b', 'thekey', [1,2,3]), 
      A.updateAttribute('a/b', 'anotherkey', ['one', 'two', 'three']),
      A.updateAttribute('a/b', 'thekey', ['a','b', 'c']),
      A.wipeIndex('a/b')
    ]
    let db = reduceAll(actions)

    expect(db.getAttributeKeys('a/b')).to.be.empty
  })
});

function reduceAll(actions) {
  return actions.reduce(reducer, undefined);
}