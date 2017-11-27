import React, { Component } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { translate } from "react-i18next";

//import Image from "~/ui/components/Image";

import { getTodayString } from "~/store/utils/datetime";
import { parseJsonToObject } from "~/store/utils/json";
import './index.css';

@translate('translations')
export default class RestaurantInfo extends Component {
  static propTypes = {
    outlet: PropTypes.object,
    displayName: PropTypes.bool,
  };

  static defaultProps = {
    displayName: false,
  }

  formatCurrency = (price, symbol = "₫") => {
    const { t } = this.props;
    return t("format.currency", {
      price: price,
      symbol: symbol
    });
  }

  render() {
    const { t, outlet, displayName, ...props } = this.props;
    const metadata = [];
    if (outlet) {
      if (outlet.address) {
        metadata.push(outlet.address);
      }
      if (outlet.phone) {
        metadata.push(outlet.phone);
      }

      if (outlet.online_order_setting && outlet.online_order_setting.hours_open) {
        const workingTime = parseJsonToObject(outlet.online_order_setting.hours_open);
        const todayString = getTodayString();
        const hoursOpendata = workingTime[todayString.toString().toUpperCase()];
        if (hoursOpendata && hoursOpendata.open){
          metadata.push(`${hoursOpendata.from} - ${hoursOpendata.to}`);
        } else {
          metadata.push(t('LABEL.RESTAURANT_CLOSED'));
        }
      }

      const {online_order_setting:setting} = outlet;

      if (setting) {
        if (setting.do_delivery) {
          metadata.push(t('LABEL.DELIVERY'));
        }
        if (setting.do_takeaway) {
          metadata.push(t('LABEL.TAKEAWAY'));
        }

        // display this for delivery only
        if (setting.do_delivery) {
          if (setting.min_delivery_cost) {
            metadata.push(t('LABEL.MIN_ORDER') + ' ' + this.formatCurrency(setting.min_delivery_cost));
          }
          if (setting.max_delivery_cost) {
            metadata.push(t('LABEL.MAX_ORDER') + ' ' + this.formatCurrency(setting.max_delivery_cost));
          }
          if (setting.delivery_fee) {
            metadata.push(t('LABEL.DELIVERY_FEE') + ' ' + this.formatCurrency(setting.delivery_fee));
          }
        }
      }
    }

    return (
      <div>
        <span className="restaurant-info" {...props}>
          {displayName &&
          <Link className="color-black-300 mr-2" to={`/restaurant/${outlet.outlet_uuid}`}>{outlet.name}</Link>
          }
			  </span>
        {metadata.map((item, i) => ([
          displayName || i !== 0 ? <span key="seperate" className="restaurant-info mr-2">|</span> : null,
          <span key="content" className="restaurant-info mr-2" {...props}>
          {item}
          </span>
        ]))}
      </div>
    );
  }
}