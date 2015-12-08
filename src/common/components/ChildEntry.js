
import React from 'react';
import {Link} from 'react-router';
import ResourceThumb from './ResourceThumb';
import ResourceLink from './ResourceLink';
import * as PathTools from '../database/PathTools'


import MarkdownIt from 'markdown-it';
var md = MarkdownIt({linkify:true});

//MarkdownIt returns sanitized html and is safe
function renderMarkdown(markdown) {
  return {__html: md.render(markdown)};
}

export default class BriefEntry extends React.Component { 

  constructor() {
    super();
  }  

  render () {
    const {entry, resources, index, title, body} = this.props;
    

    let thumbResources = resources.filter(path => canThumbnail(path));
    let nonThumbResources = resources.filter(path => ! canThumbnail(path));


    //the body should be appreviated to a certain number of lines
    //this slice should be a little smarter, eg. not taking blank lines into account
    let shortBody = null
    if (body)
      shortBody = body.split('\n').slice(0,4).join('\n')

    return (
      <div className="entry">

        {shortBody ? <div className="body" dangerouslySetInnerHTML={renderMarkdown(shortBody)}></div> : null}
        
        <div className="resources resource-links">
          {nonThumbResources.map( resource => {
            return <ResourceLink resource={resource}/>
          })}
        </div>

        <div className="resources resource-thumbs row">
          {thumbResources.map( resource => {
            return <div  className='two columns'><ResourceThumb resource={resource} size="200x200"/></div>
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