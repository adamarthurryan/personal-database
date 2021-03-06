'use strict';

import * as MarkdownIndexParser from 'common/database/MarkdownIndexParser'

import Immutable from 'immutable'

import chaiImmutable from 'chai-immutable'
chai.use(chaiImmutable)
let expect = chai.expect //is this necessary?

describe ('MarkdownIndexParser', () => {

  it ('should extract titles', () => {
    let source = "  \n # Title \nbody\netc"
    let index = MarkdownIndexParser.parse(source)

    
    expect(index.title).to.equal("Title")
    expect(index.body).to.equal("body\netc")
  })
  it ('should extract titles without preceeding newline', () => {
    let source = "# Title \nbody\netc"
    let index = MarkdownIndexParser.parse(source)
   
    expect(index.title).to.equal("Title")
    expect(index.body).to.equal("body\netc")
  })

  it ('should not extract sub titles', () => {
    let source = "  \n ## Subtitle \nbody\netc"
    let index = MarkdownIndexParser.parse(source)

    expect(index.title).to.be.null
    expect(index.body).to.equal(source)
  })

  it ('should extract attribute blocks', () => {
    let source ='body\netc\n--- not an attribute block\n---\n\n - fire: walker\n+ wunder:kammer\n  *  stranger : danger'
    let index = MarkdownIndexParser.parse(source)

    expect(index.body).to.equal('body\netc\n--- not an attribute block')
    //expect(Immutable.Map({fire:['walker'], wunder:['kammer'], stranger:['danger']}).toArray()).to.equal(Immutable.Map({fire:['walker'], wunder:['kammer'], stranger:['danger']}).toArray())    
    expect(index.attributes).to.deep.equal(Immutable.Map({
      fire:Immutable.Set(['walker']), 
      wunder:Immutable.Set(['kammer']), 
      stranger:Immutable.Set(['danger'])
    }))    
    expect(index.attributes).to.have.all.keys('fire', 'wunder', 'stranger')
  })

  it ('should extract indexes containing only attribute blocks', () => {
    let source =' - fire: walker\n+ wunder:kammer\n  *  stranger : danger'
    let index = MarkdownIndexParser.parse(source)

    expect(index.body).to.be.null
    expect(index.title).to.be.null
    //expect(Immutable.Map({fire:['walker'], wunder:['kammer'], stranger:['danger']}).toArray()).to.equal(Immutable.Map({fire:['walker'], wunder:['kammer'], stranger:['danger']}).toArray())    
    expect(index.attributes).to.deep.equal(Immutable.Map({
      fire:Immutable.Set(['walker']), 
      wunder:Immutable.Set(['kammer']), 
      stranger:Immutable.Set(['danger'])
    }))    
    expect(index.attributes).to.have.all.keys('fire', 'wunder', 'stranger')
  })

});