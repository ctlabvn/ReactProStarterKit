import React, { Component } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { translate } from "react-i18next";

//import Image from "~/ui/components/Image";

import { parseJsonToObject, getTodayString, getOrderSetting } from "~/utils";
import "./index.css";

@translate("translations")
export default class RestaurantInfo extends Component {
  static propTypes = {
    outlet: PropTypes.object,
    displayName: PropTypes.bool
  };

  static defaultProps = {
    displayName: false
  };

  formatCurrency = (price, symbol = "₫") => {
    const { t } = this.props;
    return t("format.currency", {
      price: price,
      symbol: symbol
    });
  };

  render() {
    const { t, i18n, outlet, displayName, ...props } = this.props;
    let metadata = [];
    if (outlet) {
      // if (outlet.address) {
      //   metadata.push(outlet.address);
      // }
      if (outlet.phone) {
        metadata.push(outlet.phone);
      }

      if (
        outlet.online_order_setting &&
        outlet.online_order_setting.hours_open
      ) {
        const workingTime = parseJsonToObject(
          outlet.online_order_setting.hours_open
        );
        const todayString = getTodayString();
        const hoursOpendata = workingTime[todayString.toString().toUpperCase()];
        if (hoursOpendata && hoursOpendata.open) {
          metadata.push(
            `${hoursOpendata.from.time} - ${hoursOpendata.to.time}`
          );
        } else {
          metadata.push(t("LABEL.RESTAURANT_CLOSED"));
        }
      }

      // get order setting string
      metadata = metadata.concat(getOrderSetting(outlet));
    }

    return (
      <div {...props}>
        {displayName && (
          <Link
            className="color-black-300 mr-2 restaurant-info"
            to={`/${outlet.outlet_uuid}`}
          >
            {outlet.name}
          </Link>
        )}

        {metadata.map((item, i) => [
          displayName || i !== 0 ? (
            <span key="seperate" className="color-grey restaurant-info mr-2">
              |
            </span>
          ) : null,
          <span key="content" className="color-grey restaurant-info mr-2">
            {item}
          </span>
        ])}
      </div>
    );
  }
}
