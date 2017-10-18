import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

import { Col } from "reactstrap";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";
import ProductItem from "~/ui/components/Product/Item";
import ButtonRound from "~/ui/components/Button/Round";

import * as orderActions from "~/store/actions/order";

import api from "~/store/api";
import "./index.css";
import options from "./options";


@connect(null, orderActions)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
	    products: [],
	    features: [],
    };
  }

  handleCategory = async currentCategoryUuid => {
    const ret = await api.restaurant.getProductByCategory(currentCategoryUuid);
    // check ret.error then show ret.message
    this.setState({ products: ret.data.data });
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
    const { t, outlet } = this.props;
    return (
      <div className="row block bg-white mb-4 tab-content">
        <h3 className="font-largest color-black w-100 mb-4">
          <span className="font-weight-bold">{t('LABEL.ALL_PRODUCTS')}</span> ({outlet.total_items})
        </h3>

        <Slider className="mt-2" num={5} move={1}>
	        {this.state.features.length ? this.state.features.map((item, index) => (
            <ProductItemPhoto
              key={index}
              price={10}
              title={item.name}
              image="/images/donut-square.png"
            />
          )) : ''}
        </Slider>

        <div className="mt-5 row w-100">
          <Menu className="col list-group restaurant-cat">
            {outlet.categories.map(item => (
              <MenuItem
                onClick={() => this.handleCategory(item.category_uuid)}
                key={item.category_uuid}
                title={item.name}
              />
            ))}
          </Menu>

          <Col md="10">
            {this.state.products.length ? (
	            this.state.products.length.map((item, index) => (
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
                  Choose other category at the left side
                </p>
              </div>
            )}
          </Col>
        </div>

      </div>
    );
  }
}