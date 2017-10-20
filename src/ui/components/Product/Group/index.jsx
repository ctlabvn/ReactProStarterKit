import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

import ProductItem from "~/ui/components/Product/Item";
import * as orderActions from "~/store/actions/order";

import "./index.css";

@translate("translations")
@connect(null, orderActions)
export default class extends Component {
  static propTypes = {
    name: PropTypes.string,
	  products: PropTypes.array
  };

	addOrderItem(item) {
		const {
			default_price,
			item_options,
			item_uuid,
			currency,
			name,
			description
		} = item;
		this.props.addOrderItem({
			item_uuid,
			item_options,
			price: default_price,
			quantity: 1,
			name,
			description,
			currency_symbol: currency.symbol
		});
	}

	getProductImage(gallery) {
		const galleryData = JSON.parse(gallery);
		// return galleryData[0];
		return "/images/donut.png";
	}

  render() {
    const {
      name,
	    products,
      t,
    } = this.props;

    return (
      <div className="container">
	      {products.length ? <h2 className="mb-3">{name}</h2> : ''}
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
              onIncrease={() => this.addOrderItem(item)}
            />
		      ))
	       : ''}
	      <div className="clearfix"></div>
      </div>
    );
  }
}