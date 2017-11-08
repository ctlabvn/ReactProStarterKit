import React, { Component } from "react";
import { translate } from "react-i18next";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
// import { connect } from "react-redux";

import ProductItem from "~/ui/components/Product/Item";

import "./index.css";

@translate("translations")
export default class ProductGroup extends Component {
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

  componentWillReceiveProps(nextProps) {
    this.handleSearch(nextProps);
  }

  handleSearch = nextProps => {
    const term = nextProps.term;
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

  render() {
    const { name, products, onAddOrder } = this.props;
    const { displayHeader } = this.state;

    return (
      <div className="row">
        {displayHeader && products.length > 0 
          && <strong className="text-uppercase mb-3 color-black-300 col-md-12">{name}</strong>}
        {products.length > 0
          ? products.map((item, index) => (
              <ProductItem
                className={classNames("col-md-6 mb-5", {"pl-5": index % 2 === 1})}
                description={item.description}
                key={index}
                price={item.default_price}
                priceUnit={
                  item.currency && item.currency.symbol
                    ? item.currency.symbol
                    : ""
                }
                title={item.name}
                image={this.getProductImage(item.gallery)}
                itemUuid={item.item_uuid}
                onIncrease={!!item.currency && onAddOrder ? () => onAddOrder(item) : null}
                displayItem={
                  typeof item.display !== "undefined" ? !!item.display : true
                }
              />
            ))
          : ""}
        <div className="clearfix" />
      </div>
    );
  }
}