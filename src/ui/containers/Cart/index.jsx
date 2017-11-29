import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import classNames from "classnames";

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

import {
  ORDER_TYPE,
  parseJsonToObject,
  calculateOrderPrice,
  getCurrentLocation
} from "~/utils";

import { validate } from "./utils";

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
      predictions: [],
      overlay: null
    };

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
    const { orderInfo, orderItems, t } = this.props;
    const { directions } = this.state;
    let travel_time = 0;
    if (!data.order_type) {
      data.order_type = ORDER_TYPE.DELIVERY;
    }
    if (data.order_type === ORDER_TYPE.DELIVERY && directions) {
      const { duration, distance } = directions.routes[0].legs[0];
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
    const { orderInfo, t } = this.props;
    const originLat = +orderInfo.restaurant_lat;
    const originLong = +orderInfo.restaurant_long;
    if (lat && long && originLat && originLong) {
      this.directionsService.route(
        {
          origin: new this.Maps.LatLng(originLat, originLong),
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
    } else {
      this.setState({
        overlay: t("LABEL.NOT_DETERMINE_ROUTE")
      });
    }
  }

  componentDidMount() {
    const { orderInfo } = this.props;
    if (!orderInfo.order_lat && !orderInfo.order_lat) {
      this.loadAddressFromGmap();
    }
  }

  getOrderTypeValue(input) {
    return this.orderTypes.length === 1
      ? this.orderTypes[0].id
      : input.value || ORDER_TYPE.DELIVERY;
  }

  renderAddressLabel(label, address) {
    return (
      <h6 className="color-gray text-uppercase mb-4 w-100">
        {label}:
        <span className="color-gray-400 ml-2">{address}</span>
      </h6>
    );
  }

  renderAddress = ({ order_type, order_address, directions, predictions }) => {
    const {
      t,
      orderInfo
      // error
    } = this.props;
    const position = {
      lat: +orderInfo.restaurant_lat,
      lng: +orderInfo.restaurant_long
    };

    const orderTypeValue = this.getOrderTypeValue(order_type.input);

    return (
      <div>
        {this.renderAddressLabel(
          t("LABEL.BUSINESS_ADDRESS"),
          orderInfo.restaurant_address
        )}

        {orderTypeValue === ORDER_TYPE.DELIVERY && (
          <div>
            {this.renderAddressLabel(
              t("LABEL.ADDRESS"),
              orderInfo.order_address
            )}

            <div className="mb-2 d-flex justify-content-between">
              <Autocomplete
                className="w-100"
                placeholder={t("PLACEHOLDER.TYPE_YOUR_ADDRESS")}
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
                {t("LABEL.MAP")}
              </Button>
            </div>

            <GoogleMapKey
              onItemRef={this.initGmap}
              height={400}
              defaultCenter={position}
            >
              {directions ? (
                <DirectionsRenderer directions={directions} />
              ) : position.lat && position.lng ? (
                <Marker position={position} />
              ) : (
                <span className="w-100 text-center text-danger vertical-center">
                  Can not address the location of business
                </span>
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
    const { orderInfo, t } = this.props;

    const orderTypeValue = this.getOrderTypeValue(order_type.input);

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

    const { directions, predictions } = this.state;
    const orderPrices = calculateOrderPrice(orderItems, orderInfo);
    const currency_symbol = orderItems[0].currency_symbol;

    return (
      <div className="container">
        <Helmet>
          <title>{t("LABEL.YOUR_CART")}</title>
          <meta name="description" content={t("LABEL.YOUR_CART")} />
        </Helmet>

        <div className="block bg-white box-shadow p-0">
          <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
            <Link to="/" className="breadcrumb-item color-gray-400" href="#">
              &lt; {t("LINK.BACK")}
            </Link>
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
                directions={directions}
                predictions={predictions}
                component={this.renderAddress}
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
                  t("LABEL.DELIVERY_FEE"),
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
