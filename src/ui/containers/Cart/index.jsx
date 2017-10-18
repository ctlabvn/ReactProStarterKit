import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";

// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

// reactstrap
import { Button, FormGroup, Label, Input } from "reactstrap";

// components
import { InputField } from "~/ui/components/ReduxForm";
import CardList from "./components/CardList";

import * as orderSelectors from "~/store/selectors/order";
import * as orderActions from "~/store/actions/order";

import { history } from "~/store";

import { validate } from "./utils";

import options from "./options";
import "./index.css";

@translate("translations")
@connect(
  state => ({
    orderItems: orderSelectors.getItems(state),
    initialValues: orderSelectors.getInfo(state),
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

  saveOrderInfo = (data) => {
    this.props.updateOrder(data);    
    history.push("/checkout");
  };


  renderOrderTypeField = ({input, label, meta: { touched, error, warning }, ...custom}) => {
    return (
      <div className="col-md-6 border border-left-0 pt-4 pb-4 pl-0">
        <h6 className="color-gray text-uppercase mb-4">{label}</h6>
        <FormGroup check className="d-flex flex-row justify-content-between">
          {options.orderTypes.map((item, index) => (            
            <Label check key={index}>
              <Input onChange={e=>input.onChange(index)} type="radio" defaultChecked={index===input.value} name="order_type" className="mr-2"  />
              {item}
            </Label>

          ))}
        </FormGroup>
      </div>
    );
  };

  renderAddress() {
    return (
      <div className="col-md-6 border border-left-0 border-right-0 pt-4 pb-4 pl-4">
        <h6 className="color-gray text-uppercase mb-4">
          ADDRESS <span className="color-gray-400">(delivery only)</span>
        </h6>
        <Field name="order_address" placeholder="Type your address here" className="custom-input" component={InputField}/>
      </div>
    );
  }

  render() {
    const { orderItems, t, handleSubmit, submitting } = this.props;        
    if (!orderItems || !orderItems.length) {
      return (
        <div className="text-center p-2">
          <img src="/images/no-data.png" height="100" alt="" />
          <p className="color-gray text-uppercase">
            Your shopping cart is empty.
          </p>
        </div>
      );
    }

    const totalPrice = orderItems.reduce(
      (a, item) => a + item.quantity * item.price,
      0
    );
    return (
      <div className="container">
        <div className="row block bg-white">
          <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
            <Link to="/" className="breadcrumb-item color-gray-400" href="#">
              &lt; Back
            </Link>
          </nav>

          <h2 className="w-100 text-uppercase font-weight-bold color-black">
            Your cart
          </h2>
          <small>
            <i className="fa fa-clock-o" aria-hidden="true" /> Delivery time :
            30 m
          </small>

          <CardList/>
          
          <Field label="Order type" name="order_type" component={this.renderOrderTypeField} />
          {this.renderAddress()}

          <div className="mt-5 mb-4 d-flex w-100 justify-content-between">
            <div className="col-md-7 pl-0">
              <h6 className="color-gray text-uppercase mb-4">Add a note</h6>              
              <Field name="order_note" type="textarea" className="w-100 h-75 border-gray-300" component={InputField} />
            </div>

            <div className="col-md-offset-1 col-md-4">
              <h6 className="color-gray text-uppercase mb-4 d-flex justify-content-between">
                <span>Subtotal</span>
                <span>
                  {t("format.currency", {
                    price: totalPrice,
                    symbol: orderItems[0].currency_symbol
                  })}
                </span>
              </h6>

              <h6 className="color-black text-uppercase font-weight-bold mb-4 d-flex justify-content-between">
                <span>Total price</span>
                <span>
                  {t("format.currency", {
                    price: totalPrice,
                    symbol: orderItems[0].currency_symbol
                  })}
                </span>
              </h6>

              <Field 
                placeholder="Enter promo code"
                className="custom-input text-uppercase"
                name="order_promotion_code"
                component={InputField}
              />

              <Button
                className="btn bg-red btn-lg btn-block text-uppercase"                
                onClick={handleSubmit(this.saveOrderInfo)}
              >
                Pay now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}