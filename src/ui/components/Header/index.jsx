import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { connect } from "react-redux";
import { translate } from "react-i18next";

// reactstrap
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  DropdownItem
} from "reactstrap";

// components
import AccountDropdown from "./components/AccountDropdown";
import ProductItem from "~/ui/components/Product/Item";
import LoginModal from "~/ui/components/LoginModal";
import Suggestion from "./components/Suggestion";

// selectors && actions
import * as orderActions from "~/store/actions/order";
import * as authSelectors from "~/store/selectors/auth";
import * as orderSelectors from "~/store/selectors/order";

import "./index.css";

@translate("translations")
@connect(
  state => ({
    isHome: state.routing.location.pathname === "/",
    isLogged: authSelectors.isLogged(state),
    orderItems: orderSelectors.getItems(state),    
  }),
  orderActions
)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartOpen: false,      
    };
  }

  toggleCart = () => {
    this.setState({
      cartOpen: !this.state.cartOpen
    });
  };

  increaseOrder(item) {
    this.props.updateOrderItem({ ...item, quantity: item.quantity + 1 });
  }

  decreaseOrder(item) {
    this.props.updateOrderItem({ ...item, quantity: item.quantity - 1 });
  }

  renderPopoverCart() {
    const { t, orderItems } = this.props;
    return (
      <Popover
        placement="bottom"
        isOpen={this.state.cartOpen}
        target="popoverCart"
        toggle={this.toggleCart}
      >
        <PopoverBody className="p-0">
          {orderItems.length ? (
            <div>
              <div className="popover-cart pr-4 pt-4">
                {orderItems.map(item => (
                  <ProductItem
                    className="mb-4"
                    quantity={item.quantity}
                    description={item.description}
                    key={item.item_uuid}
                    priceUnit={item.currency_symbol}
                    price={item.price}
                    title={item.name}
                    onIncrease={() => this.increaseOrder(item)}
                    onDecrease={() => this.decreaseOrder(item)}
                  />
                ))}
              </div>

              <Link
                onClick={this.toggleCart}
                className="btn bg-red btn-sm btn-block text-uppercase border-0"
                to="/cart"
              >
                Process to checkout
              </Link>
            </div>
          ) : (
            <div className="text-center p-2">
              <img src="/images/no-data.png" height="100" alt="" />
              <p className="color-gray text-uppercase">
                {t("LABEL.CART_EMPTY")}
              </p>
            </div>
          )}
        </PopoverBody>
      </Popover>
    );
  }

  render() {
    const { t, isHome, isLogged, orderItems } = this.props;    
    const totalQuantity = orderItems.reduce((a, item) => a + item.quantity, 0);
    return (
      <nav
        className={classNames("navbar fixed-top header container-fluid", {
          invisible: isHome
        })}
      >
        <div className="container-fluid p-0">
          <div className="d-flex w-75">
            <Link className="navbar-brand" to="/">
              <img src="/images/logo.png" alt="" />
            </Link>

            <Suggestion />   

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
              <span className="badge bg-red">{totalQuantity}</span>
            </Button>

            {this.renderPopoverCart()}

            {!isLogged ? (
              <Button
                onClick={() => this.loginModal.toggle()}
                className="btn-outline-danger btn-sm text-uppercase ml-4"
              >
                {t("LINK.FOOTER.LOGIN")}
              </Button>
            ) : (
              <AccountDropdown />
            )}
          </div>

          <LoginModal onItemRef={ref => (this.loginModal = ref)} />
        </div>
      </nav>
    );
  }
}