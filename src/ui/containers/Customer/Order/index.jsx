import React, { Component } from "react";
import { Link } from "react-router-dom";

import ProductItem from "~/ui/components/Product/Item";

import options from "./options";

export default class extends Component {
  render() {
    return (
      <div className="container">
        {options.products.map((item, index) => (
          <ProductItem
            className="col-md-6 float-left pl-0 pr-5 mb-4"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            key={index}
            price={10}
            title={item}
            image="/images/donut.png"
          />
        ))}
      </div>
    );
  }
}