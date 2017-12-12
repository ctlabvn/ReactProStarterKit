import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";

// reactstrap
import { Table } from "reactstrap";

// components
import CardItem from "../CardItem";
import ModalConfirm from "~/ui/components/ModalConfirm";

import * as orderSelectors from "~/store/selectors/order";
import * as orderActions from "~/store/actions/order";

import { getItemPrice } from "~/utils";

@translate("translations")
@connect(
  state => ({
    orderInfo: orderSelectors.getInfo(state),
    orderItems: orderSelectors.getItems(state)
  }),
  orderActions
)
export default class extends Component {
  constructor(props) {
    super(props);

    this.selectedItem = null;
  }

  increaseOrder(item) {
    this.props.updateOrderItem({ ...item, quantity: item.quantity + 1 });
  }

  decreaseOrder(item) {
    this.props.updateOrderItem({ ...item, quantity: item.quantity - 1 });
  }

  setOrderQuantity(item, quantity) {
    const number = Number(quantity);
    if(typeof number !== 'number' || !Math.floor(number)) return;
    this.props.updateOrderItem({ ...item, quantity: number });
  }

  removeOrder(item) {
    this.selectedItem = item;
    this.modal.open();
  }

  handleCancelModal = () => {
    this.modal.close();
  };

  handleConfirmModal = () => {
    this.props.removeOrderItem(this.selectedItem);
    this.modal.close();
  };

  render() {
    const { orderItems, orderInfo, t } = this.props;
    return [
      <Table
        key="cartList"
        className="table-fixed table-responsive color-cg-074 text-center"
      >
        <thead className="font-fr-120 text-uppercase">
        <tr>
          <th className="your-cart-col-1 color-c-130 text-left pt-md-4"/>
          <th className="your-cart-col-2">{t("TABLE.UNIT_PRICE")}</th>
          <th className="your-cart-col-3">{t("TABLE.QUANTITY")}</th>
          <th className="your-cart-col-4 text-right">{t("TABLE.TOTAL")}</th>
          <th className="your-cart-col-5"/>
        </tr>
        <tr>
          <th className="your-cart-col-1 color-c-130 text-left pt-md-4">{t("TABLE.YOUR_CART")}</th>
          <th className="your-cart-col-2"/>
          <th className="your-cart-col-3"/>
          <th className="your-cart-col-4"/>
          <th className="your-cart-col-5"/>
        </tr>
        </thead>

        <tbody>
          {orderItems.map((item, index) => (
            <CardItem
              key={index}
              uuid={item.item_uuid}
              outlet_slug={orderInfo.outlet_slug}
              item_slug={item.slug || item.item_uuid}
              title={item.name}
              image="/images/donut-square.png"
              vat={0}
              price={getItemPrice(item)}
              options={item.item_options}
              priceUnit={item.currency_symbol}
              quantity={item.quantity}
              onIncrease={() => this.increaseOrder(item)}
              onDecrease={() => this.decreaseOrder(item)}
              onSetQuantity={(number) => this.setOrderQuantity(item, number)}
              onRemove={() => this.removeOrder(item)}
            />
          ))}
        </tbody>
      </Table>,
      <ModalConfirm
        key="modal"
        onItemRef={ref => (this.modal = ref)}
        onCancel={this.handleCancelModal}
        onOK={this.handleConfirmModal}
      >
        {t("LABEL.CONFIRM_REMOVE_CART_ITEM")}
      </ModalConfirm>
    ];
  }
}
