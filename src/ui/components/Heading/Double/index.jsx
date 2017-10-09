import React, { Component } from "react";
import PropTypes from "prop-types";

import "./index.css";

export default class extends Component {

  render(){
    const {leftTitle, rightTitle} = this.props
    return (
      <h3 className="d-flex flex-row justify-content-between font-large color-black border-bottom">
        <span>{leftTitle}</span>
        <span>{rightTitle}</span>
      </h3>
    )
  }

}