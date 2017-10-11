import React, { Component } from "react";
import classNames from "classnames";

import Rating from "~/ui/components/Rating";

export default class extends Component {
  static defaultProps = {
    size: 80,
    image: "/images/no-data.png"
  };

  render() {
    const { size, title, image, className } = this.props;

    return (
      <div
        className={classNames(
          "d-flex flex-row justify-contents-center",
          className
        )}
      >
        <img
          style={{ width: size, height: size }}
          src={image}
          alt="..."
          className="rounded-circle"
        />
        <div className="flex-column ml-3">
          <div className="d-flex flex-row">
            <Rating className="xsmall" />
            <span className="ml-1 text-muted xsmall">
              Marie D. | August, 2017
            </span>
          </div>
          <small>{title}</small>
        </div>
      </div>
    );
  }
}