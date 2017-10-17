import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import MenuItem from "~/ui/components/Menu/Item";

import "./index.css";

export default class extends Component {
  static propTypes = {
    uuid: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    logo: PropTypes.string
  };

  render() {
    const { name, address, logo, className, uuid, ...props } = this.props;
    return (
      <div className="media">
        <img className="media-image d-flex mr-3" src={logo} alt="" />
          <div className="media-body">
            <h5 className="mt-0">
              <a key={uuid} href={`/restaurant/${uuid}`}>{name}</a>
            </h5>
            {address}
          </div>
      </div>
    );
  }
}