import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { connect } from "react-redux";
import { translate } from "react-i18next";

// reactstrap
import {
  Button,
  Popover,
  // PopoverHeader,
  PopoverBody
  // DropdownItem
} from "reactstrap";

// components
import AccountDropdown from "./components/AccountDropdown";
import ButtonRound from "~/ui/components/Button/Round";
import LoginModal from "~/ui/components/LoginModal";
import Suggestion from "./components/Suggestion";

// selectors && actions
import * as orderActions from "~/store/actions/order";
import * as authSelectors from "~/store/selectors/auth";
import * as orderSelectors from "~/store/selectors/order";
import { getItemPrice } from "~/ui/utils";

import "./index.css";

@translate("translations")
@connect(
  state => ({
    isHome: state.routing.location.pathname === "/",
    isLogged: authSelectors.isLogged(state),
    orderItems: orderSelectors.getItems(state)
  }),
  orderActions
)
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

  increaseOrder(item) {
    this.props.updateOrderItem({ ...item, quantity: item.quantity + 1 });
  }

  decreaseOrder(item) {
    if (item.quantity === 1) {
      if (window.confirm("Do you want to remove this item?")) {
        this.props.removeOrderItem(item);
      }
    } else {
      this.props.updateOrderItem({ ...item, quantity: item.quantity - 1 });
    }
  }

  renderProductItem(item) {
    const { t } = this.props;
    return (
      <div key={item.item_uuid} className="border-bottom ">
        <div className="d-flex flex-row p-2 justify-content-start">
          <Link
            className="flex-column d-flex p-0 align-items-start"
            to={`/item/${item.item_uuid}`}
          >
            <strong className="text-truncate color-black-300">
              {item.name}
            </strong>
          </Link>

          {item.quantity > 0 && (
            <ButtonRound
              className="p-0 mr-1"
              icon="minus"
              onClick={() => this.decreaseOrder(item)}
            />
          )}
          <span>{item.quantity}</span>
          <ButtonRound
            className="p-0 ml-1"
            icon="plus"
            onClick={() => this.increaseOrder(item)}
          />

          <span className="ml-auto pl-2 color-red">
            {t("format.currency", {
              price: getItemPrice(item) * item.quantity,
              symbol: item.currency_symbol
            })}
          </span>
        </div>
        {item.item_options && item.item_options.map(item_option=>
          <div key={item_option.option_uuid} className="ml-2 mr-2 mb-2 color-black-300">
            (+1) <span className="text-uppercase">{item_option.name}</span>
            {
            // <span className="ml-2 color-red">{t("format.currency", {
            //   price: item_option.price,
            //   symbol: item.currency_symbol
            // })}</span>
          }
          </div>
        )}
        {item.description && (
          <div className="ml-2 mr-2 mb-2 color-gray">{item.description}</div>
        )}
      </div>
    );
  }

  renderPopoverCart() {
    const { t, orderItems } = this.props;
    return (
      <Popover
        placement="bottom"
        className="popover-cart"
        isOpen={this.state.cartOpen}
        target="popoverCart"
        toggle={this.toggleCart}
      >
        <PopoverBody className="p-0">
          {orderItems.length ? (
            <div>
              {orderItems.map(item => this.renderProductItem(item))}

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
                className="btn-outline-danger btn-sm text-capitalize ml-4"
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