import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { connect } from "react-redux";

// components
import AccountDropdown from "./components/AccountDropdown";

// selectors
import * as authSelectors from "~/store/selectors/auth";

import "./index.css";

@connect(state => ({
  isHome: state.routing.location.pathname === "/",
  isLogged: authSelectors.isLogged(state),
}))
export default class extends Component {
  componentDidMount() {
    window.jQuery(this.cartButton).popover({
      html: true,
      trigger: "hover",
      content: this.cartContent,
      placement: "bottom"
    });
  }

  componentWillUnMount() {
    window.jQuery(this.cartButton).popover("dispose");
  }

  render() {
    const { isHome, isLogged } = this.props;

    return (
      <nav
        className={classNames("navbar fixed-top header container-fluid", {
          invisible: isHome
        })}
      >
        <div className="container-fluid p-0">
          <div>
            <Link className="navbar-brand" to="/">
              <img src="/images/logo.png" alt="" />
            </Link>

            <input
              type="text"
              className="custom-input font-large color-gray"
              placeholder="Type your search"
            />
          </div>

          <div className="d-flex align-items-center flex-row">
            <button
              ref={ref => (this.cartButton = ref)}
              type="button"
              className="btn btn-round bg-red"
              data-container="body"
            >
              <Link to="/cart">
                <i
                  className="fa fa-shopping-cart color-white"
                  aria-hidden="true"
                  id="cart-icon"
                />
                <span className="badge bg-red">0</span>
              </Link>
              <div
                className="popover-content text-center"
                ref={ref => (this.cartContent = ref)}
              >
                <img src="/images/no-data.png" height="100" alt="" />
                <p className="color-gray text-uppercase">
                  Your shopping cart is empty.
                </p>
              </div>
            </button>

            {isLogged && <AccountDropdown/>}
            
          </div>
        </div>
      </nav>
    );
  }
}