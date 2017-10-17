import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { connect } from "react-redux";

// reactstrap
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

// components
import AccountDropdown from "./components/AccountDropdown";
import ProductItem from "~/ui/components/Product/Item";

// selectors
import * as authSelectors from "~/store/selectors/auth";
import options from "./options";
import "./index.css";

@connect(state => ({
  isHome: state.routing.location.pathname === "/",
  isLogged: authSelectors.isLogged(state)
}))
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartOpen: false
    };
  }

  toggleCart = () => {
    this.setState({
      cartOpen: !this.state.cartOpen
    });
  };

  renderPopoverCart(){
    return (
      <Popover
              placement="bottom"
              isOpen={this.state.cartOpen}
              target="popoverCart"
              toggle={this.toggleCart}
            >
              <PopoverBody className="p-0">
                {options.products ? (
                  <div>
                    <div className="popover-cart pr-4 pt-4">
                    {options.products.map((item, index) => (
                    <ProductItem
                      className="mb-4"
                      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                      key={index}
                      price={10}
                      title={item}
                    />
                    ))}
                    </div>
                    <Button onClick={this.toggleCart} className="bg-red btn-sm btn-block text-uppercase border-0">
                      <Link to="/cart">Process to checkout</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <img src="/images/no-data.png" height="100" alt="" />
                    <p className="color-gray text-uppercase">
                      Your shopping cart is empty.
                    </p>
                  </div>
                )}
              </PopoverBody>
            </Popover>
    )
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
            <Button
              id="popoverCart"
              onClick={this.toggleCart}
              className="btn-round bg-red border-0"
            >
              <i
                className="fa fa-shopping-cart color-white"
                aria-hidden="true"
                id="cart-icon"
              />
              <span className="badge bg-red">0</span>
            </Button>

            {this.renderPopoverCart()}

            {isLogged && <AccountDropdown />}
          </div>
        </div>
      </nav>
    );
  }
}