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
      <div className="card">
        <img className="card-img-top" src="{logo}" alt="" />
          <div className="card-body">
            <h4 className="card-title">
              <MenuItem
                key={uuid}
                link={`/restaurant/${uuid}`}
                title={name}
              />
            </h4>
            <p className="card-text">{address}</p>
          </div>
      </div>
    );
  }
}