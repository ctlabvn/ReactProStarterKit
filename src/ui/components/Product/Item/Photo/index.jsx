import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

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
    const { title, price, priceUnit, image, imageSize, className } = this.props;
    return (
      <div className={classNames("d-flex flex-column align-items-center", className)}>      
        <img width={imageSize} height={imageSize} src={image} alt="..." />
        <div className="w-100 flex-row d-flex justify-content-between color-black font-largest">
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