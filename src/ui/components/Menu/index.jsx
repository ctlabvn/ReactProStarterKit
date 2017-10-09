import React, { Component } from "react";

export default class extends Component {
  render() {
    const { children } = this.props;
    return <ul className="list-unstyled list-inline">{children}</ul>;
  }
}