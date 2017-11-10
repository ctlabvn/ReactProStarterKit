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
    vat: PropTypes.number
  };

  static defaultProps = {
    vat: 0,
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
      options,
      t,
      uuid,
      ...props
    } = this.props;
    const total = price * quantity;
    return (
      <tr {...props} ref={ref => (this.element = ref)}>
        <th className="card-title pl-0" scope="row">
          <Link to={`/item/${uuid}`} className="color-black-300">
            <div className="d-flex align-items-center">
              <Image src={image} />
              <span className="ml-2">{title}</span>
            </div>            
            {options &&
              options.map(item_option => (
                <small className="mt-2 color-black-300" key={item_option.option_uuid}>
                  (+1){" "}
                  <span className="text-uppercase">{item_option.name}</span>
                 { 
                  // <span className="ml-2 color-red">
                  //   {t("format.currency", {
                  //     price: item_option.price,
                  //     symbol: priceUnit
                  //   })}
                  // </span>
                }
                </small>
              ))}
          </Link>
        </th>
        <td>
          {t("format.currency", {
            price,
            symbol: priceUnit
          })}
        </td>
        <td>
          <div className="d-flex flex-row align-items-center justify-content-center">
            {quantity > 0 && <ButtonRound icon="minus" onClick={onDecrease} />}
            {quantity > 0 && <span className="ml-2 mr-2">{quantity}</span>}
            <ButtonRound icon="plus" onClick={onIncrease} />
          </div>
        </td>
        <td>
          {t("format.currency", {
            price: total * vat,
            symbol: priceUnit
          })}
        </td>
        <td>
          {t("format.currency", {
            price: total * (1 - vat),
            symbol: priceUnit
          })}
        </td>
        <td className="text-center">
          <i className="fa fa-times" aria-hidden="true" onClick={onRemove} />
        </td>
      </tr>
    );
  }
}