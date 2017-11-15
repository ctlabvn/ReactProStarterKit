import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { connect } from "react-redux";
import { translate } from "react-i18next";

// reactstrap
import {
  Button,
  // DropdownItem
} from "reactstrap";

// components
import AccountDropdown from "./components/AccountDropdown";
// import ButtonRound from "~/ui/components/Button/Round";
import LoginModal from "~/ui/components/LoginModal";
import Suggestion from "./components/Suggestion";
import PopoverCart from "./components/PopoverCart";
import Drawer from "~/ui/components/Drawer";
import ModalConfirm from "~/ui/components/ModalConfirm";

// selectors && actions
import * as orderActions from "~/store/actions/order";
import * as authSelectors from "~/store/selectors/auth";
import * as orderSelectors from "~/store/selectors/order";
import { isMobile } from "~/ui/utils";

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
      drawerOpen: false,
    };

    this.selectedItem = null;
  }

  toggleDrawer = ()=>{
    const {drawerOpen} = this.state;
    document.querySelector('body').style.overflow = drawerOpen ? 'auto' : 'hidden';
    this.setState({
      drawerOpen: !drawerOpen
    });
  };

  increaseOrder=(item)=> {
    this.props.updateOrderItem({ ...item, quantity: item.quantity + 1 });
  };

  decreaseOrder=(item)=> {
    this.selectedItem = item;
    if (item.quantity === 1) {
      // if (window.confirm("Do you want to remove this item?")) {
      //   this.props.removeOrderItem(item);
      // }
      this.modal.open();
    } else {
      this.props.updateOrderItem({ ...item, quantity: item.quantity - 1 });
    }
  };

  handleCancelModal=()=>{
    this.modal.close();
  };

  handleConfirmModal=()=>{
    this.props.removeOrderItem(this.selectedItem);
    this.modal.close();
  };

  render() {
    const { t, isHome, isLogged, orderItems } = this.props;
    const { drawerOpen } = this.state;
    const totalQuantity = orderItems.reduce((a, item) => a + item.quantity, 0);
    return (
      <div>
      <nav
        className={classNames("navbar fixed-top header", {
          invisible: isHome
        })}
      >
        <div className="p-0 d-flex justify-content-between w-100">
          <div className="d-flex">

            {isMobile 
              ? <span className="navbar-brand" onClick={this.toggleDrawer}>
                  <img src="/images/logo.png" alt=""/>
                  <i className={classNames("color-red ml-2 fa", drawerOpen ? "fa-angle-up" : "fa-angle-down")} />
                </span>
              : <Link className="navbar-brand" to="/">
              <img src="/images/logo.png" alt="" />
            </Link>
            }                      

            <Suggestion />
          </div>

          <div className="d-flex align-items-center flex-row">
            <Button
              id="popoverCartBtn"              
              className="btn-round bg-red border-0"
              onClick={()=>this.popoverCart.toggle()}
            >
              <i
                className="fa fa-shopping-cart color-white"
                aria-hidden="true"
                id="cart-icon"
              />
              <span className="badge bg-red">{totalQuantity}</span>
            </Button>

            <PopoverCart               
              placement="bottom-start"        
              target="popoverCartBtn"
              orderItems={orderItems}
              onIncreaseOrder={this.increaseOrder}
              onDecreaseOrder={this.decreaseOrder}
              onItemRef={ref=>this.popoverCart=ref}
            />

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
      {isMobile && <Drawer className={classNames({"hidden": !drawerOpen})}/>}

      <ModalConfirm key="modal" onItemRef={ref=>this.modal = ref} 
          onCancel={this.handleCancelModal}
          onOK={this.handleConfirmModal} 
        >
          {t('LABEL.CONFIRM_REMOVE_CART_ITEM')}
        </ModalConfirm>

      </div>
    );
  }
}