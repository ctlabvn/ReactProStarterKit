import React, { Component } from "react";
import PropTypes from "prop-types";
import HeadingDouble from "~/ui/components/Heading/Double";
import ButtonRound from '~/ui/components/Button/Round'

import "./index.css";

export default class extends Component {
  static propTypes = {
    title: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    priceUnit: PropTypes.string,
    image: PropTypes.string,
    imageSize: PropTypes.number,
  };

  static defaultProps = {
    priceUnit: '$',
    imageSize: 50,
  };

  render() {
    const { title, price, priceUnit, image, imageSize, description } = this.props;        
    return (
      <div className="d-flex flex-row align-items-center">
        <img width={imageSize} height={imageSize} src={image} alt="..." class="rounded-circle"/>
        <div className="flex-column d-flex">
          <HeadingDouble leftTitle={title} rightTitle={`${priceUnit}${price}`} />
          <div className="flex-row d-flex justify-items-between">
            <span>{description}</span>
            <ButtonRound icon="plus" />
          </div>
        </div>
      </div>
    )
  }
}