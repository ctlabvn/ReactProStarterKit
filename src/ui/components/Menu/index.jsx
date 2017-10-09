import React, { Component } from "react";

import "./index.css";

export default class extends Component {
  render() {
    const { children } = this.props;
    return <ul className="list-unstyled list-inline menu">{children}</ul>;
  }
}