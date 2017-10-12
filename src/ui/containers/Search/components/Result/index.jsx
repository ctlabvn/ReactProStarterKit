import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

// component
import MasonryInfiniteScroller from "~/ui/components/Scroller/Infinite/Masonry";

import "./index.css";

let key = 0;

@translate('translations')
export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      elements: this.generateElements(),
    };    
  }

  colors = ['#EC407A', '#EF5350', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#827717', '#EF6C00'];

  heights = [200, 300, 300, 400, 400, 450];

  getRandomElement = array => array[Math.floor(Math.random() * array.length)];

  generateElements = () => [...Array(10).keys()].map(() => ({
    key: key++,
    color: this.getRandomElement(this.colors),
    height: this.getRandomElement(this.heights),
  }));


  loadMore = () => setTimeout(() => this.setState(state => ({
    elements: state.elements.concat(this.generateElements()),
  })), 2500);

  render() {
    
    const {t} = this.props;    

    return (
      <div className="container-fluid">
        <MasonryInfiniteScroller
            className="masonry"
            hasMore={this.state.hasMore}
            loader={
              <div className="d-flex flex-row justify-content-center">
                <i className="fa fa-refresh fa-spin fa-3x fa-fw"></i>
              </div>
            }
            loadMore={this.loadMore}
          >
            {
              this.state.elements.map(({ key, color, height }, i) => (
                <div key={key} className="card" style={{ background: color, height }}>
                  <h2>{i}</h2>
                </div>
              ))
            }
          </MasonryInfiniteScroller>                          
      </div>
    );
  }
}