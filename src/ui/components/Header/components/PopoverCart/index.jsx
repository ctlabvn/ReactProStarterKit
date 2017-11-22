import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
// import { connect } from "react-redux";
import { translate } from "react-i18next";

// reactstrap
import {
  // Button,
  Popover,
  PopoverHeader,
  PopoverBody
  // DropdownItem
} from "reactstrap";

// components
import ButtonRound from "~/ui/components/Button/Round";

import { VERSION } from "~/store/constants/api";

import { getItemPrice, calculateOrderPrice, ORDER_TYPE } from "~/utils";

import "./index.css";

@translate("translations")
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartOpen: false
    };
  }

  static propTypes = {
    onIncreaseOrder: PropTypes.func.isRequired,
    onDecreaseOrder: PropTypes.func.isRequired
  };

  toggle = () => {
    const { cartOpen } = this.state;
    document.querySelector("body").style.overflow = cartOpen
      ? "auto"
      : "hidden";
    this.setState({
      cartOpen: !cartOpen
    });
  };

  renderProductItem(item) {
    const { onIncreaseOrder, onDecreaseOrder, orderInfo, t } = this.props;
    return (
      <div key={item.item_uuid} className="border-bottom py-2">
        <div className="d-flex flex-row justify-content-start">
          <Link
            className="flex-column d-flex p-0 align-items-start"
            to={`/restaurant/${orderInfo.outlet_slug}/${item.slug ||
              item.item_uuid}`}
          >
            <strong className="text-truncate color-black-300">
              {item.name}
            </strong>
          </Link>

          {item.quantity > 0 && (
            <ButtonRound
              className="p-0 mr-1"
              icon="minus"
              onClick={() => onDecreaseOrder(item)}
            />
          )}
          <span>{item.quantity}</span>
          <ButtonRound
            className="p-0 mx-1"
            icon="plus"
            onClick={() => onIncreaseOrder(item)}
          />

          <span className="ml-auto color-red">
            {t("format.currency", {
              price: getItemPrice(item) * item.quantity,
              symbol: item.currency_symbol
            })}
          </span>
        </div>
        {item.item_options &&
          item.item_options.map(item_option => (
            <div key={item_option.option_uuid} className="mb-2 color-black-300">
              <small>(+1) {item_option.name}</small>
              {
                // <span className="ml-2 color-red">{t("format.currency", {
                //   price: item_option.price,
                //   symbol: item.currency_symbol
                // })}</span>
              }
            </div>
          ))}
        {
          //   item.description && (
          //   <div className="mb-2 color-gray">{item.description}</div>
          // )
        }
      </div>
    );
  }

  componentDidMount() {
    this.props.onItemRef && this.props.onItemRef(this);
  }

  renderCurrency(label, price, className, symbol = "₫") {
    const { t } = this.props;
    return (
      <dl
        className={classNames("d-flex justify-content-start mb-0", className)}
      >
        <dt>{label}</dt>
        <dd className="ml-auto color-red font-weight-bold">
          {t("format.currency", {
            price,
            symbol
          })}
        </dd>
      </dl>
    );
  }

  render() {
    const {
      t,
      orderItems,
      orderInfo,
      onItemRef,
      onIncreaseOrder,
      onDecreaseOrder,
      ...props
    } = this.props;

    const currency_symbol = orderItems.length
      ? orderItems[0].currency_symbol
      : null;
    const orderPrices = calculateOrderPrice(orderItems, orderInfo);

    return (
      <Popover
        isOpen={this.state.cartOpen}
        toggle={this.toggle}
        className="popover-cart box-shadow arrow-red border-0"
        {...props}
      >
        <PopoverHeader className="bg-red color-white text-center">
          {currency_symbol
            ? orderInfo.order_type === ORDER_TYPE.DELIVERY
              ? t("LABEL.DELIVERY")
              : t("LABEL.TAKEAWAY")
            : " "}
        </PopoverHeader>
        <PopoverBody className="p-2">
          {currency_symbol ? (
            <div>
              <div className="d-flex flex-column align-items-start border-bottom pb-2">
                {VERSION > 1 && <span>Time</span>}
                <Link
                  className="font-weight-bold color-black"
                  to={`/restaurant/${orderInfo.outlet_slug ||
                    orderInfo.outlet_uuid}`}
                >
                  {orderInfo.restaurant_name || "Restaurant name"}
                </Link>
                <span>
                  {orderInfo.order_type === ORDER_TYPE.DELIVERY
                    ? orderInfo.order_address
                    : orderInfo.restaurant_address}
                </span>
              </div>

              <div className="popover-cart-content">
                {orderItems.map(item => this.renderProductItem(item))}
              </div>

              <div className="mt-2">
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
                <Link
                  onClick={this.toggle}
                  className="py-2 border-top float-left w-100 mt-2 bg-transparent color-black-300 font-weight-bold text-uppercase text-center"
                  to="/cart"
                >
                  Process to checkout
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center p-2">
              <img src="/images/no-data.png" height="100" alt="" />
              <p className="color-gray text-uppercase">
                {t("LABEL.CART_EMPTY")}
              </p>
            </div>
          )}
        </PopoverBody>
      </Popover>
    );
  }
}
