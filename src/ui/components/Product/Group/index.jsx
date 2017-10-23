import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

import ProductItem from "~/ui/components/Product/Item";

import "./index.css";

@translate("translations")
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayHeader: true
		};
	}

  static propTypes = {
    term: PropTypes.string,
    name: PropTypes.string,
	  products: PropTypes.array,
    onAddOrder: PropTypes.func,
  };

	getProductImage(gallery) {
		const galleryData = JSON.parse(gallery);
		// return galleryData[0];
		return "/images/donut.png";
	}

	componentWillReceiveProps(nextProps) {
		this.handleSearch(nextProps);
	}

	handleSearch = (nextProps) => {
		const term = nextProps.term;
		const regex = new RegExp(term, 'ig');
		const { products } = this.props;

		this.setState({displayHeader: false});
		products.map((product) => {
			if(term.length) {
				if(product.name && (product.name.search(regex) > 0)) {
					product.display = true;
					this.setState({displayHeader: true});
				}	else {
					product.display = false;
				}
			} else {
				product.display = true
				this.setState({displayHeader: true});
			}
		});
	}

  render() {
    const {
      name,
	    products,
      t,
      onAddOrder,
    } = this.props;
    const { displayHeader } = this.state;

    return (
      <div className="container">
	      {displayHeader && products.length ? <h2 className="mb-3">{name}</h2> : ''}
	      {products.length ?
		      products.map((item, index) => (
            <ProductItem
              className="col-md-6 float-left pl-0 pr-5 mb-4"
              description={item.description}
              key={index}
              price={item.default_price}
              priceUnit={item.currency && item.currency.symbol ? item.currency.symbol : ''}
              title={item.name}
              image={this.getProductImage(item.gallery)}
              itemUuid={item.item_uuid}
              onIncrease={onAddOrder ? ()=>onAddOrder(item) : null}
              displayItem={typeof item.display != "undefined" ? item.display : true}
            />
		      ))
	       : ''}
	      <div className="clearfix"></div>
      </div>
    );
  }
}