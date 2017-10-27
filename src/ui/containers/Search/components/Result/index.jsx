import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { translate } from "react-i18next";

// component
import MasonryInfiniteScroller from "~/ui/components/Scroller/Infinite/Masonry";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import IconLoading from "~/ui/components/Loading/icon";

import options from "./options";
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
    
    // const {t} = this.props;    

    return (
      <div className="container-fluid bg-white pt-4">
        <MasonryInfiniteScroller
            className="masonry"
            hasMore={this.state.hasMore}
            sizes={options.sizes}
            loader={
	            <IconLoading />
            }
            loadMore={this.loadMore}
          >
            {
              this.state.elements.map(({ key, color, height }, i) => (
                
                  <ProductItemPhoto
                   key={key}
                  className="card" style={{ background: color, height }}
                    price={10}
                title={`Donut pack ${i}`}
                image="/images/donut-square.png"
                />                
                
              ))
            }
          </MasonryInfiniteScroller>                          
      </div>
    );
  }
}