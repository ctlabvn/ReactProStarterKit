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

import { ORDER_STATUS, ORDER_TYPE } from "~/ui/utils";

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

  render() {
    const { t, order, collapse, ...props } = this.props;
    return (
      <div {...props}>
        <div
          style={{ cursor: "pointer" }}
          onClick={this.toggle}
          className="w-100 p-2  d-flex justify-content-between align-items-center"
        >
          <span className="col-2">
            {ORDER_STATUS.getString(order.order.status)}
          </span>

          <span className="col-2">
            {ORDER_TYPE.getString(order.order.order_type)}
          </span>

          <Link
            className="font-weight-bold col-4 color-black-300"
            to={`/restaurant/${order.outlet.uuid}`}
          >
            {order.outlet.name}
          </Link>

          <span className="col-2">{order.order.created_at}</span>

          <span className="col d-flex flex-row align-items-center color-red">
            {t("format.currency", {
              price: order.order.price,
              symbol: order.outlet.currency.symbol
            })}
            <ButtonRound
              className="ml-4"
              icon={this.state.collapse ? "chevron-down" : "chevron-up"}
            />
          </span>
        </div>
        {!this.state.collapse && <hr />}
        <Collapse
          className={classNames(
            "p-2 flex-wrap",
            this.state.collapse ? "invisible" : "d-flex"
          )}
          isOpen={!this.state.collapse}
        >
          <div className="d-flex col-md-12 justify-content-between font-largest">
            <div>
              <strong>{ORDER_TYPE.getString(order.order.order_type)}</strong>
              <br />
              <span className="float-left font-medium">{order.order.uuid}</span>
            </div>

            <strong className="color-red">
              {t("format.currency", {
                price: order.order.total,
                symbol: order.outlet.currency.symbol
              })}
            </strong>
          </div>

          <div className="d-flex col-md-12 mt-4 mb-4 justify-content-between">
            <span>{order.order.created_at}</span>
            <span>{this.getDatetimeOfOrder(order.order)}</span>
          </div>

          <strong className="col-12 border-bottom mb-4">
            {order.outlet.name}
          </strong>

          {order.items.map(item => (
            <div className="d-flex flex-column mb-4 col-md-3" key={item.id}>
              <Link className="color-black-300" to={`/item/${item.id}`}>
                <Image width="100%" alt="..." src={item.image.url_thumb} />

                <div className="color-black-300 mt-2">
                  <span className="w-100 float-left">
                    ({item.qty}x) {item.name}
                  </span>
                  {item.options &&
                    item.options.breakdown.map((item, index) => (
                      <span
                        key={index}
                        className="w-100 float-left color-gray-300"
                      >
                        + ({item.qty}x) {item.name}
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
        </Collapse>
      </div>
    );
  }
}