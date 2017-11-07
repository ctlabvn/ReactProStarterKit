import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { translate } from "react-i18next";

import Image from "~/ui/components/Image";

import "./index.css";

@translate("translations")
export default class ProductItemPhoto extends Component {
  static propTypes = {
    title: PropTypes.string,
    price: PropTypes.number,
    priceUnit: PropTypes.string,
    image: PropTypes.string,
    imageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    priceUnit: "$",
    imageSize: "100%"
  };

  render() {
    const { title, price, priceUnit, image, imageSize, className, t, ...props } = this.props;
    return (
      <div
        className={classNames(
          "d-flex flex-column align-items-center",
          className
        )}
        {...props}
      >
        <Image width={imageSize} height={imageSize} src={image} alt="..." />
        <div className="w-100 flex-row d-flex justify-content-between mt-2">
          <span>{title}</span>
          {price > 0 && (
            <span>
             {t("format.currency", {
                  price: price,
                  symbol: priceUnit
                })}
            </span>
          )}
        </div>
      </div>
    );
  }
}