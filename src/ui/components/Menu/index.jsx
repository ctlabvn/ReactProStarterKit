import React, { Component } from "react";
import classNames from "classnames";

import "./index.css";

export default class Menu extends Component {
  render() {
    const { children, className, ...props } = this.props;
    return <ul className={classNames("list-unstyled list-inline menu", className)} {...props}>{children}</ul>;
  }
}