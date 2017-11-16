import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import classNames from "classnames";
// import { connect } from "react-redux";
import { translate } from "react-i18next";

// reactstrap
import {
  // Button,
  Popover,
  // PopoverHeader,
  PopoverBody,
  // DropdownItem
} from "reactstrap";

// components
import ButtonRound from "~/ui/components/Button/Round";

import { getItemPrice } from "~/ui/utils";

import "./index.css";

@translate("translations")
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartOpen: false,
    };
  }

  static propTypes = {
    onIncreaseOrder: PropTypes.func.isRequired,
    onDecreaseOrder: PropTypes.func.isRequired,
  };

  toggle = () => {
    const {cartOpen} = this.state;
    document.querySelector('body').style.overflow = cartOpen ? 'auto' : 'hidden';
    this.setState({
      cartOpen: !cartOpen
    });
  };  

  renderProductItem(item) {
    const { onIncreaseOrder, onDecreaseOrder, t } = this.props;
    return (
      <div key={item.item_uuid} className="border-bottom py-2">
        <div className="d-flex flex-row justify-content-start">
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
              onClick={() => onDecreaseOrder(item)}
            />
          )}
          <span>{item.quantity}</span>
          <ButtonRound
            className="p-0 ml-1"
            icon="plus"
            onClick={() => onIncreaseOrder(item)}
          />

          <span className="ml-auto color-red">
            {t("format.currency", {
              price: getItemPrice(item) * item.quantity,
              symbol: item.currency_symbol
            })}
          </span>
        </div>
        {item.item_options && item.item_options.map(item_option=>
          <div key={item_option.option_uuid} className="mb-2 color-black-300">
            (+1) <span className="text-uppercase">{item_option.name}</span>
            {
            // <span className="ml-2 color-red">{t("format.currency", {
            //   price: item_option.price,
            //   symbol: item.currency_symbol
            // })}</span>
          }
          </div>
        )}
        {
        //   item.description && (
        //   <div className="mb-2 color-gray">{item.description}</div>
        // )
        }
      </div>
    );
  }

  componentDidMount(){
    this.props.onItemRef && this.props.onItemRef(this);
  }

  render() {
    const { t, orderItems, onItemRef, onIncreaseOrder, onDecreaseOrder, ...props } = this.props;
    return (
      <Popover        
        isOpen={this.state.cartOpen}            
        toggle={this.toggle}
        className="popover-cart box-shadow"
        {...props}
      >
        <PopoverBody className="p-2">
          {orderItems.length ? (
            <div>
              <div className="popover-cart-content">
                {orderItems.map(item => this.renderProductItem(item))}
              </div>
              <Link
                onClick={this.toggle}
                className="btn mt-2 bg-red color-white btn-sm btn-block text-uppercase border-0"
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
}