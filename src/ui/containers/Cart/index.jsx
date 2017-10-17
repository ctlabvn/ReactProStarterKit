import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// reactstrap
import { Table, Button } from 'reactstrap';


// components
import CardItem from "./components/CardItem";

import * as orderSelectors from "~/store/selectors/order";
import * as orderActions from "~/store/actions/order";

import options from "./options";
import "./index.css";


@connect(state => ({  
  orderItems: orderSelectors.getItems(state),
}), orderActions)
export default class extends Component {

  increaseOrder(item){
    this.props.updateOrderItem({...item, quantity: item.quantity+1});
  }

  decreaseOrder(item){
    this.props.updateOrderItem({...item, quantity: item.quantity-1});
  }

  removeOrder(item){
    this.props.removeOrderItem(item);
  }

  renderCartList() {
    const {orderItems} = this.props;
    return (
      <Table className="mt-4 text-uppercase table-fixed">
        <thead className="color-gray">
          <tr>
            <th className="pl-0 w-25">Item</th>
            <th>Unit price</th>
            <th>Quantity</th>
            <th>Vat</th>
            <th>Total</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item) => (
            <CardItem
              key={item.item_uuid}
              title={item.name}
              image="/images/donut-square.png"
              vat={0}
              price={item.price}
              quantity={item.quantity}
              onIncrease={()=>this.increaseOrder(item)}
              onDecrease={()=>this.decreaseOrder(item)}
              onRemove={()=>this.removeOrder(item)}
            />
          ))}
        </tbody>
      </Table>
    );
  }

  renderOrderType() {
    return (
      <div className="col-md-6 border border-left-0 pt-4 pb-4 pl-0">
        <h6 className="color-gray text-uppercase mb-4">Order type</h6>
        <div className="d-flex flex-row justify-content-between">
          {options.orderTypes.map((item, index) => (
            <label key={index}>
              <input type="radio" name="optionsRadios" className="mr-2" />
              {item}
            </label>
          ))}
        </div>
      </div>
    );
  }

  renderAddress() {
    return (
      <div className="col-md-6 border border-left-0 border-right-0 pt-4 pb-4 pl-4">
        <h6 className="color-gray text-uppercase mb-4">
          ADDRESS <span className="color-gray-400">(delivery only)</span>
        </h6>

        <input placeholder="Type your address here" className="custom-input" />
      </div>
    );
  }

  render() {
    const { restaurants } = this.props;
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
            <i className="fa fa-clock-o" aria-hidden="true" /> Delivery time : 30 m
          </small>

          {this.renderCartList()}

          {this.renderOrderType()}
          {this.renderAddress()}


          <div className="mt-5 mb-4 d-flex w-100 justify-content-between">
            <div className="col-md-7 pl-0">
              <h6 className="color-gray text-uppercase mb-4">Add a note</h6>
              <textarea className="w-100 h-75 border-gray-300"/>
            </div>

            <div className="col-md-offset-1 col-md-4">
              <h6 className="color-gray text-uppercase mb-4 d-flex justify-content-between">
                <span>Subtotal</span> <span>348$</span>
              </h6>

              <h6 className="color-black text-uppercase font-weight-bold mb-4 d-flex justify-content-between">
                <span>Total price</span> <span>348$</span>
              </h6>

              <input placeholder="Enter promo code" className="custom-input text-uppercase" />

              
              <Link className="btn bg-red btn-lg btn-block text-uppercase" to="/checkout">Pay now</Link>
              

            </div>
          </div>

        </div>
      </div>
    );
  }
}