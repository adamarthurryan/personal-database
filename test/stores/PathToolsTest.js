/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import * as PathTools from 'stores/PathTools';

describe('PathTools', () => {


  beforeEach(() => {
  });

  it('should normalize paths', () => {
    let f=PathTools.normalize;
    expect(f("a/b/c")).to.eql("a/b/c");
    expect(f("/a/b/c")).to.eql("a/b/c");
    expect(f("a/b/c/")).to.eql("a/b/c");
    expect(f("/a/b/c/")).to.eql("a/b/c");
    expect(f("/")).to.eql("");
    expect(f("/a")).to.eql("a")
    expect(f("/a/")).to.eql("a");
    expect(f("a//b//c")).to.eql("a/b/c")
    expect(f("a///////b//c")).to.eql("a/b/c")
  });

  it ('should identify root paths', () => {
    let f = PathTools.isRoot;
    expect(f('')).to.be.true;
    expect(f('a')).to.be.false;
    expect(f('a/bc')).to.be.false;
  });

  it ('should detect parent paths', () => {
    let f = PathTools.hasParent;
    expect(f('')).to.be.false;
    expect(f('a')).to.be.true;
    expect(f('b/c')).to.be.true;
  });

  it ('should get parent paths' , () => {
    let f = PathTools.getParent;
    expect(f('')).to.be.null;
    expect(f('aa')).to.eql('');
    expect(f('aa/bb')).to.eql('aa');
    expect(f('aa/bb/cc')).to.eql('aa/bb')
  });

  it ('should get name parts' , () => {
    let f = PathTools.getName;
    expect(f('')).to.eql('');
    expect(f('aa')).to.eql('aa');
    expect(f('aa/bb')).to.eql('bb');
    expect(f('aa/bb/cc')).to.eql('cc')
  });

  it ('should identify children', () => {
    let f = PathTools.isChildOf;
    expect(f('aa', '')).to.be.true;
    expect(f('aa/bb/cc', 'aa/bb')).to.be.true;
  });

  it ('should not confuse children and parents', () => {
    let f = PathTools.isChildOf;
    expect(f('', 'aa')).to.be.false;
    expect(f('', 'aa/bb')).to.be.false;
    expect(f('aa/bb', 'aa/bb/cc')).to.be.false;
  });

  it ('should not think non-child descendants are children', () => {
    let f = PathTools.isChildOf;
    expect(f('aa/bb', '')).to.be.false;
    expect(f('aa/bb/cc/dd', 'aa/bb')).to.be.false;
  });

  it ('should identify children as descendants', () => {
    let f = PathTools.isDescendantOf;
    expect(f('aa', '')).to.be.true;
    expect(f('aa/bb/cc', 'aa/bb')).to.be.true;    
  });

  it ('should not confuse anscestors and descendants', () => {
    let f = PathTools.isDescendantOf;
    expect(f('', 'aa')).to.be.false;
    expect(f('', 'aa/bb')).to.be.false;
    expect(f('aa/bb', 'aa/bb/cc')).to.be.false;
    expect(f('aa/bb', 'aa/bb/cc/dd')).to.be.false;
  });

  it ('should identify non-child descendants as descendants', () => {
    let f = PathTools.isDescendantOf;
    expect(f('aa/bb', '')).to.be.true;
    expect(f('aa/bb/cc/dd', 'aa/bb')).to.be.true;    
  })

});
