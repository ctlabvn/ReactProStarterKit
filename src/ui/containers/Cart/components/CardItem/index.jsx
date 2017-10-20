import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

// components
import ButtonRound from "~/ui/components/Button/Round";

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
      t,
	    uuid,
      ...props
    } = this.props;
    const total = price * quantity;    
    return (
      <tr {...props} ref={ref=>this.element = ref}>
        <th className="card-title pl-0" scope="row">
          <Link to={`/item/${uuid}`}>
            <img src={image} atl="" />
            <span className="ml-2">{title}</span>
          </Link>
        </th>
        <td>
          {price}
          {priceUnit}
        </td>
        <td>
          <div className="d-flex flex-row align-items-center">
            <ButtonRound icon="minus" onClick={onDecrease}/>
            <span className="ml-2 mr-2">{quantity}</span>
            <ButtonRound icon="plus" onClick={onIncrease}/>
          </div>
        </td>        
        <td>{t("format.currency", {
                price: (total * vat),
                symbol: priceUnit
              })}</td>
        <td>{t("format.currency", {
                price: (total * (1-vat)),
                symbol: priceUnit
              })}</td>
        <td className="text-center">
          <i className="fa fa-times" aria-hidden="true" onClick={onRemove} />
        </td>
      </tr>
    );
  }
}