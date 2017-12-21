import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
 import { connect } from "react-redux";
import { translate } from "react-i18next";

import {
  Modal,
  ModalBody,
  Button
} from "reactstrap";

// G-Map
import { DirectionsRenderer, Marker } from "react-google-maps";
import GoogleMapKey from "~/ui/components/GoogleMapKey";
import Checkbox from "~/ui/components/Checkbox";
import { history } from "~/store";
import { getItemPrice, calculateOrderPrice, ORDER_TYPE } from "~/utils";

import "./index.css";

@translate("translations")
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      directions: null,
      items: {}
    };
  }

  toggle = () => {
    const { isOpen } = this.state;

    if(!isOpen) this.loadItems(this.props.orderItems);

    this.setState({
      isOpen: !isOpen
    });
  };

  componentDidMount() {
    this.props.onItemRef && this.props.onItemRef(this);
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

  componentWillMount() {
    //this.loadItems(this.props.orderItems);
  }

  loadItem(outlet_slug, item_uuid) {
    const { requestor } = this.props;
    return new Promise(resolve => {
      requestor("restaurant/getItem", item_uuid, outlet_slug, async (err, data) => resolve(data));
    });
  }

  loadItems = async (orderItems) => {
    if (!orderItems) return;
    let items = {};
    for (let i = 0; i < orderItems.length; i++) {
      const data = await this.loadItem(orderItems[i].slug, orderItems[i].item_uuid);
      if (!!data && !!data.data) items[data.data.item_uuid] = data.data;
    }

    this.setState({items});
  }

  checkoutBtnOnClick = () => {
    this.toggle();
    history.push("/cart");
  };

  render() {
    const {
      t,
      orderItems,
      orderInfo,
      customer,
      onIncreaseOrder,
      onDecreaseOrder,
      onChangeQuantity
    } = this.props;

    const {
      isOpen,
      items,
      directions
      } = this.state;

    const restaurant_name =
      orderInfo && orderInfo.restaurant_name
        ? orderInfo.restaurant_name
        : null;
    const restaurant_address =
      orderInfo && orderInfo.restaurant_address
        ? orderInfo.restaurant_address
        : null;
    const restaurant_phone =
      orderInfo && orderInfo.restaurant_phone
        ? orderInfo.restaurant_phone
        : null;

    const customer_phone =
      customer && customer.phone ? customer.phone : null;
    const customer_name =
      customer && customer.name ? customer.name : null;

    const position = {
      lat: +orderInfo.restaurant_lat,
      lng: +orderInfo.restaurant_long
    };

    const orderPrices = calculateOrderPrice(orderItems, orderInfo);
    const currency_symbol = orderItems.length
      ? orderItems[0].currency_symbol
      : null;

    const orderItemsWithTotalPrice = orderItems.map(item => ({
      ...item,
      totalPrice: item.quantity * item.price
    }));

    return (
      <Modal
        isOpen={isOpen}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalBody className="p-0">
          {orderItems.length > 0 ? (
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
                  {!!restaurant_name && <div className="color-cg-040 font-fb-140 text-uppercase mb-2 mt-2">{restaurant_name}</div>}
                  {!!restaurant_address && <div className="color-red font-fr-120">{restaurant_address}</div>}
                  {!!restaurant_phone && <div className="color-red font-fr-120">{restaurant_phone}</div>}
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
                  {!!customer_name && <div className="color-cg-040 font-fb-140 text-uppercase mb-2 mt-2">
                    {customer_name}
                  </div>}
                  {!!orderInfo && !!orderInfo.order_address && <div className="color-red font-fr-120">
                    {orderInfo.order_address}
                  </div>}
                  {!!customer_phone && <div className="color-red font-fr-120">{customer_phone}</div>}
                </div>

                <div className="p-md-4 checkout-list-item">
                  {!!items && orderItemsWithTotalPrice.map((item, index) => (
                    <CheckoutItem
                      key={index}
                      item={item}
                      data={items[item.item_uuid]}
                      t={t}
                      onIncreaseOrder={onIncreaseOrder}
                      onDecreaseOrder={onDecreaseOrder}
                      onChangeQuantity={onChangeQuantity}
                    />
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
                <Button
                  className="process-checkout-btn font-fr-120 text-uppercase"
                  onClick={this.checkoutBtnOnClick}
                >
                  {t("BUTTON.GO_TO_CART")}
                </Button>
              </div>
            </div>
          ) : <div className="text-center p-2">
            <img src="/images/no-data.png" height="100" alt="" />
            <p className="color-gray text-uppercase">
              {t("LABEL.CART_EMPTY")}
            </p>
          </div>}

        </ModalBody>
      </Modal>
    );
  }
}

const CheckoutItem = ({item, t, data, onIncreaseOrder, onDecreaseOrder, onChangeQuantity}) => {
  let optSetArr = [];
  if (!!item && !!item.item_options) optSetArr = item.item_options.map(el => el.id);

  return (
    <div className="checkout-item pb-2 mb-2">
      <div className="text-uppercase d-flex justify-content-between">
        <div className="font-fr-140 color-cg-040">
          <span className="text-lowercase">{`${item.quantity}x `}</span>
          {item.name}
        </div>
        <div>
          <div className="font-fr-130 color-red text-right">
            {t("format.currency", {
              price: getItemPrice(item) * item.quantity,
              symbol: item.currency_symbol
            })}
          </div>
          <div className="process-checkout-update-order d-flex flex-row align-items-center justify-content-end">
            <button
              className="your-cart-item-btn-quantity"
              onClick={item.quantity > 1 ? () => onDecreaseOrder(item) : null}
            >
              <span>-</span>
            </button>
            <span className="ml-2 mr-2">
              <input
                className="your-cart-item-input-quantity font-fr-100 color-cg-074 text-center"
                type="text"
                value={item.quantity}
                onChange={e => onChangeQuantity(item,e.target.value)}
              />
            </span>
            <button
              className="your-cart-item-btn-quantity"
              onClick={() => onIncreaseOrder(item)}
            >
              <span>+</span>
            </button>
          </div>
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
