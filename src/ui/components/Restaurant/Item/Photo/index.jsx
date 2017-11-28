import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
// import classNames from "classnames";

import RestaurantOrderSetting from "~/ui/components/Restaurant/OrderSetting";
import RestaurantTag from "~/ui/components/Restaurant/Tag";
// import MenuItem from "~/ui/components/Menu/Item";
import Image from "~/ui/components/Image";

import "./index.css";

@translate("translations")
export default class RestaurantItemPhoto extends Component {
  static propTypes = {
    restaurant: PropTypes.object,
    uuid: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    logo: PropTypes.string
  };

  render() {
    const { t, name, address, logo, restaurant, uuid, ...props } = this.props;
    return (
      <div className="col-sm-6 col-12 my-3" {...props}>
        <div className="media rounded ">
          <div className="w-150">
            <Link to={`/restaurant/${restaurant.slug || uuid}`}>
              <Image
                className="media-image d-flex mr-3 rounded"
                fallbackSrc="//placehold.it/120"
                src={logo}
                alt=""
                width={120}
              />
            </Link>
          </div>
          <div className="media-body w-100">
            <div className="d-flex flex-column justify-content-between mh-120">
              <div>
                <Link
                  to={`/restaurant/${restaurant.slug || uuid}`}
                  className="color-black-300"
                >
                  <h5>{name}</h5>
                </Link>
                <hr className="my-2" />
                {address && <div>{address}</div>}
                <RestaurantOrderSetting outlet={restaurant} />
              </div>
              <RestaurantTag className="my-1" outlet={restaurant} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
