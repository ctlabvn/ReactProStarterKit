import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// components
import CardItem from "./components/CardItem";

import options from "./options";
import "./index.css";

export default class extends Component {
  renderCartList() {
    return (
      <table className="table mt-4 text-uppercase">
        <thead className="color-gray">
          <tr>
            <th>Item</th>
            <th>Unit price</th>
            <th>Quantity</th>
            <th>Vat</th>
            <th>Total</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {options.items.map((item, index) => (
            <CardItem
              key={index}
              title={item}
              image="/images/donut-square.png"
              vat={0.15}
              price={19}
              quantity={3}
            />
          ))}
        </tbody>
      </table>
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
            <i class="fa fa-clock-o" aria-hidden="true" /> Delivery time : 30 m
          </small>

          {this.renderCartList()}
        </div>
      </div>
    );
  }
}