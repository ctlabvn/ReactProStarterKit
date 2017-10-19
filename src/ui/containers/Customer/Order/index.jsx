import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { Row, Col, Label, Button } from "reactstrap";

import { connect } from "react-redux";

// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

// comonents
import ProductItem from "~/ui/components/Product/Item";
import MaskedInput from "~/ui/components/MaskedInput";
import OrderItem from "./components/OrderItem";

import options from "./options";

// store
import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";
import * as orderSelectors from "~/store/selectors/order";
import * as commonActions from "~/store/actions/common";

@translate("translations")
@reduxForm({
  form: "OrderHistory",
  // validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
@connect(
  state => ({
    token: authSelectors.getToken(state),
    orderHistory: orderSelectors.getHistory(state),
  }),
  commonActions
)
export default class extends Component {

  renderMaskedInputField = ({ input, label }) => {
    return (
      <Col md="3">
        <Label>{label}</Label>
        <MaskedInput
          className="form-control"
          mask="1111-11-11 11:11:11"
          placeholder="Y-m-d H:i:s"
          {...input}
        />
      </Col>
    );
  };

  searchOrder = async ({ from, to }) => {
    const { token, requestor } = this.props;
    const options = {};
    from && (options.from = from);
    to && (options.to = to);
    // const ret = await api.order.getOrderHistory(token, options);
    // can store into redux
    requestor("order/getOrderHistory", token, options);
  };

  render() {
    const { submitting, handleSubmit, orderHistory } = this.props;
    return (
      <div className="container">
        <Row>
          <Field
            label="From date"
            name="from"
            component={this.renderMaskedInputField}
          />
          <Field
            label="To date"
            name="to"
            component={this.renderMaskedInputField}
          />

          <Col className="d-flex col flex-column justify-content-end align-items-start">
            <Button
              disabled={submitting}
              onClick={handleSubmit(this.searchOrder)}
            >
              Search
            </Button>
          </Col>
        </Row>
        <Row>
          {orderHistory.map(order => 
            <OrderItem key={order.order_uuid} order={order} className="w-100  bg-dark color-white mt-4"/>
          )}
        </Row>
      </div>
    );
  }
}