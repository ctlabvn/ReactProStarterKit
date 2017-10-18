import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";

// reactstrap
import { Table, Button } from "reactstrap";

// components
import CardItem from "../CardItem";
import * as orderSelectors from "~/store/selectors/order";
import * as orderActions from "~/store/actions/order";

@translate("translations")
@connect(
  state => ({
    orderItems: orderSelectors.getItems(state)
  }),
  orderActions
)
export default class extends Component {

  increaseOrder(item) {
    this.props.updateOrderItem({ ...item, quantity: item.quantity + 1 });
  }

  decreaseOrder(item) {
    this.props.updateOrderItem({ ...item, quantity: item.quantity - 1 });
  }

  removeOrder(item) {
    this.props.removeOrderItem(item);
  }

  render() {
    const { orderItems, t } = this.props;
    return (
      <Table className="mt-4 text-uppercase table-fixed">
        <thead className="color-gray">
          <tr>
            <th className="pl-0 w-25">{t("TABLE.ITEM")}</th>
            <th>{t("TABLE.UNIT_PRICE")}</th>
            <th>{t("TABLE.QUANTITY")}</th>
            <th>Vat</th>
            <th>{t("TABLE.TOTAL")}</th>
            <th className="text-center">{t("TABLE.DELETE")}</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map(item => (
            <CardItem
              key={item.item_uuid}
              title={item.name}
              image="/images/donut-square.png"
              vat={0}
              price={item.price}
              priceUnit={item.currency_symbol}
              quantity={item.quantity}
              onIncrease={() => this.increaseOrder(item)}
              onDecrease={() => this.decreaseOrder(item)}
              onRemove={() => this.removeOrder(item)}
            />
          ))}
        </tbody>
      </Table>
    );
  }
}