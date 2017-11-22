import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import Readmore from "~/ui/components/Readmore";

import { translate } from "react-i18next";

import HeadingDouble from "~/ui/components/Heading/Double";
import ButtonRound from "~/ui/components/Button/Round";
import Image from "~/ui/components/Image";

import "./index.css";

@translate("translations")
export default class ProductItem extends Component {
  static propTypes = {
    item_slug: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    price: PropTypes.number,
    description: PropTypes.string,
    priceUnit: PropTypes.string,
    image: PropTypes.string,
    quantity: PropTypes.number,
    imageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    priceUnit: "$",
    imageSize: 80,
    quantity: 1
  };

  render() {
    const {
      outlet_slug,
      title,
      price,
      priceUnit,
      image,
      imageSize,
      description,
      className,
      item_slug,
      quantity,
      onIncrease,
      onDecrease,
      hideImage,
      t
    } = this.props;

    const totalPrice = price * quantity;

    return (
      <div
        itemScope
        itemType="http://schema.org/Product"
        className={classNames("d-flex flex-row align-items-center", className)}
      >
        <div
          style={{
            width: imageSize,
            height: imageSize
          }}
        >
          <Image
            style={{ maxWidth: "100%", maxWidth: "100%", alignSelf: "center" }}
            itemProp="image"
            src={image}
            alt={title}
          />
        </div>

        <div className="flex-column d-flex ml-3 w-100">
          <Link to={`/restaurant/${outlet_slug}/${item_slug}`}>
            <HeadingDouble
              className="color-black-300"
              leftTitle={<span itemProp="name">{title}</span>}
              rightTitle={
                <span itemProp="price">
                  {t("format.currency", {
                    price: totalPrice,
                    symbol: priceUnit
                  })}
                </span>
              }
            />
          </Link>
          <div className="flex-row d-flex justify-content-between">
            <div className="pr-4">
              <Readmore
                line="500"
                more={t("LABEL.SHOW_MORE")}
                // less={t('LABEL.SHOW_LESS')}
              >
                <p itemProp="description" className="w-100 mt-3 html-content">
                  {description}
                </p>
              </Readmore>
            </div>
            <div className="d-flex flex-column justify-content-between">
              {onIncrease && <ButtonRound icon="plus" onClick={onIncrease} />}
              {quantity > 0 &&
                onDecrease && <ButtonRound icon="minus" onClick={onDecrease} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
