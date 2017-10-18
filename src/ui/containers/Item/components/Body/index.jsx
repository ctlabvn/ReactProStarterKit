import React, { Component } from "react";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";

import "./index.css";
import options from "./options";

export default class extends Component {
  render() {
    const { item, outlet } = this.props;
    return (
      <div className="row block bg-white mb-4">
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
      </div>
    );
  }
}