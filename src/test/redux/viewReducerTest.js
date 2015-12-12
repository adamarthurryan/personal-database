'use strict';

import * as Actions from 'common/redux/ViewActions'
import reducer from 'common/redux/ViewReducer'
import View from 'common/view/View'

import Immutable from 'immutable'

import chaiImmutable from'chai-immutable'
chai.use(chaiImmutable)
let expect = chai.expect //is this necessary?

let A = Actions

describe('viewReducer', () => { 


  beforeEach(() => {
  });

  it('should return the initial state', () => {
    let initial = reducer()
    expect(initial).to.be.an.instanceof(View)
    expect(initial.options).to.be.empty
  });

  it('update a display', () => { 
    let actions = [A.updateDisplay('a/b', 'grid')]
    let view = reduceAll(actions)
    expect(view.getDisplay('a/b')).to.equal('grid')
  });

  it('update an attribute', () => {
    let actions = [A.updateAttribute('a/b', 'thekey', 'thevalue')]
    let view = reduceAll(actions)
    expect(view.getAttribute('a/b', 'thekey')).to.equal('thevalue')
  });
  it('update a display', () => {
    let actions = [A.updateAttributes('a/b', {a:1, b:2})]
    let view = reduceAll(actions)
    expect(view.getAttribute('a/b', 'a')).to.equal(1)
    expect(view.getAttribute('a/b', 'b')).to.equal(2)
  });

});

function reduceAll(actions) {
  return actions.reduce(reducer, undefined);
}