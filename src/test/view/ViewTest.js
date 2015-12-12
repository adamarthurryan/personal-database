/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';


import View from 'common/view/View'
import Immutable from 'immutable'
import ViewOptions from 'common/view/ViewOptions'
import * as PathTools from 'common/database/PathTools'

import chaiImmutable from 'chai-immutable'
chai.use(chaiImmutable)
let expect = chai.expect //is this necessary?


describe('View', () => {

  let view=null;  

  beforeEach(() => {
    view =  new View()
  })

  it('should have a global default display of null', () => {
    expect(view.getDisplay('a/b')).to.be.null
  })

  it('should set and get display mode for an entry', () => {
    view = view.setDisplay('a/b', ViewOptions.DISPLAY_GRID)

    expect(view.getDisplay('a/b')).to.equal(ViewOptions.DISPLAY_GRID)
  })

  it('should set and get display mode for child entries', () => {
    view = view.setDisplay('a/b', ViewOptions.DISPLAY_GRID)

    expect(view.getDisplay('a/b/c')).to.equal(ViewOptions.DISPLAY_GRID)
    expect(view.getDisplay('a/b/d')).to.equal(ViewOptions.DISPLAY_GRID)
    expect(view.getDisplay('a/b/c/d')).to.equal(ViewOptions.DISPLAY_GRID)
  })

  it('have default of null for attributes',  () => {
    expect(view.getAttribute('a/b', 'thekey')).to.be.null
  })

  it('should set and get attributes for an entry',  () => {
    view = view.setAttribute('a/b', 'thekey', 'thevalue')
    view = view.setAttribute('a/b', 'theotherkey', 'theothervalue')

    expect(view.getAttribute('a/b', 'thekey')).to.equal('thevalue')
  })

  it('should set and get attributes for child entries',  () => {
    view = view.setAttribute('a/b', 'thekey', 'thevalue')
    view = view.setAttribute('a/b', 'theotherkey', 'theothervalue')

    expect(view.getAttribute('a/b/c', 'thekey')).to.equal('thevalue')
    expect(view.getAttribute('a/b/d/e/f/g', 'theotherkey')).to.equal('theothervalue')
  })

  it('should get attribute keys for an entry', () => {
    view = view.setAttribute('a/b','thekey',[1])
    view = view.setAttribute('a/b','anotherkey', [2])

    expect(view.getAttributeKeys('a/b')).to.be.equal(Immutable.Set(['thekey', 'anotherkey']))
  });


  it('should set multiple attributes', () => {
    view = view.setAttributes('a/b', {'alpha':1, 'beta':2, 'gamma':3})

    expect(view.getAttributeKeys('a/b')).to.be.equal(Immutable.Set(['alpha', 'beta', 'gamma']))
    expect(view.getAttribute('a/b', 'alpha')).to.be.equal(1)
    expect(view.getAttribute('a/b', 'gamma')).to.be.equal(3)
  })
})