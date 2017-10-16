/* 1-2-3-4 photo group */

import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";

import "./index.css";

export default class extends Component {
  static propTypes = {
    images: PropTypes.array
  };

  renderOne(image) {
    return <img src={image} alt="" width="100%" height="100%" />;
  }

  renderTwo(images) {
    return [
      <img src={images[0]} key={0} alt="" height="50%" />,
      <img src={images[1]} key={1} alt="" height="50%" />
    ];
  }

  renderThree(images) {
    return [
      <img src={images[0]} key={0} alt="" className="h-50 align-self-stretch" />,
      <div className="d-flex flex-row h-50" key={1}>
        <img src={images[1]} alt="" className="w-50 align-self-stretch" />
        <img src={images[2]} alt="" className="w-50 align-self-stretch" />
      </div>
    ];
  }

  renderFour(images) {}

  renderPhoto(images) {
    switch (images.length) {
      case 1:
        return this.renderOne(images[0]);
      case 2:
        return this.renderTwo(images);
      case 3:
        return this.renderThree(images);
      case 4:
        return this.renderFour(images);
      default:
        return null;
    }
  }

  render() {
    const { images, className, ...props } = this.props;
    return (
      <div
        className={classNames("d-flex flex-column photo-group", className)}
        {...props}
      >
        {this.renderPhoto(images)}
      </div>
    );
  }
}