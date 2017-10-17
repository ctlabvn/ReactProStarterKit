import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Col } from "reactstrap";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";
import ProductItem from "~/ui/components/Product/Item";
import ButtonRound from "~/ui/components/Button/Round";

import api from "~/store/api";
import "./index.css";
import options from "./options";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
	    products: null
    };
  }

	handleCategory = async (currentCategoryUuid) => {
	  const ret = await api.restaurant.getProductByCategory(currentCategoryUuid);
	  // check ret.error then show ret.message
	  this.setState({ products: ret.data.data });
  };

  render() {
    const { outlet } = this.props;
    const { products } = this.state;
    return (
      <div className="row block bg-white mb-4">
        <h3 className="font-largest color-black w-100 mb-4">
          <span className="font-weight-bold">ALL PRODUCTS</span> (25)
        </h3>

        <Slider className="mt-2" num={5} move={1}>
          {options.products.map((item, index) => (
            <ProductItemPhoto
              key={index}
              price={10}
              title={item}
              image="/images/donut-square.png"
            />
          ))}
        </Slider>

        <div className="mt-5 row w-100">
          <Menu className="col list-group restaurant-cat">
            {outlet.categories.map(item => (
              <MenuItem onClick={() => this.handleCategory(item.category_uuid)} key={item.category_uuid} title={item.name} />
            ))}
          </Menu>

          <Col md="10">
            {products ? products.map((item, index) => (
              <ProductItem
                className="col-md-6 float-left pl-0 pr-5 mb-4"
                description={item.description}
                key={index}
                price={item.default_price}
                priceUnit={item.currency.symbol}
                title={item.name}
                image="/images/donut.png"
                itemUuid={item.item_uuid}
              />
            ))
            : <div className="d-flex align-items-center mt-5 justify-content-center">No data</div>
          }
          </Col>
        </div>
      </div>
    );
  }
}