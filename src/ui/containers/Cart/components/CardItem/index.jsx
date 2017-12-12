import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

// components
import ButtonRound from "~/ui/components/Button/Round";
import Image from "~/ui/components/Image";

import "./index.css";

@translate("translations")
export default class extends Component {
  static propTypes = {
    uuid: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.number,
    priceUnit: PropTypes.string,
    vat: PropTypes.number,
    minQty: PropTypes.number
  };

  static defaultProps = {
    vat: 0,
    minQty: 1,
    priceUnit: "$"
  };

  render() {
    const {
      priceUnit,
      price,
      vat,
      title,
      image,
      onIncrease,
      onDecrease,
      onRemove,
      quantity,
      minQty,
      options,
      t,
      uuid,
      outlet_slug,
      item_slug,
      onSetQuantity,
      ...props
      } = this.props;
    const total = price * quantity;
    return ([
      <tr key="1" style={{height: "24px"}}/>,
      <tr key="2" {...props} ref={ref => (this.element = ref)}>
        {
          //<th className="text-left card-title pl-md-0" scope="row">
          //  <Link to={`/${outlet_slug}/${item_slug}`} className="color-black-300">
          //    <div className="d-flex align-items-center">
          //      <Image src={image} />
          //      <div className="ml-2 w-100">
          //        <div className="">{title}</div>
          //        {options &&
          //        options.map(item_option => (
          //          <small
          //            className="color-black-300 text-uppercase"
          //            key={item_option.option_uuid}
          //          >
          //            <span>{`(+1) ${item_option.name}`}</span>
          //            {
          //              // <span className="ml-2 color-red">
          //              //   {t("format.currency", {
          //              //     price: item_option.price,
          //              //     symbol: priceUnit
          //              //   })}
          //              // </span>
          //            }
          //          </small>
          //        ))}
          //      </div>
          //
          //    </div>
          //
          //  </Link>
          //</th>
        }
        <th className="text-left">
          <Link to={`/${outlet_slug}/${item_slug}`}>
            <div className="d-flex flex-row">
              <div className="your-cart-item-img">
                <Image src={image}/>
              </div>
              <div className="w-100 ml-4">
                <div className="your-cart-item-name d-flex align-items-end font-fr-130 color-cg-040 text-uppercase"><span>{title}</span></div>
                <div className="your-cart-item-option d-flex align-items-start font-fr-120 color-cg-074">
                  <span>{
                    options &&
                    options.map((item_option,i) => (
                      <span key={i}>{`(+1) ${item_option.name} `}</span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </th>
        <td className="font-fr-130 color-cg-074" data-title={t("TABLE.UNIT_PRICE")}>
          <div className="your-cart-item-unit-price">
            {t("format.currency", {
              price,
              symbol: priceUnit
            })}
          </div>
        </td>
        <td data-title={t("TABLE.QUANTITY")}>
          <div className="d-flex flex-row align-items-center justify-content-center float-md-none float-right">
            <button className="your-cart-item-btn-quantity" onClick={quantity > minQty ? onDecrease : null}>
              <span>-</span>
            </button>
            <span className="ml-2 mr-2">
              <input
                className="your-cart-item-input-quantity font-fr-120 color-cg-074 text-center"
                type="text"
                value={quantity}
                onChange={e => onSetQuantity(e.target.value)}
              />
            </span>
            <button className="your-cart-item-btn-quantity" onClick={onIncrease}>
              <span>+</span>
            </button>
          </div>
        </td>
        {
          //<td data-title={t("LABEL.VAT")}>
          //  {t("format.currency", {
          //    price: total * vat,
          //    symbol: priceUnit
          //  })}
          //</td>
        }
        <td className="text-right color-red font-fr-130" data-title={t("TABLE.TOTAL")}>
          {t("format.currency", {
            price: total * (1 - vat),
            symbol: priceUnit
          })}
        </td>
        <td className="text-right" data-title={t("TABLE.DELETE")}>
          <i role="button" onClick={onRemove} className="fa fa-times font-fr-130" aria-hidden="true"/>
        </td>
      </tr>
    ]);
  }
}
