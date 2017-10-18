import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
      <div className="col-6 my-3">
        <div className="media rounded">
          <img className="media-image d-flex mr-3" src={logo} alt="" />
            <div className="media-body">
              <Link to={`/restaurant/${uuid}`}><h5>{name}</h5></Link>
              <hr className="my-2" />
              {address}
              <br/>
              {}
            </div>
        </div>
      </div>
    );
  }
}