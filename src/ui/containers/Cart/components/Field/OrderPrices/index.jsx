import React, { Component } from "react";
import { translate } from "react-i18next";
import classNames from "classnames";

import { calculateOrderPrice } from "~/utils";

@translate("translations")
export default class extends Component {
  renderCurrency(label, price, className, symbol = "₫") {
    const { t } = this.props;
    return (
      <h6
        className={classNames(
          "text-uppercase mb-4 d-flex justify-content-between",
          className
        )}
      >
        <span>{label}</span>
        <span>
          {t("format.currency", {
            price,
            symbol
          })}
        </span>
      </h6>
    );
  }

  render() {
    const { input, orderItems, orderInfo, t } = this.props;
    const orderPrices = calculateOrderPrice(orderItems, {
      ...orderInfo,
      order_type: input.value
    });

    // should get from restaurant
    const currency_symbol = orderInfo.currency
      ? orderInfo.currency.symbol
      : orderItems[0].currency_symbol;
    return (
      <div>
        {this.renderCurrency(
          t("LABEL.SUBTOTAL"),
          orderPrices.subtotal,
          "color-gray",
          currency_symbol
        )}
        {!!orderPrices.discount &&
          this.renderCurrency(
            t("LABEL.DISCOUNT"),
            orderPrices.discount,
            "color-gray",
            currency_symbol
          )}
        {!!orderPrices.fee &&
          this.renderCurrency(
            t("LABEL.DELIVERY_FEE"),
            orderPrices.fee,
            "color-gray",
            currency_symbol
          )}
        {!!orderPrices.tax &&
          this.renderCurrency(
            t("LABEL.TAX"),
            orderPrices.tax,
            "color-gray",
            currency_symbol
          )}
        {this.renderCurrency(
          t("LABEL.TOTAL_PRICE"),
          orderPrices.total,
          "color-black",
          currency_symbol
        )}
      </div>
    );
  }
}
