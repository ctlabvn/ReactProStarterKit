import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// components
import ButtonRound from "~/ui/components/Button/Round";

import "./index.css";

export default class extends Component {
  static propTypes = {
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

  removeItem = ()=>{        
    this.props.onRemove && this.props.onRemove()
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
      quantity,
      ...props
    } = this.props;
    const total = price * quantity;    
    return (
      <tr {...props} ref={ref=>this.element = ref}>
        <th className="card-title pl-0" scope="row">
          <img src={image} atl="" />
          <span className="ml-2">{title}</span>
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
        <td>{priceUnit} {(total * vat).toFixed(2)}</td>
        <td>{priceUnit} {(total * (1-vat)).toFixed(2)}</td>
        <td className="text-center">
          <i className="fa fa-times" aria-hidden="true" onClick={this.removeItem} />
        </td>
      </tr>
    );
  }
}