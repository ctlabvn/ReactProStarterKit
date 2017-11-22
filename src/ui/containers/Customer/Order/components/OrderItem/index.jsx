import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import {
  // Row, Col,
  // Label, Button,
  Collapse
} from "reactstrap";

import ButtonRound from "~/ui/components/Button/Round";
import Image from "~/ui/components/Image";

import { ORDER_STATUS, ORDER_TYPE, slugify } from "~/utils";

@translate("translations")
export default class extends Component {
  static propTypes = {
    collapse: PropTypes.bool
  };

  static defaultProps = {
    collapse: true
  };

  constructor(props) {
    super(props);
    this.state = { collapse: props.collapse };
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  getDatetimeOfOrder(order) {
    switch (order.status) {
      case ORDER_STATUS.CANCELED:
        return order.cancel_reason.title;
      case ORDER_STATUS.CONFIRMED:
        return order.delivery_time;
      case ORDER_STATUS.PAID:
        return order.paid_at;
      default:
        return order.request_time;
    }
  }

  renderCurrency(label, price, className, symbol = "₫") {
    const { t } = this.props;
    return (
      <dl
        className={classNames(
          "d-flex justify-content-start mb-0 col-md-12",
          className
        )}
      >
        <dt className="py-2">{label}</dt>
        <dd className="ml-auto py-2 font-weight-bold color-red">
          {t("format.currency", {
            price,
            symbol
          })}
        </dd>
      </dl>
    );
  }

  render() {
    const { t, order, collapse, ...props } = this.props;
    const currency_symbol = order.outlet.currency.symbol;
    return (
      <div {...props}>
        <div
          style={{ cursor: "pointer" }}
          onClick={this.toggle}
          className="w-100 float-left d-md-flex justify-content-between align-items-center mb-2"
        >
          <span className="d-flex d-sm-none justify-content-between align-items-center row">
            <Link
              className="font-weight-bold color-black-300 "
              to={`/restaurant/${order.outlet.uuid}`}
            >
              {order.outlet.name}
            </Link>
            <ButtonRound
              className="float-right btn-sm"
              icon={this.state.collapse ? "chevron-down" : "chevron-up"}
            />
          </span>
          <span className="col-md-1 column" data-title="Status">
            {ORDER_STATUS.getString(order.order.status)}
          </span>

          <span className="col-md-2 column" data-title="Type">
            {ORDER_TYPE.getString(order.order.order_type)}
          </span>

          <Link
            className="d-md-block d-none font-weight-bold col-md-4 color-black-300 column"
            to={`/restaurant/${order.outlet.uuid}`}
          >
            {order.outlet.name}
          </Link>

          <span className="col-md-2 column" data-title="Date time">
            {order.order.created_at}
          </span>

          <span
            data-title="Amout"
            className="col d-md-flex flex-row align-items-center justify-content-between color-red column"
          >
            {t("format.currency", {
              price: order.order.total,
              symbol: currency_symbol
            })}
            <i
              className={`color-black d-none d-md-block fa fa-${this.state
                .collapse
                ? "chevron-down"
                : "chevron-up"}`}
            />
          </span>
        </div>

        {!this.state.collapse && <hr className="float-left w-100 mt-0" />}

        <Collapse
          className={classNames(
            "flex-wrap float-left",
            this.state.collapse ? "invisible" : "d-md-flex"
          )}
          isOpen={!this.state.collapse}
        >
          <div className="d-flex col-md-12 justify-content-between font-largest">
            <div>
              <strong>{ORDER_TYPE.getString(order.order.order_type)}</strong>
              <br />
              <span className="float-left font-medium">{order.order.uuid}</span>
            </div>

            {
              // <strong className="color-red">
              //   {t("format.currency", {
              //     price: order.order.total,
              //     symbol: order.outlet.currency.symbol
              //   })}
              // </strong>
            }
          </div>

          <div className="d-flex col-md-12 my-4 justify-content-between">
            <span>{order.order.created_at}</span>
            <span>{this.getDatetimeOfOrder(order.order)}</span>
          </div>

          <strong className="d-flex my-4 col-sm-12 border-bottom mb-4">
            {order.outlet.name}
          </strong>

          <div className="border-bottom d-md-flex">
            {order.items.map(item => (
              <div className="d-flex flex-column mb-4 col-md-3" key={item.id}>
                <Link
                  className="color-black-300"
                  to={`/restaurant/${slugify(order.outlet.name)}/${item.id}`}
                >
                  <Image width="100%" alt="" src={item.image.url_thumb} />

                  <div className="color-black-300 mt-2">
                    <span className="w-100 float-left">
                      ({item.qty || 1}x) {item.name}
                    </span>
                    {item.options &&
                      item.options.breakdown.map((item, index) => (
                        <span
                          key={index}
                          className="w-100 float-left color-gray-300"
                        >
                          + ({item.qty || 1}x) {item.name}
                        </span>
                      ))}
                    <span className="color-red">
                      {t("format.currency", {
                        price: item.total,
                        symbol: order.outlet.currency.symbol
                      })}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {this.renderCurrency(
            t("LABEL.SUBTOTAL"),
            order.order.price,
            "color-gray",
            currency_symbol
          )}
          {!!order.order.total_discount &&
            this.renderCurrency(
              t("LABEL.DISCOUNT"),
              order.order.total_discount,
              "color-gray",
              currency_symbol
            )}
          {!!order.order.delivery_fee &&
            this.renderCurrency(
              t("LABEL.DELIVERY_FREE"),
              order.order.delivery_fee,
              "color-gray",
              currency_symbol
            )}
          {!!order.order.total_tax &&
            this.renderCurrency(
              t("LABEL.TAX"),
              order.order.total_tax,
              "color-gray",
              currency_symbol
            )}

          {this.renderCurrency(
            t("LABEL.TOTAL_PRICE"),
            order.order.total,
            "color-black",
            currency_symbol
          )}
        </Collapse>
      </div>
    );
  }
}
