import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { Row, Col, Button } from "reactstrap";

// components
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";

// store
import * as commonActions from "~/store/actions/common";
import * as orderActions from "~/store/actions/order";
import * as orderSelectors from "~/store/selectors/order";
import * as authSelectors from "~/store/selectors/auth";

// components
import Signup from "./Signup";
import Login from "./Login";
import Order from "./Order";

import { getCurrentLocation } from "~/ui/utils";

import "./index.css";

@translate("translations")
@connect(
  state => ({
    isLogged: authSelectors.isLogged(state),
    address: authSelectors.getAddress(state),
    customer: authSelectors.getCustomer(state),
    orderItems: orderSelectors.getItems(state),
    orderInfo: orderSelectors.getInfo(state),
    token: authSelectors.getToken(state),
  }),
  { ...commonActions, ...orderActions }
)
export default class extends Component {

  createOrder = async ()=>{
    const {customer, orderItems, orderInfo, token, address, requestor} = this.props;
    const ret = await getCurrentLocation();
    const addressItem = address.find(item=>item.cus_address_uuid === orderInfo.cus_address_uuid)
    const data = {
      items: orderItems.map(item => ({
        item_uuid: item.item_uuid,
        item_quantity: item.quantity,
        item_options: item.item_options,
      })),
      customer: {
        customer_uuid: customer.customer_uuid,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email,
        customer_address: addressItem ? addressItem.address : "",
        customer_lat: ret.latitude,
        customer_long: ret.longitude,
      },
      // The request time for delivery in seconds. 
      request_time: orderInfo.request_time * 60,
      order_type: orderInfo.order_type,
      order_note: orderInfo.order_note,
    }
    // console.log(data);
    requestor("order/requestCreateOrder", data);
  };

  componentWillMount() {
    // get data if not have, or can validate follow expiry
  }

  updateOrderAddress({cus_address_uuid}){
    this.props.updateOrder({cus_address_uuid});
  }

  renderHasAccount() {
    const { address, orderInfo, t } = this.props;
    return (
      <div>
        <h4 className="text-center">{t("LABEL.DELIVERY_ADDRESS")}</h4>
        <Menu className="list-group">
          {address.map((item) => (
            <MenuItem
              onClick={()=>this.updateOrderAddress(item)}
              title={`${item.name} - ${item.address}`}
              active={orderInfo.cus_address_uuid === item.cus_address_uuid}
              key={item.cus_address_uuid}
            />
          ))}
        </Menu>

        <div className="w-100 text-center">
          <Button onClick={this.createOrder} color="primary">{this.props.t("BUTTON.CONFIRM_PAY")}</Button>
        </div>
      </div>
    );
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
    const { t, isLogged } = this.props;
    return (
      <div className="container">
        <Row>
          <Col md="8">
            {isLogged ? this.renderHasAccount() : this.renderHasNoAccount()}
          </Col>
          <Col>
            <Order />
          </Col>
        </Row>
      </div>
    );
  }
}