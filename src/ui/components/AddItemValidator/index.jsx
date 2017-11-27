import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import ModalConfirm from "~/ui/components/ModalConfirm";

import * as commonActions from "~/store/actions/common";
import * as orderActions from "~/store/actions/order";
import * as orderSelectors from "~/store/selectors/order";

import { slugify, ORDER_TYPE } from "~/utils";

@translate("translations")
@connect(
  state => ({
    orderItems: orderSelectors.getItems(state),
    orderInfo: orderSelectors.getInfo(state)
  }),
  { ...commonActions, ...orderActions }
)
export default class extends Component {
  constructor(props) {
    super(props);

    this.processingItem = null;
  }

  handleCancelModal = () => {
    this.modal.close();
  };

  handleConfirmModal = () => {
    this.props.clearItems();
    this.doAddOrderItem();
    this.modal.close();
  };

  doAddOrderItem = () => {
    // each time add order, we should update business info for sure
    const { outlet, updateOrder, addOrderItem } = this.props;
    updateOrder({
      ...outlet.online_order_setting,
      order_type: outlet.online_order_setting.do_delivery
        ? ORDER_TYPE.DELIVERY
        : ORDER_TYPE.TAKE_AWAY,
      restaurant_name: outlet.name,
      restaurant_address: outlet.address,
      restaurant_lat: outlet.lat,
      restaurant_long: outlet.long,
      outlet_slug: outlet.slug || slugify(outlet.name)
    });
    // then add current proccessing order
    addOrderItem(this.processingItem);
  };

  handleAddOrderItem = (item, item_options = []) => {
    const { orderInfo, orderItems, outlet, clearItems } = this.props;

    const {
      default_price,
      item_uuid,
      currency,
      name,
      description,
      slug
    } = item;
    this.processingItem = {
      item_uuid,
      item_options,
      price: default_price,
      quantity: 1,
      name,
      description,
      slug,
      currency_symbol: currency.symbol
    };

    if (orderInfo.outlet_uuid !== outlet.outlet_uuid) {
      // first time or reset
      if (orderItems.length) {
        if (!orderInfo.outlet_uuid) {
          clearItems();
        } else {
          // wait for modal actions
          this.modal.open();
          return;
        }
      } else {
        // just clear because it is empty
        clearItems();
      }
    }
    // add now
    this.doAddOrderItem();
  };

  componentDidMount() {
    this.props.onItemRef && this.props.onItemRef(this);
  }

  render() {
    const { t } = this.props;

    return (
      <ModalConfirm
        onItemRef={ref => (this.modal = ref)}
        onCancel={this.handleCancelModal}
        onOK={this.handleConfirmModal}
      >
        {t("LABEL.CONFIRM_REMOVE_ORDER")}
      </ModalConfirm>
    );
  }
}
