import React from 'react';

import MarkdownIt from 'markdown-it';
var md = MarkdownIt({linkify:true});

//MarkdownIt returns sanitized html and is safe
function renderMarkdown(markdown) {
  return {__html: md.render(markdown)};
}

export default class IndexResource extends React.Component { 
  render() {

    var resourceData = this.props.resources.get(this.props.path);

    if (! resourceData)
      //should have a better loading display
      return <p>No such resource data found</p> 

    if (resourceData.isLoading())
      return <p>Loading...</p>

    if (resourceData.isFailed())
      return <p>Error: {this.props.resourceData.error}</p>

    return <div className="resource index-resource" dangerouslySetInnerHTML={renderMarkdown(resourceData.data)}>
    </div>
  }
}
