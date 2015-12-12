
import Index from './Index'

import Immutable from 'immutable'


//!!! This class should be moved out of the database folder into a parser folder
// !!! It should not use the Index object or Immutable, but rather just parse to a plain JS object

// !!! consider making attibutes hold a single value by default - square brackets could denote an array

var reTitle = /^\s*#\s+(.*)($|\n)/
var reAttrBlock = /(((^|\n)---\n)|^)((\n|[ \t]*[-+*][ \t]*([^\s:]+)[ \t]*:[ \t]*(.*))*)$/
var reAttrLine = /[ \t]*[-+*][ \t]*([^\s:]+)[ \t]*:[ \t]*(.*)$/gm
var reAttrKeyValue = /[ \t]*[-+*][ \t]*([^\s:]+)[ \t]*:[ \t]*(.*)$/

var reAttrValue = /\s*([^\,]+)(,|$)/g


//return an index record from the given markdown index specification
export function parse(source) {

  //the title
  let title = null
  let matchTitle = source.match(reTitle)


  if (matchTitle) {
    title = matchTitle[1].trim();
    source = source.replace(reTitle, '')
  }


  //the attribute block
  let attributes = []
  let matchAttrBlock = source.match(reAttrBlock)
  if (matchAttrBlock) {

    let attrLines = matchAttrBlock[4].match(reAttrLine)

    let attrKeyValues = attrLines.map(attrLine => attrLine.match(reAttrKeyValue))

    attributes = attrKeyValues.map(kvpair => {
      let [ignore, key, valueString] = kvpair
      return [key, Immutable.Set(valueString.match(reAttrValue))]
    })

    source = source.replace(reAttrBlock, '')
    if (source == '')
      source = null
  }

  attributes = Immutable.Map(attributes)
  let body = source
  
  let index = new Index({title, body, attributes})
  return index
}

export function emit(index) {

}
