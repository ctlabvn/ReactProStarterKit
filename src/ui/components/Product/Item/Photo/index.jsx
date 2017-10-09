import React, { Component } from "react";
import PropTypes from "prop-types";

import "./index.css";

export default class extends Component {
  static propTypes = {
    title: PropTypes.string,
    price: PropTypes.number,
    priceUnit: PropTypes.string,
    image: PropTypes.string,
    imageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    priceUnit: "$",
    imageSize: '100%'
  };

  render() {
    const { title, price, priceUnit, image, imageSize } = this.props;
    return (
      <div className="d-flex flex-column align-items-center">
        <img width={imageSize} height={imageSize} src={image} alt="..." />
        <div className="flex-row d-flex justify-items-between color-black font-largest">
          <span>{title}</span>
          <span>
            {priceUnit}
            {price}
          </span>
        </div>
      </div>
    );
  }
}