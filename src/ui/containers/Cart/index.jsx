import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
// import classNames from "classnames";

import { Helmet } from "react-helmet";

// redux form
import {
  Field,
  Fields,
  // FieldArray,
  reduxForm,
  SubmissionError
} from "redux-form";

// reactstrap
import {
  Button,
  // FormGroup,
  // Label,
  // Input,
  // DropdownItem,
  Alert
} from "reactstrap";

// import { DirectionsRenderer, Marker } from "react-google-maps";

// components
import { InputField } from "~/ui/components/ReduxForm";
import CardList from "./components/CardList";
import RequestTimeField from "./components/Field/RequestTime";
import OrderTypeField from "./components/Field/OrderType";
import OrderPricesField from "./components/Field/OrderPrices";
import DirectionGmapField from "./components/Field/DirectionGmap";
// import GoogleMapKey from "~/ui/components/GoogleMapKey";
// import Autocomplete from "~/ui/components/Autocomplete";
import ButtonRound from "~/ui/components/Button/Round";

import * as orderSelectors from "~/store/selectors/order";
import * as orderActions from "~/store/actions/order";
// import { GOOGLE_API_KEY } from "~/store/constants/api";
// import { fetchJson } from "~/store/api/common";
import { history } from "~/store";

import {
  ORDER_TYPE,
  parseJsonToObject,
  calculateOrderPrice
  // getCurrentLocation
} from "~/utils";

import { validate, getOrderTypeValue } from "./utils";

import "./index.css";

@translate("translations")
@connect(
  state => ({
    orderItems: orderSelectors.getItems(state),
    orderInfo: orderSelectors.getInfo(state),
    initialValues: { ...orderSelectors.getInfo(state), order_note: ""}
  }),
  orderActions
)
// do not allow enableReinitialize because we will update state from components inside
@reduxForm({
  form: "Checkout",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: false
})
export default class extends Component {
  constructor(props) {
    super(props);
    this.directions = null;

    // this.props.updateOrder({
    //   restaurant_lat:21.0687001,
    //   restaurant_long:105.82295049999993,
    // });

    this.orderTypes = [];
    props.orderInfo.do_takeaway &&
      this.orderTypes.push({ id: ORDER_TYPE.TAKE_AWAY, title: "Take away" });
    props.orderInfo.do_delivery &&
      this.orderTypes.push({ id: ORDER_TYPE.DELIVERY, title: "Delivery" });
  }

  saveOrderInfo = data => {
    const { orderInfo, orderItems, t } = this.props;
    let travel_time = 0;
    if (!data.order_type) {
      data.order_type = ORDER_TYPE.DELIVERY;
    }
    if (data.order_type === ORDER_TYPE.DELIVERY && this.directions) {
      const { duration, distance } = this.directions.routes[0].legs[0];
      travel_time = duration.value / 60;
      if (
        +orderInfo.delivery_distance &&
        1000 * +orderInfo.delivery_distance < distance.value
      ) {
        throw new SubmissionError({
          _error: t("LABEL.DISTANCE_TOO_FAR")
        });
      }
    }

    if (!data.request_time) {
      throw new SubmissionError({
        _error: "Can not delivery due to time!"
      });
    }

    const orderPrices = calculateOrderPrice(orderItems, orderInfo);

    if (
      orderInfo.min_delivery_cost &&
      orderPrices.total < orderInfo.min_delivery_cost
    ) {
      throw new SubmissionError({
        _error: t("LABEL.PRICE_TOO_LOW")
      });
    }
    if (
      orderInfo.max_delivery_cost &&
      orderPrices.total > orderInfo.max_delivery_cost
    ) {
      throw new SubmissionError({
        _error: t("LABEL.PRICE_TOO_HIGH")
      });
    }

    this.props.updateOrder({ ...data, travel_time });
    history.push("/checkout");
  };

  // componentDidMount() {
  //   const { orderInfo } = this.props;
  //   if (!orderInfo.order_lat && !orderInfo.order_lat) {
  //     this.loadAddressFromGmap();
  //   }
  // }

  handleReceiveAddress = (order_lat, order_long, order_address) => {
    this.props.updateOrder({
      order_lat,
      order_long,
      order_address
    });
  };

  renderTimePicker = ({ request_time, order_type }) => {
    const { orderInfo, t } = this.props;

    const orderTypeValue = getOrderTypeValue(
      order_type.input.value,
      this.orderTypes
    );

    const hoursRange = parseJsonToObject(
      orderTypeValue === ORDER_TYPE.TAKE_AWAY
        ? orderInfo.hours_takeaway
        : orderInfo.hours_delivery
    );

    return (
      <div className="d-md-flex justify-content-between">
        <OrderTypeField
          checkedValue={orderTypeValue}
          orderTypes={this.orderTypes}
          {...order_type}
        />
        <div style={{display: "none"}}>
          <RequestTimeField
            label={t(
            orderTypeValue === ORDER_TYPE.DELIVERY
              ? "LABEL.DELIVERY"
              : "LABEL.TAKEAWAY"
          )}
            hoursRange={hoursRange}
            {...request_time}
          />
        </div>
      </div>
    );
  };

  render() {
    const {
      orderItems,
      t,
      handleSubmit,
      // change,
      // submitting,
      orderInfo,
      clearItems,
      error
      // initialValues: { order_type }
    } = this.props;

    if (!orderItems || !orderItems.length) {
      return (
        <div className="text-center p-2">
          <img src="/images/no-data.png" height="100" alt="" />
          <p className="color-gray text-uppercase">
            {t("LABEL.SHOPPING_CART_EMPTY")}
          </p>
        </div>
      );
    }

    //consumer_discounts

    return (
      <div className="container">
        <Helmet>
          <title>{t("LABEL.YOUR_CART")}</title>
          <meta name="description" content={t("LABEL.YOUR_CART")} />
        </Helmet>

        <div className="block bg-white box-shadow p-0">
          <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
            <a
              role="button"
              onClick={history.goBack}
              className="breadcrumb-item color-gray-400"
            >
              &lt; {t("LINK.BACK")}
            </a>
          </nav>

          <h2 className="w-100 text-uppercase font-weight-bold color-black d-flex">
            {t("LABEL.YOUR_CART")}
            <ButtonRound className="ml-4" onClick={clearItems} icon="times" />
          </h2>

          <CardList />

          <div className="row border p-2 no-gutters">
            <div className="col-md-6 pr-md-4">
              <Fields
                names={["order_type", "request_time"]}
                component={this.renderTimePicker}
              />
              <Fields
                names={["order_type", "order_address"]}
                orderTypes={this.orderTypes}
                orderInfo={orderInfo}
                orderItems={orderItems}
                onReceiveAddress={this.handleReceiveAddress}
                onReceiveDirections={directions =>
                  (this.directions = directions)}
                component={DirectionGmapField}
              />
            </div>

            <div className="col">
              <h6 className="color-gray text-uppercase mb-4">
                {t("LABEL.ADD_NOTE")}
              </h6>
              <Field
                name="order_note"
                type="textarea"
                className="w-100 border-gray-300"
                component={InputField}
              />

              <Field
                orderInfo={orderInfo}
                orderItems={orderItems}
                name="order_type"
                component={OrderPricesField}
              />
              {
                // <Field
                //   placeholder={t("PLACEHOLDER.TYPE_YOUR_PROMO_CODE")}
                //   className="custom-input text-uppercase"
                //   name="order_promotion_code"
                //   component={InputField}
                // />
              }
            </div>
          </div>

          <div className="my-4 row no-gutters justify-content-end">
            <Button
              className="bg-red col-md-3 btn-lg btn-block text-uppercase border-0"
              onClick={handleSubmit(this.saveOrderInfo)}
            >
              {t("BUTTON.PAY_NOW")}
            </Button>
          </div>

          {error && <Alert color="danger">{error}</Alert>}
        </div>
      </div>
    );
  }
}
