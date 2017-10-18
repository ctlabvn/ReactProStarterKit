import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

import api from "~/store/api";
import "./index.css";
import options from "./options";

@translate('translations')
export default class extends Component {
  render() {
    const { t, outlet } = this.props;
    return (
      <div className="row block bg-white mb-4 tab-content">
        <h3 className="font-largest color-black w-100 mb-4">
          <span className="font-weight-bold">{t('LABEL.FEES')}</span>
        </h3>
        <p>{outlet.online_order_setting.delivery_fee}</p>

        <h3 className="font-largest color-black w-100 mb-4">
          <span className="font-weight-bold">{t('LABEL.MIN_MAX_ORDER_AMOUNT')}</span>
        </h3>
        <p>Min: {outlet.online_order_setting.min_delivery_cost}</p>
        <p>Max: {outlet.online_order_setting.max_delivery_cost}</p>

        <h3 className="font-largest color-black w-100 mb-4">
          <span className="font-weight-bold">{t('LABEL.DELIVERING_HOURS')}</span>
        </h3>
        <p>{outlet.online_order_setting.hours_delivery}</p>

        <h3 className="font-largest color-black w-100 mb-4">
          <span className="font-weight-bold">{t('LABEL.LOCAL_MAP')}</span>
        </h3>
        <p>{outlet.lat}</p>
        <p>{outlet.long}</p>
      </div>
    );
  }
}