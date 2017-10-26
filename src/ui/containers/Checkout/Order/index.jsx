import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { translate } from "react-i18next";

@translate("translations")
export default class extends Component {
  render() {
    const { orderItems, t } = this.props;
    const orderItemsWithTotalPrice = orderItems.map(item => ({
      ...item,
      totalPrice: item.quantity * item.price
    }));
    const totalPrice = orderItemsWithTotalPrice.reduce(
      (a, item) => a + item.totalPrice,
      0
    );
    return (
      <div>
        <h4>{t("LABEL.YOUR_ORDER")}</h4>
        {orderItemsWithTotalPrice.map(item => (
          <div className="d-flex justify-content-start" key={item.item_uuid}>
            <div className="p-2">{item.quantity}x</div>
            <div className="p-2">{item.name}</div>
            <div className="ml-auto p-2">
              {t("format.currency", {
                price: item.totalPrice,
                symbol: item.currency_symbol
              })}
            </div>
          </div>
        ))}
        {orderItemsWithTotalPrice[0] && (
          <dl className="d-flex justify-content-start">
            <dt className="p-2 text-uppercase">{t("LABEL.TOTAL")}</dt>
            <dd className="ml-auto p-2 font-weight-bold">
              {t("format.currency", {
                price: totalPrice,
                symbol: orderItemsWithTotalPrice[0].currency_symbol
              })}
            </dd>
          </dl>
        )}
      </div>
    );
  }
}