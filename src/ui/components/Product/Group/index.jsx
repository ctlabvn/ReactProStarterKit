import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import ProductItem from "~/ui/components/Product/Item";

import { translate } from "react-i18next";

import "./index.css";

@translate("translations")
export default class extends Component {
  static propTypes = {
    name: PropTypes.string,
	  products: PropTypes.Array
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
      <div>
        <h2>{name}</h2>
	      {products.length ? (
		      products.map((item, index) => (
            <ProductItem
              className="col-md-6 float-left pl-0 pr-5 mb-4"
              description={item.description}
              key={index}
              price={item.default_price}
              priceUnit={item.currency.symbol}
              title={item.name}
              image={this.getProductImage(item.gallery)}
              itemUuid={item.item_uuid}
              onIncrease={() => this.addOrderItem(item)}
            />
		      ))
	      ) : (
          <div className="text-center p-2">
            <img src="/images/no-data.png" height="100" alt="" />
            <p className="color-gray text-uppercase">
				      {t("LABEL.CHOOSE_CATEGORY")}
            </p>
          </div>
	      )}
      </div>
    );
  }
}