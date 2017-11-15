import React, { Component } from "react";
// import { translate } from "react-i18next";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
// import { connect } from "react-redux";


import Fuse from 'fuse.js';


import {PopoverHeader, PopoverBody, Popover} from "reactstrap";

import ProductItem from "~/ui/components/Product/Item";
import ProductOptions from "~/ui/components/Product/Options";

import "./index.css";

// @translate("translations")
export default class ProductGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      selectedItem: null,
      displayProducts: props.products,
    };

    this.searchEngine = new Fuse(props.products, {
      threshold: 0.3,
      keys: ['name', 'description']
    });    
  }

  static propTypes = {
    term: PropTypes.string,
    name: PropTypes.string,
    products: PropTypes.array,
    onAddOrder: PropTypes.func
  };

  getProductImage(gallery) {
    try {
      const galleryData = JSON.parse(gallery);
      return galleryData[0];
    } catch (e) {
      return "/images/donut.png";
    }
  }

  componentWillReceiveProps({term}) {
    this.handleSearch(term);
  }

  handleSearch = term => {    
    let displayProducts = this.props.products;
    if(term){
      displayProducts = this.searchEngine.search(term);
    } 
    this.setState({displayProducts});
  };

  processAddOrder = (item, onAddOrder)=>{    
    // if(!!item.currency){
      if(item.item_options && item.item_options.length){
        this.setState({
          selectedItem: item,
        });
      } else {
        onAddOrder(item);
      }     
    // }     
  };

  renderPopover(onAddOrder){
    const item = this.state.selectedItem;
    if(item && onAddOrder) {
      return (
        <Popover placement="bottom" isOpen={true} target={`product-${item.item_uuid}`} toggle={()=>this.setState({selectedItem:null})}>
            <PopoverHeader>{item.title}</PopoverHeader>
            <PopoverBody>
              <ProductOptions inline={false} onAddOrderItem={onAddOrder} canAddOrder={true} item={item} />
            </PopoverBody>
          </Popover>        
      );
    }
  }  

  render() {
    const { name, onAddOrder, ...props } = this.props;
    const { displayProducts } = this.state;

    return (
      <div {...props}>
        <strong className="text-uppercase mb-3 color-black-300 col-md-12">{name}</strong>
        {displayProducts && displayProducts.map((item, index) =>     
            <div key={item.item_uuid} className={classNames("col-md-6 mb-5", {"pl-md-5": index % 2 === 1})}>
              <ProductItem                
                description={item.description}                                
                price={item.default_price}
                priceUnit={
                  item.currency && item.currency.symbol
                    ? item.currency.symbol
                    : ""
                }
                title={<span id={`product-${item.item_uuid}`}>{item.name}</span>}
                image={this.getProductImage(item.gallery)}
                itemUuid={item.item_uuid}
                onIncrease={onAddOrder ? ()=>this.processAddOrder(item, onAddOrder) : null}                
              /> 
            </div>           
            )}        
          {this.renderPopover(onAddOrder)}
      </div>
    );
  }
}