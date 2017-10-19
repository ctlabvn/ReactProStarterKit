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
import options from "./options";

// store
import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";
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
    token: authSelectors.getToken(state)
  }),
  commonActions
)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderHistory: []
    };
  }

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
    const ret = await api.order.getOrderHistory(token, options);
    // can store into redux
    requestor("order/getOrderHistory", token, options, (err, ret)=>{
      if(!err){
        this.setState({ orderHistory: ret.data });
      }
    });
  };

  renderOrder(order) {
    const {t} = this.props;
    return (      
      <Col md="6" className="float-left" key={order.order_uuid}>
        <h4 className="w-100">{order.outlet.name} {order.created_at}</h4>
        {order.items.map(item => (
          <div className="d-flex mb-4 justify-content-start" key={item.id}>
            <div className="p-2">{item.qty}x</div>
            <div className="p-2 d-flex flex-column">
              {item.name}
              <img className="rounded-circle align-self-start border" width={50} alt="..." src="/images/donut.png" />
            </div>
            <div className="ml-auto p-2">
              {t("format.currency", {
                price: item.price,
                symbol: item.currency_symbol || 'đ'
              })}
            </div>
          </div>
        ))}        
      </Col>
    );
  }

  render() {
    const { submitting, handleSubmit } = this.props;
    const { orderHistory } = this.state;
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
        <Row className="mt-4 bg-white">
          {orderHistory.map(order => this.renderOrder(order))}
        </Row>
      </div>
    );
  }
}