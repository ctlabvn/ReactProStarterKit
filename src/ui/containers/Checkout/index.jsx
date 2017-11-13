/* eslint-disable */

import React, { Component } from "react";
import { translate } from "react-i18next";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";

import moment from "moment";

import { 
  Row, Col, Button,
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

import { extractMessage, ORDER_TYPE } from "~/ui/utils";

import "./index.css";

@translate("translations")
@connect(
  state => ({
    isLogged: authSelectors.isLogged(state),
    // address: authSelectors.getAddress(state),
    customer: authSelectors.getCustomer(state),
    orderItems: orderSelectors.getItems(state),
    orderInfo: orderSelectors.getInfo(state),
    token: authSelectors.getToken(state),
  }),
  { ...commonActions, ...orderActions }
)
export default class extends Component {

  createOrder = async ()=>{
    const {customer, orderItems, orderInfo, 
      // address, 
      updateOrderHistory,
      requestor, clearItems, setToast} = this.props;    
    // const addressItem = address.find(item=>item.cus_address_uuid === orderInfo.cus_address_uuid);
    const now = moment();
    const minutesOfNow = 0;//(now.hour() * 60 + now.minute());
    let minutesOfPreparation = orderInfo.request_time + orderInfo.preparation_time;
    if(orderInfo.order_type === ORDER_TYPE.DELIVERY){
      minutesOfPreparation += +orderInfo.travel_time;
    }
    const request_time = 60 * (minutesOfPreparation - minutesOfNow);

    const detailAddress = this.detailAddress ? this.detailAddress.value.trim() : '';

    const customer_address = orderInfo.order_type === ORDER_TYPE.DELIVERY 
      ? orderInfo.order_address + (detailAddress ? "\n" + detailAddress : "")
      : "take_away is optional";//addressItem.address;

    const data = {
      items: orderItems.map(item => ({
        item_uuid: item.item_uuid,
        item_quantity: item.quantity,
        item_options: item.item_options.map(item_option=>item_option.option_uuid),
      })),
      customer: {
        customer_uuid: customer.customer_uuid,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email,
        customer_address,
        customer_lat: orderInfo.order_lat,
        customer_long: orderInfo.order_long,
      },
      // The request time for delivery in minutes. 
      request_time,
      order_type: orderInfo.order_type || ORDER_TYPE.DELIVERY,
      order_note: orderInfo.order_note,
    }
    // console.log(data);
    requestor("order/requestCreateOrder", data, (err, ret)=>{
      if(!err){
        // if success create order then clear all items
        clearItems();
        // force reload
        updateOrderHistory([]);
        history.push("/customer/order");
      } else {
          setToast(extractMessage(err.message), "danger");        
      }
    });
  };

  componentWillMount() {
    // get data if not have, or can validate follow expiry
  }

  updateOrderAddress({cus_address_uuid}){
    this.props.updateOrder({cus_address_uuid});
  }

  renderDeliveryAddress(){
    const { orderInfo, t } = this.props;
    return (
      <div className="w-100">
        <h4 className="text-center">{t("LABEL.DELIVERY_ADDRESS")}</h4>
        <strong>{orderInfo.order_address}</strong>
        <input placeholder="Detail address:" className="form-control" ref={ref=>this.detailAddress=ref}/>
      </div>
    )
  }

  renderTakeawayAddress(){
    return null
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
    
    return orderInfo.order_type === ORDER_TYPE.DELIVERY ? this.renderDeliveryAddress() : this.renderTakeawayAddress();        
  }

  renderHasNoAccount() {
    return (
      <div>
        <h4 className="text-center">{this.props.t("LABEL.CREATE_ACCOUNT")}</h4>
        <Signup />
        <h4 className="text-center mt-5">{this.props.t("LABEL.HAVE_ACCOUNT")}</h4>
        <Login />
      </div>
    );
  }

  render() {
    const { isLogged, orderItems, orderInfo } = this.props;
    if(!orderItems.length){
      return <EmptyResult/>;
    }

    return (
      <div className="container">
        <Row>
          <Col md="8">
            {isLogged ? this.renderHasAccount() : this.renderHasNoAccount()}
          </Col>
          <Col>
            <Order orderItems={orderItems} orderInfo={orderInfo} className="mt-md-0 mt-4"/>
            {isLogged && <div className="d-flex w-100 text-center my-4 justify-content-end">
              <Button onClick={this.createOrder} color="primary">{this.props.t("BUTTON.CONFIRM_PAY")}</Button>
            </div>}
          </Col>
        </Row>
      </div>
    );
  }
}