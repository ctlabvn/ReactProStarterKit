/* eslint-disable */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
//import Readmore from "~/ui/components/Readmore";
import StructuredDataOffer from "~/ui/components/StructuredData/Offer";
import { translate } from "react-i18next";

import HeadingDouble from "~/ui/components/Heading/Double";
import ButtonRound from "~/ui/components/Button/Round";
import Image from "~/ui/components/Image";
import Truncate from "react-truncate";

import "./index.css";

@translate("translations")
export default class ProductItem extends Component {
  static propTypes = {
    item_slug: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    price: PropTypes.number,
    description: PropTypes.string,
    currency: PropTypes.object,
    image: PropTypes.string,
    quantity: PropTypes.number,
    imageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    imageSize: "4.5rem",
    quantity: 1
  };

  render() {
    const {
      outlet_slug,
      title,
      price,
      image,
      imageSize,
      description,
      className,
      item_slug,
      quantity,
      currency,
      onIncrease,
      onDecrease
      //t
    } = this.props;

    const totalPrice = price * quantity;

    return (
      <div
        itemScope
        itemType="http://schema.org/Product"
        className={classNames("d-flex flex-row", className)}
      >
        <div
          style={{
            minWidth: "4.5rem",
            width: "15%",
            height: "auto"
          }}
        >
          <Image
            className="restaurant-product-item-image"
            style={{
              width: "100%",
              height: "auto",
              alignSelf: "center",
              borderRadius: "50%"
            }}
            itemProp="image"
            src={image}
            alt=""
          />
        </div>

        <div className="flex-column d-flex ml-3 w-100">
          <Link to={`/${outlet_slug}/${item_slug}`}>
            <HeadingDouble
              className="color-grey restaurant-item-header"
              leftTitle={<span itemProp="name">{title}</span>}
              rightTitle={
                <StructuredDataOffer price={totalPrice} currency={currency} />
              }
            />
          </Link>
          <div className="flex-row d-flex justify-content-between">
            <div className="h-100 restaurant-item-content mr-2">
              {/*
               <Readmore
               line="500"
               // more={t("LABEL.SHOW_MORE")}
               // less={t('LABEL.SHOW_LESS')}
               >
               <p itemProp="description" className="w-100 mt-3 html-content">
               {description}
               </p>
               </Readmore>
              */}
              <Truncate lines={3} trimWhitespace={true}>
                {description}
              </Truncate>
            </div>
            <div className="pt-3 d-flex flex-column justify-content-between restaurant-item-button">
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
