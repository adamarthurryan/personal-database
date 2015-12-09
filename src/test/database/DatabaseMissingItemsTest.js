/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';


import Database from 'common/database/Database'
import Immutable from 'immutable'
import * as PathTools from 'common/database/PathTools'

import chaiImmutable from 'chai-immutable'
chai.use(chaiImmutable)
let expect = chai.expect //is this necessary?

describe('Database when querying missing items', () => {
  let db;  

  beforeEach(() => {
    db =  new Database();
  });

  it('should return null for a missing attibute', ()=>{
    db.addEntry('a/b')

    expect(db.getAttribute('a/b', 'nokey')).to.be.undefined
  })

  it('should return an empty set for no attributes', ()=>{
    db.addEntry('a/b')

    expect(db.getAttributeKeys('a/b')).to.equal(Immutable.OrderedSet([]))
  })
})