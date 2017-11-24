import React, { Component } from "react";
import classNames from "classnames";

import "./index.css";

export default class HeadingDouble extends Component {
  render() {
    const { leftTitle, rightTitle, className, ...props } = this.props;
    return (
      <strong
        className={classNames(
          "d-flex justify-content-between font-medium color-black border-bottom text-uppercase pb-1",
          className
        )}
        {...props}
      >
        {typeof leftTitle === "string" ? <span>{leftTitle}</span> : leftTitle}
        {typeof rightTitle === "string" ? (
          <span>{rightTitle}</span>
        ) : (
          rightTitle
        )}
      </strong>
    );
  }
}
