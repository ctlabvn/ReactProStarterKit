import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import classNames from "classnames";

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
  DropdownItem,
  Alert
} from "reactstrap";

import { DirectionsRenderer, Marker } from "react-google-maps";

// components
import { InputField } from "~/ui/components/ReduxForm";
import CardList from "./components/CardList";
import RequestTimeField from "./components/Field/RequestTime";
import OrderTypeField from "./components/Field/OrderType";
import GoogleMapKey from "~/ui/components/GoogleMapKey";
import Autocomplete from "~/ui/components/Autocomplete";
import ButtonRound from "~/ui/components/Button/Round";

import * as orderSelectors from "~/store/selectors/order";
import * as orderActions from "~/store/actions/order";
import { GOOGLE_API_KEY } from "~/store/constants/api";
import { fetchJson } from "~/store/api/common";
import { history } from "~/store";
import { getCurrentLocation } from "~/ui/utils";
import { validate } from "./utils";
import { parseJsonToObject } from "~/store/utils/json";

import options from "./options";

import "./index.css";


@translate("translations")
@connect(
  state => ({
    orderItems: orderSelectors.getItems(state),
    orderInfo: orderSelectors.getInfo(state),
    initialValues: { ...orderSelectors.getInfo(state) }
  }),
  orderActions
)
@reduxForm({
  form: "Checkout",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      predictions: []
    };

    // this.props.updateOrder({
    //   restaurant_lat:21.0687001,
    //   restaurant_long:105.82295049999993,
    // });
  }

  initGmap = ref => {
    this.googleMap = ref;
    this.Maps = window.google.maps;
    this.directionsService = new this.Maps.DirectionsService();
    this.placeService = new this.Maps.places.AutocompleteService();
    this.geocoder = new this.Maps.Geocoder();
    const { order_lat, order_long } = this.props.orderInfo;
    this.loadDirectionFromGmap(order_lat, order_long);
  };

  saveOrderInfo = data => {
    const { orderInfo } = this.props;
    const { directions } = this.state;
    const { duration } = directions.routes[0].legs[0];

    // if(!orderInfo.request_time){
    //   throw new SubmissionError({
    //     _error: 'Can not delivery due to time!',
    //   })
    // }

    if (
      orderInfo.delivery_distance &&
      1000 * +orderInfo.delivery_distance <
        directions.routes[0].legs[0].distance.value
    ) {
      throw new SubmissionError({
        _error: "Distance is too far!"
      });
    }

    const totalPrice = this.getTotalPrice();
    if (
      orderInfo.min_delivery_cost &&
      totalPrice < orderInfo.min_delivery_cost
    ) {
      throw new SubmissionError({
        _error: "Price is too low!"
      });
    }
    if (
      orderInfo.max_delivery_cost &&
      totalPrice > orderInfo.max_delivery_cost
    ) {
      throw new SubmissionError({
        _error: "Price is too high!"
      });
    }

    this.props.updateOrder({ ...data, travel_time: duration.value / 60 });
    history.push("/checkout");
  };

  getTotalPrice() {
    const { orderItems } = this.props;
    const totalPrice = orderItems.reduce(
      (a, item) => a + item.quantity * item.price,
      0
    );

    return totalPrice;
  }

  async loadAddressFromGmap() {
    // use guard code so do not have to remove } at the end
    this.loadingIcon.classList.remove("hidden");
    // const { lat, lng } = this.state;
    const { latitude: lat, longitude: lng } = await getCurrentLocation();
    const { results } = await fetchJson(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    this.loadingIcon.classList.add("hidden");
    this.props.updateOrder({
      order_lat: lat,
      order_long: lng,
      order_address: results[0].formatted_address
    });
    this.loadDirectionFromGmap(lat, lng);
  }

  async loadDirectionFromGmap(lat, long) {
    const { orderInfo } = this.props;
    // const { lat, lng } = this.state;    
    if (lat && long) {
      this.directionsService.route(
        {
          origin: new this.Maps.LatLng(+orderInfo.restaurant_lat, +orderInfo.restaurant_long),
          destination: new this.Maps.LatLng(lat, long),
          travelMode: this.Maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === this.Maps.DirectionsStatus.OK) {
            this.setState({
              directions: result
            });
          } else {
            console.error(
              `error fetching directions ${JSON.stringify(result)}`
            );
          }
        }
      );
    }
  }

  renderAddress = ({ order_type, order_address, directions, predictions }) => {
    const { t, orderInfo, error } = this.props;
    const position = {
      lat: +orderInfo.restaurant_lat,
      lng: +orderInfo.restaurant_long
    };

    return (
      <div className="col-md-6 pl-0">
        <h6 className="color-gray text-uppercase mb-4 w-100">
          {t("LABEL.BUSINESS_ADDRESS")}
          <span className="color-gray-400 float-right">
            {orderInfo.restaurant_address}
          </span>
        </h6>

        {order_type.input.value === options.orderTypes.DELIVERY && (
          <div>
            <h6 className="color-gray text-uppercase mb-4 w-100">
              {t("LABEL.ADDRESS")}{" "}
              <span className="color-gray-400 float-right">
                {orderInfo.order_address}
              </span>
            </h6>

            <div className="mb-2 d-flex justify-content-between">
              <Autocomplete
                className="w-100"
                placeholder="Type your address here"
                value={order_address.input.value}
                onSearch={this.searchGoogleMap}
              >
                {predictions.map(({ description }, index) => (
                  <DropdownItem
                    onClick={() => this.chooseAddress(description)}
                    key={index}
                  >
                    {description}
                  </DropdownItem>
                ))}
              </Autocomplete>

              <Button
                color="info"
                onClick={() => this.loadAddressFromGmap()}
                className="ml-2 float-right"
              >
                <i
                  className="fa fa-refresh fa-spin mr-2 hidden"
                  ref={ref => (this.loadingIcon = ref)}
                />
                Map
              </Button>
            </div>
            <GoogleMapKey
              onItemRef={this.initGmap}
              height={400}
              defaultCenter={position}
            >
              {directions ? (
                <DirectionsRenderer directions={directions} />
              ) : (
                <Marker position={position} />
              )}
            </GoogleMapKey>

            {directions && (
              <div className="d-flex flex-row justify-content-between mt-auto w-100">
                <span>
                  <strong>Distance:</strong>{" "}
                  {directions.routes[0].legs[0].distance.text}
                </span>
                <span>
                  <strong>Time estimated:</strong>
                  {directions.routes[0].legs[0].duration.text}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  renderTimePicker = ({ request_time, order_type }) => {
    const { orderInfo } = this.props;
    const orderTypes = [];
    orderInfo.do_takeaway &&
      orderTypes.push({ id: options.orderTypes.TAKE_AWAY, title: "Take away" });
    orderInfo.do_delivery &&
      orderTypes.push({ id: options.orderTypes.DELIVERY, title: "Delivery" });
    const hoursRange = parseJsonToObject(
      order_type.input.value === options.orderTypes.TAKE_AWAY
        ? orderInfo.hours_takeaway
        : orderInfo.hours_delivery
    );
    return (
      <div className="d-flex col-md-6 pl-0 justify-content-between">
        <OrderTypeField orderTypes={orderTypes} {...order_type} />
        <RequestTimeField
          label={
            order_type.input.value === options.orderTypes.DELIVERY
              ? "Delivery time"
              : "Take away time"
          }
          hoursRange={hoursRange}
          {...request_time}
        />
      </div>
    );
  };

  searchGoogleMap = keywords => {
    if (!keywords.length || this.isSearching) return;
    this.isSearching = true;
    this.placeService.getQueryPredictions(
      { input: keywords },
      (predictions, status) => {
        if (status === this.Maps.places.PlacesServiceStatus.OK) {
          this.setState({
            predictions
          });
        } else {
          this.setState({
            predictions: []
          });
        }
        this.isSearching = false;
      }
    );
  };

  renderCurrency(label, price, className, symbol = "₫") {
    const { t } = this.props;
    return (
      <h6
        className={classNames(
          "text-uppercase mb-4 d-flex justify-content-between",
          className
        )}
      >
        <span>{t(label)}</span>
        <span>
          {t("format.currency", {
            price,
            symbol
          })}
        </span>
      </h6>
    );
  }

  chooseAddress(description) {
    this.geocoder.geocode({ address: description }, (results, status) => {
      if (status === this.Maps.GeocoderStatus.OK) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        this.props.updateOrder({
          order_lat: lat,
          order_long: lng,
          order_address: description
        });
        this.loadDirectionFromGmap(lat, lng);
      }
    });
  }

  render() {
    const {
      orderItems,
      t,
      handleSubmit,
      change,
      submitting,
      orderInfo,
      clearItems,
      error,
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

    const { directions, predictions } = this.state;
    const totalPrice = this.getTotalPrice();

    return (
      <div className="container">
        <div className="block bg-white">
          <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
            <Link to="/" className="breadcrumb-item color-gray-400" href="#">
              &lt; {t("LINK.BACK")}
            </Link>
          </nav>

          <h2 className="w-100 text-uppercase font-weight-bold color-black d-flex">
            {t("LABEL.YOUR_CART")}
            <ButtonRound className="ml-4" onClick={clearItems} icon="times" />
          </h2>

          <Fields
            names={["order_type", "request_time"]}
            component={this.renderTimePicker}
          />

          <CardList />

          <div className="row border p-2">
            <Fields
              names={["order_type", "order_address"]}
              directions={directions}
              predictions={predictions}
              component={this.renderAddress}
            />
            <div className="col pr-0">
              <h6 className="color-gray text-uppercase mb-4">
                {t("LABEL.ADD_NOTE")}
              </h6>
              <Field
                name="order_note"
                type="textarea"
                className="w-100 border-gray-300"
                component={InputField}
              />

              {this.renderCurrency(
                "LABEL.SUBTOTAL",
                totalPrice,
                "color-gray",
                orderItems[0].currency_symbol
              )}
              {this.renderCurrency(
                "Delivery free",
                +orderInfo.delivery_fee,
                "color-gray"
              )}
              {this.renderCurrency(
                "Tax",
                +orderInfo.consumer_taxes,
                "color-gray"
              )}
              {this.renderCurrency(
                "LABEL.TOTAL_PRICE",
                totalPrice + orderInfo.delivery_fee + orderInfo.consumer_taxes,
                "color-black",
                orderItems[0].currency_symbol
              )}
              {
                // <Field
                //   placeholder="Enter promo code"
                //   className="custom-input text-uppercase"
                //   name="order_promotion_code"
                //   component={InputField}
                // />
              }
            </div>
          </div>

          <div className="mt-5 mb-4 d-flex w-100 justify-content-end">
            <Button
              className="bg-red w-25 btn-lg btn-block text-uppercase"
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