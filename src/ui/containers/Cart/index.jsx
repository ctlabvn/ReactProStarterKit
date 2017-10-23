import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import classNames from "classnames";

// redux form
import { Field, Fields, FieldArray, reduxForm } from "redux-form";

// reactstrap
import { Button, FormGroup, Label, Input, DropdownItem } from "reactstrap";

import { DirectionsRenderer } from "react-google-maps";

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

import "./index.css";

@translate("translations")
@connect(
  state => ({
    orderItems: orderSelectors.getItems(state),
    orderInfo: orderSelectors.getInfo(state),
    initialValues: orderSelectors.getInfo(state)
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
      predictions:[],
    };    
  }

  initGmap = (ref)=>{
    this.googleMap = ref;
    this.Maps = window.google.maps;
    this.directionsService = new this.Maps.DirectionsService();
    this.placeService = new this.Maps.places.AutocompleteService();
  };

  saveOrderInfo = data => {
    this.props.updateOrder(data);
    history.push("/checkout");
  };


  async componentWillMount() {
    const { latitude: lat, longitude: lng } = await getCurrentLocation();
    this.setState({
      lat,
      lng
    });
  }

  async loadAddressFromGmap(input) {
    // use guard code so do not have to remove } at the end
    this.loadingIcon.classList.remove("invisible");
    const { lat, lng } = this.state;
    const { results } = await fetchJson(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    this.loadingIcon.classList.add("invisible");
    input.onChange(results[0].formatted_address);

    this.loadDirectionFromGmap();
  }

  async loadDirectionFromGmap() {        
    this.directionsService.route(
      {
        origin: new this.Maps.LatLng(41.85073, -87.65126),
        destination: new this.Maps.LatLng(41.85258, -87.65141),
        travelMode: this.Maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === this.Maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  renderAddress = ({ order_type, order_address }) => {
    const { t } = this.props;
    const { directions, predictions } = this.state;
    if (order_type.input.value !== 2) {
      return null;
    }
    return (
      <div className="col-md-6 pl-0">
        <h6 className="color-gray text-uppercase mb-4 w-100">
          {t("LABEL.ADDRESS")}{" "}
          <span className="color-gray-400">(delivery only)</span>
          <Button
            color="info"
            onClick={() => this.loadAddressFromGmap(order_address.input)}
            className="float-right"
          >
            <i
              className="fa fa-refresh fa-spin mr-2 invisible"
              ref={ref => (this.loadingIcon = ref)}
            />
            Load from Googlemap
          </Button>
        </h6>
        <InputField          
          placeholder="Type your address here"
          className="w-100"
          {...order_address}
        />        

        <h6 className="color-gray text-uppercase mb-4 w-100">
          {t("LABEL.BUSINESS_ADDRESS")}
          <span className="color-gray-400 float-right">Hottab company</span>
        </h6>
      </div>
    );
  };

  renderTimePicker = ({request_time, order_type}) => {
    const {orderInfo} = this.props;
    const orderTypes = []
    orderInfo.do_takeaway && orderTypes.push({id: 1, title: 'Take away'});
    orderInfo.do_delivery && orderTypes.push({id: 2, title: 'Delivery'});
    const hoursRange = parseJsonToObject(order_type.input.value === 1 ? orderInfo.hours_takeaway : orderInfo.hours_delivery);
    return(
      <div className="d-flex col-md-6 pl-0 justify-content-between">
        <OrderTypeField orderTypes={orderTypes} {...order_type} />
        <RequestTimeField hoursRange={hoursRange} {...request_time} />        
      </div>
    )
  };

  searchGoogleMap = (keywords) => {
    if(!keywords.length || this.isSearching)
      return
    this.isSearching = true;
    this.placeService.getQueryPredictions({ input: keywords }, (predictions, status)=>{      
      if (status === this.Maps.places.PlacesServiceStatus.OK) {
          this.setState({
            predictions,
          })
          
      } else {
        this.setState({
            predictions: [],
          })
      }
      this.isSearching = false;
    });
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
  

  render() {
    const {
      orderItems,
      t,
      handleSubmit,
      change,
      submitting,
      orderInfo,
      clearItems,
      initialValues: { order_type }
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

    const { lat, lng, directions, predictions } = this.state;
    const totalPrice = orderItems.reduce(
      (a, item) => a + item.quantity * item.price,
      0
    );
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

          <Fields names={["order_type", "request_time"]} component={this.renderTimePicker} />

          <CardList />

          <div className="row border p-2">
            <Fields
              names={["order_type", "order_address"]}
              component={this.renderAddress}
            />
            <div className="col pr-0">
              <Autocomplete onSearch={this.searchGoogleMap}>
                {predictions.map((prediction, index)=>
                  <DropdownItem onClick={()=>change("order_address", prediction.description)} key={index}>{prediction.description}</DropdownItem>
                )}
              </Autocomplete>

              {lat &&
                lng && (
                  <GoogleMapKey onItemRef={this.initGmap} height={400} defaultCenter={{ lat, lng }}>
                    {directions && (
                      <DirectionsRenderer directions={directions} />
                    )}
                  </GoogleMapKey>
                )}
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
          </div>

          <div className="mt-5 mb-4 d-flex w-100 justify-content-between">
            <div className="col-md-7 pl-0">
              <h6 className="color-gray text-uppercase mb-4">
                {t("LABEL.ADD_NOTE")}
              </h6>
              <Field
                name="order_note"
                type="textarea"
                className="w-100 h-75 border-gray-300"
                component={InputField}
              />
            </div>

            <div className="col-md-offset-1 col-md-4">
              {this.renderCurrency(
                "LABEL.SUBTOTAL",
                totalPrice,
                "color-gray",
                orderItems[0].currency_symbol
              )}
              {this.renderCurrency("Delivery free", 0, "color-gray")}
              {this.renderCurrency("Tax", 0, "color-gray")}
              {this.renderCurrency(
                "LABEL.TOTAL_PRICE",
                totalPrice,
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

              <Button
                className="btn bg-red btn-lg btn-block text-uppercase"
                onClick={handleSubmit(this.saveOrderInfo)}
              >
                {t("BUTTON.PAY_NOW")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}