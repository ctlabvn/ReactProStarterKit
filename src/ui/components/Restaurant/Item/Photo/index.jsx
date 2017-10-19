import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import classNames from "classnames";

import RestaurantOrderSetting from "~/ui/components/Restaurant/OrderSetting";
import RestaurantTag from "~/ui/components/Restaurant/Tag";
import MenuItem from "~/ui/components/Menu/Item";

import "./index.css";

@translate('translations')
export default class extends Component {
  static propTypes = {
    uuid: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    logo: PropTypes.string,
	  outlet: PropTypes.Object
  };

  render() {
    const { t, name, address, logo, outlet, uuid, ...props } = this.props;
    return (
      <div className="col-sm-6 col-12 my-3">
        <div className="media rounded">
          <img className="media-image d-flex mr-3 rounded" src={logo} alt="" />
            <div className="media-body">
              <Link to={`/restaurant/${uuid}`}><h5>{name}</h5></Link>
              <hr className="my-2" />
              {address}
              <br/>
              <RestaurantOrderSetting outlet={outlet} />
              <br />
              <RestaurantTag outlet={outlet} />
            </div>
        </div>
      </div>
    );
  }
}