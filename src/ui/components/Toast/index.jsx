import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import classNames from "classnames";

import * as commonSelectors from "~/store/selectors/common";
import * as commonActions from "~/store/actions/common";

import "./index.css";

@connect(state => ({
  toast: commonSelectors.getToast(state)
}), commonActions)
export default class extends Component {
  handleRequestClose = () => {
    clearTimeout(this.timeout);
    this.props.clearToast();
  };

  render() {
    const {toast, clearToast} = this.props;
    if(!toast) return null;
    const { message, level, duration } = toast;
    this.timeout = setTimeout(clearToast, duration);
    return (
      <div
        onClick={this.handleRequestClose}
        className={`toast color-white bg-${level}`}
      >
        {message}
      </div>
    );
  }
}