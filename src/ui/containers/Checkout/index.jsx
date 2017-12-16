/* eslint-disable */

import React, { Component } from "react";
import { translate } from "react-i18next";
// import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

import moment from "moment";

import {
  Row,
  Col,
  Button
  // Input,
} from "reactstrap";

// components
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import EmptyResult from "~/ui/components/EmptyResult";

// store
import * as commonActions from "~/store/actions/common";
import * as orderActions from "~/store/actions/order";
import * as orderSelectors from "~/store/selectors/order";
import * as authSelectors from "~/store/selectors/auth";
import { history } from "~/store";
// components
import Signup from "~/ui/components/Signup";
import Login from "~/ui/components/Login";
import Order from "./Order";
import { extractMessage, ORDER_TYPE, calculateOrderPrice, getItemPrice } from "~/utils";
import "./index.css";
// G-Map
import { DirectionsRenderer, Marker } from "react-google-maps";
import GoogleMapKey from "~/ui/components/GoogleMapKey";

import Checkbox from "~/ui/components/Checkbox";

@translate("translations")
@connect(
  state => ({
    isLogged: authSelectors.isLogged(state),
    // address: authSelectors.getAddress(state),
    customer: authSelectors.getCustomer(state),
    orderItems: orderSelectors.getItems(state),
    orderInfo: orderSelectors.getInfo(state),
    token: authSelectors.getToken(state)
  }),
  {...commonActions, ...orderActions}
)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      items: {}
    };
  }

  createOrder = async () => {
    const {
      customer,
      orderItems,
      orderInfo,
      // address,
      updateOrderHistory,
      requestor,
      clearItems,
      setToast,
      token
      } = this.props;
    // const addressItem = address.find(item=>item.cus_address_uuid === orderInfo.cus_address_uuid);
    const now = moment();
    const minutesOfNow = 0; //(now.hour() * 60 + now.minute());
    let minutesOfPreparation =
      orderInfo.request_time + orderInfo.preparation_time;
    if (orderInfo.order_type === ORDER_TYPE.DELIVERY) {
      minutesOfPreparation += +orderInfo.travel_time;
    }
    const request_time = 60 * (minutesOfPreparation - minutesOfNow);

    const detailAddress = this.detailAddress
      ? this.detailAddress.value.trim()
      : "";

    const customer_address =
      orderInfo.order_type === ORDER_TYPE.DELIVERY
        ? orderInfo.order_address + (detailAddress ? "\n" + detailAddress : "")
        : "take_away is optional"; //addressItem.address;

    const data = {
      items: orderItems.map(item => ({
        item_uuid: item.item_uuid,
        item_quantity: item.quantity,
        item_options: item.item_options.map(
          item_option => item_option.option_uuid
        )
      })),
      customer: {
        customer_uuid: customer.customer_uuid,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email,
        customer_address,
        customer_lat: orderInfo.order_lat,
        customer_long: orderInfo.order_long
      },
      // The request time for delivery in minutes.
      request_time,
      order_type: orderInfo.order_type || ORDER_TYPE.DELIVERY,
      order_note: orderInfo.order_note
    };
    // console.log(data);
    requestor("order/requestCreateOrder", token, data, (err, ret) => {
      if (!err) {
        // if success create order then clear all items
        clearItems();
        // force reload
        updateOrderHistory([]);
        history.push("/customer/order");
      } else {
        setToast(extractMessage(err.message), "danger");
        // console.log(setToast, extractMessage(err.message));
      }
    });
  };

  componentWillMount() {
    this.loadItems(this.props.orderItems);
  }

  updateOrderAddress({ cus_address_uuid }) {
    this.props.updateOrder({cus_address_uuid});
  }

  renderDeliveryAddress() {
    const { orderInfo, t } = this.props;
    return (
      <div className="w-100">
        <h4 className="text-center">{t("LABEL.DELIVERY_ADDRESS")}</h4>
        <strong>{orderInfo.order_address}</strong>
        <input
          placeholder={t("PLACEHOLDER.DETAIL_ADDRESS")}
          className="form-control"
          ref={ref => (this.detailAddress = ref)}
        />
      </div>
    );
  }

  renderTakeawayAddress() {
    return null;
    // const { address, orderInfo, t } = this.props;
    // return (
    // <div className="w-100">
    //     <h4 className="text-center">{t("LABEL.TAKEAWAY_ADDRESS")}</h4>
    //     <Menu className="list-group">
    //       {address.map((item) => (
    //         <MenuItem
    //           onClick={()=>this.updateOrderAddress(item)}
    //           title={`${item.name} - ${item.address}`}
    //           active={orderInfo.cus_address_uuid === item.cus_address_uuid}
    //           key={item.cus_address_uuid}
    //         />
    //       ))}
    //     </Menu>
    // </div>
    // );
  }

  renderHasAccount() {
    const { orderInfo, t } = this.props;

    return orderInfo.order_type === ORDER_TYPE.DELIVERY
      ? this.renderDeliveryAddress()
      : this.renderTakeawayAddress();
  }

  renderHasNoAccount() {
    const { t } = this.props;
    return (
      <div className="">
        <Login />

        {

        //  <h4 className="text-center">{t("LABEL.CREATE_ACCOUNT")}</h4>
        //  <Signup />
        //  <div className="position-relative w-100 mt-5">
        //  <hr />
        //  <Button
        //  color="secondary"
        //  className="bg-white btn-or position-center"
        //  outline
        //  >
        //{t("LABEL.OR")}
        //  </Button>
        //  </div>
        }
      </div>
    );
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

  async loadDirectionFromGmap(lat, long) {
    const { orderInfo, t } = this.props;
    const originLat = +orderInfo.restaurant_lat;
    const originLong = +orderInfo.restaurant_long;
    if (lat && long && originLat && originLong && this.directionsService) {
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
            this.props.onReceiveDirections &&
            this.props.onReceiveDirections(result);
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

  loadItem(outlet_slug, item_uuid) {
    const { requestor } = this.props;
    return new Promise(resolve => {
      requestor("restaurant/getItem", item_uuid, outlet_slug, async (err, data) => resolve(data));
    });
  }

  loadItems = async (orderItems) => {
    if(!orderItems) return;
    let items = {};
    for(let i = 0; i < orderItems.length; i++){
      const data = await this.loadItem(orderItems[i].slug, orderItems[i].item_uuid);
      if(!!data && !!data.data) items[data.data.item_uuid] = data.data;
    }
    this.setState({items})
  }

  render() {
    const { isLogged, orderItems, orderInfo, t , customer} = this.props;
    const { items } = this.state;

    if (!orderItems.length) {
      return <EmptyResult />;
    }

    const restaurant_name =
      orderInfo && orderInfo.restaurant_name
        ? orderInfo.restaurant_name
        : t("LABEL.NO_INFO");
    const restaurant_address =
      orderInfo && orderInfo.restaurant_address
        ? orderInfo.restaurant_address
        : t("LABEL.NO_INFO");
    const restaurant_phone =
      orderInfo && orderInfo.restaurant_phone
        ? orderInfo.restaurant_phone
        : t("LABEL.NO_INFO");

    const customer_phone =
      customer && customer.phone ? customer.phone : t("LABEL.NO_INFO");
    const customer_name =
      customer && customer.name ? customer.name : t("LABEL.NO_INFO");

    const { directions } = this.state;
    const position = {
      lat: +orderInfo.restaurant_lat,
      lng: +orderInfo.restaurant_long
    };

    const orderPrices = calculateOrderPrice(orderItems, orderInfo);
    const currency_symbol = orderItems[0].currency_symbol;

    const orderItemsWithTotalPrice = orderItems.map(item => ({
      ...item,
      totalPrice: item.quantity * item.price
    }));

    return (
      <div className="map-background checkout">
        <Helmet>
          <title>{t("LABEL.CHECKOUT")}</title>
          <meta name="description" content={t("LABEL.CHECKOUT")}/>
        </Helmet>
        <div className="container mt-0 d-md-flex flex-md-row">
          <div className="checkout-left w-100">
            <div className="box-shadow bg-white h-100 d-md-flex justify-content-md-center">
              {isLogged ? this.renderHasAccount() : this.renderHasNoAccount()}
              {isLogged && (
                <div className="border-top pt-2 d-flex w-100 text-center my-2 justify-content-end">
                <Button onClick={this.createOrder} color="danger">
                {this.props.t("BUTTON.CONFIRM_PAY")}
                </Button>
                </div>
                )}
            </div>
          </div>
          <div className="checkout-right">
            <div className="h-100">
              <div className="">
                <div className="color-cg-040 font-fb-120 text-center text-uppercase">{ORDER_TYPE.getString(orderInfo.order_type)}</div>
                <div className="color-red font-fb-250 text-center">{
                  t("format.currency", {
                    price: orderPrices.total,
                    symbol: currency_symbol
                  })
                }</div>
              </div>

              <div className="bg-white pl-md-4 pb-md-1 pt-md-1">
                <div className="color-cg-040 font-fb-140 text-uppercase mb-2 mt-2">
                  {restaurant_name}
                </div>
                <div className="color-red font-fr-120">{restaurant_address}</div>
                <div className="color-red font-fr-120">{restaurant_phone}</div>
              </div>

              <div className="">
                <GoogleMapKey
                  onItemRef={this.initGmap}
                  height={225}
                  defaultCenter={position}
                >
                  {directions ? (
                    <DirectionsRenderer directions={directions}/>
                  ) : position.lat && position.lng ? (
                    <Marker position={position}/>
                  ) : (
                    <span className="w-100 text-center text-danger vertical-center">
                      Can not address the location of business
                      </span>
                  )}
                </GoogleMapKey>
              </div>

              <div className="bg-white pr-md-4 pb-md-1 pt-md-1 text-right">
                <div className="color-cg-040 font-fb-140 text-uppercase mb-2 mt-2">
                  {customer_name}
                </div>
                <div className="color-red font-fr-120">
                  {!!orderInfo && !!orderInfo.order_address ? orderInfo.order_address : ""}
                </div>
                <div className="color-red font-fr-120">{customer_phone}</div>
              </div>

              <div className="p-md-4 checkout-list-item">
                {orderItemsWithTotalPrice.map((item, index) => (
                  <CheckoutItem key={index} item={item} data={items[item.item_uuid]} t={t}/>
                ))}
              </div>

              <div className="px-md-4 pb-md-5">
                {orderInfo.order_type === ORDER_TYPE.DELIVERY &&
                <div className="d-flex justify-content-between text-uppercase font-fr-140 color-cg-040">
                  <div>delivery fee</div>
                  <div className="font-fr-130 color-red">{
                    t("format.currency", {
                      price: orderPrices.fee,
                      symbol: currency_symbol
                    })
                  }</div>
                </div>
                }
              </div>

            </div>
            {
              //<Order
              //  orderItems={orderItems}
              //  orderInfo={orderInfo}
              //  className="mt-md-0 mt-4"
              ///>
              //<p className="px-2">{orderInfo.order_note}</p>
            }

          </div>
        </div>
      </div>
    );
  }
}

const CheckoutItem = ({item, t, data}) => {
  let optSetArr = [];
  if(!!item && !!item.item_options) optSetArr = item.item_options.map(el => el.id);

  console.log("data ------------ ", data);

  return (
    <div className="checkout-item pb-2 mb-2">
      <div className="text-uppercase d-flex justify-content-between">
        <div className="font-fr-140 color-cg-040">
          <span className="text-lowercase">{`${item.quantity}x `}</span>
          {item.name}
        </div>
        <div className="font-fr-130 color-red">
          {t("format.currency", {
            price: getItemPrice(item),
            symbol: item.currency_symbol
          })}
        </div>
      </div>
      {!!data && !!data.item_options && data.item_options.map((el, i) => {
        return (
          <div key={i}>
            <div className="my-2 font-fr-110 color-cg-040 text-uppercase">{el.name}:</div>
            {!!el.optionSet && el.optionSet.map((oSet, j) => (
              <div key={j} className="font-fr-120 color-cg-074">
                <Checkbox
                  checked={optSetArr.indexOf(oSet.id) >= 0}
                  type={oSet.multiple_option ? "checkbox" : "radio"}
                  content={`${oSet.name} - ${t("format.currency", {
                  price: oSet.price,
                  symbol: item.currency_symbol
                  })}`}
                  disabled
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
