import React from 'react'
import ReactDOM from 'react-dom'
//The following doesn't work server-side
//import Masonry from 'masonry-layout'
//instead, we import masonry with a <script> tag

var canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
);


export default class MasonryGrid extends React.Component {

    constructor() {
        super()
        this.state = {masonry:null}
    }

    // Wrapper to layout child elements passed in
    render () {
        var children = this.props.children;
        return (
            <div className="grid">
                {children}
            </div>
        );
    }

    // When the DOM is rendered, let Masonry know what's changed
    componentDidUpdate() {
        if(canUseDOM && this.state.masonry) {
            this.state.masonry.reloadItems();
            this.state.masonry.layout();
        }
    }

    // Set up Masonry
    componentDidMount() {
        if (canUseDOM) {
            var container = ReactDOM.findDOMNode(this);
            if (!this.state.masonry) {
                this.setState({
                    masonry: new Masonry( container )
                });
            } else {
                this.state.masonry.reloadItems();
            }
        }
    }
}