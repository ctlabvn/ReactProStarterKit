import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
// import classNames from "classnames";
import Readmore from "~/ui/components/Readmore";

import RestaurantOrderSetting from "~/ui/components/Restaurant/OrderSetting";
import RestaurantTag from "~/ui/components/Restaurant/Tag";
// import MenuItem from "~/ui/components/Menu/Item";
import Image from "~/ui/components/Image";
import RestaurantInfo from "~/ui/components/Restaurant/Info";

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
    this.imgId = "imgtest_" + uuid;
    return (
      <div className="col-sm-6 col-12 block restaurant-list-item" {...props}>
        <div className="d-flex">
          <Link to={`/${restaurant.slug || uuid}`} className="restaurant-list-item-img">
            <Image
              id={this.imgId}
              className="media-image"
              fallbackSrc="//placehold.it/120"
              src={logo}
              alt=""
            />
          </Link>
          <div className="w-100 ml-4 d-flex flex-column justify-content-between">
            <div>
              <Link
                to={`/${restaurant.slug || uuid}`}
                className="font-fr-120 color-cg-040 text-uppercase restaurant-list-item-slug"
              >
                {name}
              </Link>
              <div className="color-red restaurant-address font-fr-110">
                <span className="mr-2">
                  {restaurant.address ? restaurant.address : t("LABEL.NO_INFO")}
                </span>{" "}
                <span>-</span>{" "}
                <span>
                  <i
                    className="ml-2 fa fa-map-marker restaurant-location-icon"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <RestaurantInfo className="mt-1 font-fr-110 color-cg-074" outlet={restaurant} />
            </div>
            <RestaurantTag className="" outlet={restaurant} />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <div className="restaurant-list-item-img fake-img">
            <Image
              id={this.imgId}
              className="media-image rounded"
              fallbackSrc="//placehold.it/120"
              src={logo}
              alt=""
            />
          </div>
          <div className="w-100 ml-4 font-fr-110 color-cg-074 pt-2">
            <Readmore>
              <p dangerouslySetInnerHTML={{ __html: restaurant.description }} />
            </Readmore>
          </div>
        </div>
      </div>
    );
  }
}
