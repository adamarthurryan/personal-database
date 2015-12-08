/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import * as PathTools from 'common/database/PathTools';

describe('PathTools', () => {


  beforeEach(() => {
  });

  it('should normalize paths', () => {
    let f=PathTools.normalize;
    expect(f("a/b/c")).to.eql("a/b/c");
    expect(f("/a/b/c")).to.eql("a/b/c");
    expect(f("a/b/c/")).to.eql("a/b/c");
    expect(f("/a/b/c/")).to.eql("a/b/c");
    expect(f("/")).to.eql(PathTools.ROOT);
    expect(f("/a")).to.eql("a")
    expect(f("/a/")).to.eql("a");
    expect(f("a//b//c")).to.eql("a/b/c")
    expect(f("a///////b//c")).to.eql("a/b/c")
    expect(f("\\a\\b\\c\\\\d\\")).to.eql('a/b/c/d')
  });

  it ('should identify root paths', () => {
    let f = PathTools.isRoot;
    expect(f(PathTools.ROOT)).to.be.true;
    expect(f('a')).to.be.false;
    expect(f('a/bc')).to.be.false;
  });

  it ('should detect parent paths', () => {
    let f = PathTools.hasParent;
    expect(f(PathTools.ROOT)).to.be.false;
    expect(f('a')).to.be.true;
    expect(f('b/c')).to.be.true;
  });

  it ('should get parent paths' , () => {
    let f = PathTools.getParent;
    expect(f(PathTools.ROOT)).to.be.null;
    expect(f('aa')).to.eql(PathTools.ROOT);
    expect(f('aa/bb')).to.eql('aa');
    expect(f('aa/bb/cc')).to.eql('aa/bb')
  });

  it ('should get name parts' , () => {
    let f = PathTools.getName;
    expect(f(PathTools.ROOT)).to.eql('');
    expect(f('aa')).to.eql('aa');
    expect(f('aa/bb')).to.eql('bb');
    expect(f('aa/bb/cc')).to.eql('cc')
  });

  it ('should get extension parts' , () => {
    let f = PathTools.getExtension;
    expect(f('a.md')).to.eql('.md');
    expect(f('a')).to.eql('');
    expect(f('.bashrc')).to.eql('');
    expect(f('a/a.md')).to.eql('.md');
    expect(f('a/a')).to.eql('');
    expect(f('a/.bashrc')).to.eql('');
    expect(f('a/b.b/a.md')).to.eql('.md');
    expect(f('a/b.b/a')).to.eql('');
    expect(f('a/b.b/.bashrc')).to.eql('');
  });
  it ('should strip extension parts' , () => {
    let f = PathTools.stripExtension;
    expect(f('a.md')).to.eql('a');
    expect(f('a')).to.eql('a');
    expect(f('.bashrc')).to.eql('.bashrc');
    expect(f('a/a.md')).to.eql('a/a');
    expect(f('a/a')).to.eql('a/a');
    expect(f('a/.bashrc')).to.eql('a/.bashrc');
    expect(f('a/b.b/a.md')).to.eql('a/b.b/a');
    expect(f('a/b.b/a')).to.eql('a/b.b/a');
    expect(f('a/b.b/.bashrc')).to.eql('a/b.b/.bashrc');
  });

  it ('should identify children', () => {
    let f = PathTools.isChildOf;
    expect(f('aa', PathTools.ROOT)).to.be.true;
    expect(f('aa/bb/cc', 'aa/bb')).to.be.true;
  });

  it ('should not confuse children and parents', () => {
    let f = PathTools.isChildOf;
    expect(f(PathTools.ROOT, 'aa')).to.be.false;
    expect(f(PathTools.ROOT, 'aa/bb')).to.be.false;
    expect(f('aa/bb', 'aa/bb/cc')).to.be.false;
  });

  it ('should not think non-child descendants are children', () => {
    let f = PathTools.isChildOf;
    expect(f('aa/bb', PathTools.ROOT)).to.be.false;
    expect(f('aa/bb/cc/dd', 'aa/bb')).to.be.false;
  });

  it ('should identify children as descendants', () => {
    let f = PathTools.isDescendantOf;
    expect(f('aa', PathTools.ROOT)).to.be.true;
    expect(f('aa/bb/cc', 'aa/bb')).to.be.true;    
  });

  it ('should not confuse anscestors and descendants', () => {
    let f = PathTools.isDescendantOf;
    expect(f(PathTools.ROOT, 'aa')).to.be.false;
    expect(f(PathTools.ROOT, 'aa/bb')).to.be.false;
    expect(f('aa/bb', 'aa/bb/cc')).to.be.false;
    expect(f('aa/bb', 'aa/bb/cc/dd')).to.be.false;
  });

  it ('should identify non-child descendants as descendants', () => {
    let f = PathTools.isDescendantOf;
    expect(f('aa/bb', PathTools.ROOT)).to.be.true;
    expect(f('aa/bb/cc/dd', 'aa/bb')).to.be.true;    
  })

  it ('should get the base name of a resource or id', () => {
    let f = PathTools.getName;

    expect(f('a/b/c')).to.equal('c')
    expect(f('earthship/G2_Global_model_Earthship_Taos_N.M..JPG')).to.equal('G2_Global_model_Earthship_Taos_N.M..JPG')

  })
});
