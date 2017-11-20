import React, { Component } from "react";
import classNames from "classnames";
// import {
//   Button, Form, FormGroup, Label, Input, FormText
// } from "reactstrap";
import { translate } from "react-i18next";

import { calculateOrderPrice, getItemPrice } from "~/utils";

@translate("translations")
export default class extends Component {
  renderCurrency(label, price, className, symbol = "₫") {
    const { t } = this.props;
    return (
      <dl
        className={classNames("d-flex justify-content-start mb-0", className)}
      >
        <dt className="p-2">{label}</dt>
        <dd className="ml-auto p-2 font-weight-bold">
          {t("format.currency", {
            price,
            symbol
          })}
        </dd>
      </dl>
    );
  }

  render() {
    const { orderItems, orderInfo, t, ...props } = this.props;

    const orderPrices = calculateOrderPrice(orderItems, orderInfo);
    const currency_symbol = orderItems[0].currency_symbol;

    const orderItemsWithTotalPrice = orderItems.map(item => ({
      ...item,
      totalPrice: item.quantity * item.price
    }));

    return (
      <div {...props}>
        <h4>{t("LABEL.YOUR_ORDER")}</h4>
        {orderItemsWithTotalPrice.map(item => (
          <div
            className="d-flex justify-content-start w-100"
            key={item.item_uuid}
          >
            <div className="p-2">{item.quantity}x</div>
            <div className="p-2">
              {item.name}
              {item.item_options &&
                item.item_options.map(item_option => (
                  <small
                    className="mt-2 color-black-300 w-100 float-left"
                    key={item_option.option_uuid}
                  >
                    (+1){" "}
                    <span>{item_option.name}</span>
                  </small>
                ))}
            </div>
            <div className="ml-auto p-2 color-red">
              {t("format.currency", {
                price: getItemPrice(item),
                symbol: item.currency_symbol
              })}
            </div>
          </div>
        ))}

        <hr />

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
            t("LABEL.DELIVERY_FREE"),
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