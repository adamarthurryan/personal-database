
import React from 'react'
import {Link} from 'react-router'
import ResourceThumb from './ResourceThumb'
import ResourceLink from './ResourceLink'
import * as PathTools from '../database/PathTools'

import MasonryGrid from './MasonryGrid'


import MarkdownIt from 'markdown-it'
var md = MarkdownIt({linkify:true})

//MarkdownIt returns sanitized html and is safe
function renderMarkdown(markdown) {
  return {__html: md.render(markdown)}
}

export default class Entry extends React.Component { 

  constructor() {
    super()
  }  

  render () {
    const {entry, resources, index, title, body} = this.props
    

    var thumbResources = resources.filter(path => canThumbnail(path))
    var nonThumbResources = resources.filter(path => ! canThumbnail(path))

    return (
      <div className="entry">

        {body ? <div className="body" dangerouslySetInnerHTML={renderMarkdown(body)}></div> : null}
        
        <div className="resources resource-links">
          {nonThumbResources.map( resource => {
            return <div key={resource}> <ResourceLink resource={resource}/></div>
          })}
        </div>

        <div className="resources resource-thumbs u-cf">
          {thumbResources.map( resource => {
            return <div className="u-pull-left" key={resource}>
              <a href={"/static/"+resource}>
                <ResourceThumb resource={resource} size="300x300"/>
              </a>
            </div>
          })}
        </div>
      </div> 
    );
  }   
}


function canThumbnail(path) {
  let ext = PathTools.getExtension(path)
  ext = ext.toLowerCase()
  return (ext == '.jpg' || ext == '.gif' || ext == '.png' || ext=='.jpeg' )
}