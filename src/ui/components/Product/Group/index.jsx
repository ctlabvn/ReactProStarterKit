import React, { Component } from "react";
import { translate } from "react-i18next";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
// import { connect } from "react-redux";

import {PopoverHeader, PopoverBody, Popover} from "reactstrap";

import ProductItem from "~/ui/components/Product/Item";
import ProductOptions from "~/ui/components/Product/Options";

import "./index.css";

@translate("translations")
export default class ProductGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayHeader: true,
      selectedItem: null,
    };
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
    const regex = new RegExp(term, "gmiu");
    const { products } = this.props;

    this.setState({ displayHeader: false });
    products.forEach(product => {
      if (term.length) {
        if (product.name && product.name.search(regex) >= 0) {
          product.display = true;
          this.setState({ displayHeader: true });
        } else {
          product.display = false;
        }
      } else {
        product.display = true;
        this.setState({ displayHeader: true });
      }
    });
  };

  processAddOrder = (item, onAddOrder)=>{
    // console.log(item.item_options);
    if(!!item.currency && onAddOrder){
      if(item.item_options && item.item_options.length){
        this.setState({
          selectedItem: item,
        });
      } else {
        onAddOrder(item);
      }     
    }     
  };

  renderPopover(onAddOrder){
    const item = this.state.selectedItem;
    if(item && onAddOrder) {
      return (
        <Popover placement="bottom" isOpen={true} target={`product-${item.item_uuid}`} toggle={()=>this.setState({selectedItem:null})}>
            <PopoverHeader>{item.title}</PopoverHeader>
            <PopoverBody>
              <ProductOptions inline={false} onAddOrderItem={(item, item_options)=>onAddOrder({...item, item_options})} canAddOrder={true} item={item} />
            </PopoverBody>
          </Popover>        
      );
    }
  }  

  render() {
    const { name, products, onAddOrder } = this.props;
    const { displayHeader } = this.state;

    return (
      <div className="row">
        {displayHeader && products.length > 0 
          && <strong className="text-uppercase mb-3 color-black-300 col-md-12">{name}</strong>}
        {products && products.map((item, index) =>     
            <div key={item.item_uuid} className={classNames("col-md-6 mb-5", {"pl-5": index % 2 === 1})}>
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
                onIncrease={()=>this.processAddOrder(item, onAddOrder)}
                displayItem={
                  typeof item.display !== "undefined" ? !!item.display : true
                }
              /> 
            </div>           
            )}        
          {this.renderPopover(onAddOrder)}
      </div>
    );
  }
}