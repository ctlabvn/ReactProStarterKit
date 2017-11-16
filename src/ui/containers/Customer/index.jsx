import React, { Component } from "react";
import { translate } from "react-i18next";

import { connect } from "react-redux";

import { NavLink, Route } from "react-router-dom";

// reactstrap
import {
  // Button,
  // Form,
  // FormGroup,
  // Row,
  ListGroup,
  ListGroupItem
} from "reactstrap";

import CustomerProfile from "./Profile";
import Order from "./Order";

// // store
// import * as commonActions from "~/store/actions/common";
// import * as authActions from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";

import { VERSION } from "~/store/constants/api";

@translate("translations")
@connect(state=>({
  isLogged: authSelectors.isLogged(state),
}))
export default class extends Component {
  renderProfileMenu() {
    return (
      <ListGroup>
        <ListGroupItem>
          <NavLink activeClassName="font-weight-bold" className="color-black" to="/customer/profile">
            <i className="fa fa-user mr-2" />
            Profile
          </NavLink>
        </ListGroupItem>
        {VERSION > 1 &&
        <ListGroupItem>
          <NavLink activeClassName="font-weight-bold" className="color-black" to="/customer/payment">
            <i className="fa fa-credit-card mr-2" />
            Payment
          </NavLink>
        </ListGroupItem>
      }
        <ListGroupItem>
          <NavLink activeClassName="font-weight-bold" className="color-black" to="/customer/order">
            <i className="fa fa-history mr-2" />
            Orders
          </NavLink>
        </ListGroupItem>
      </ListGroup>
    );
  }

  render() {
    const { match, isLogged } = this.props;    
    if(!isLogged){
      // can go to login page or something
      return <h1 className="position-center">You are unauthorized, please login</h1>
    }
    return (
      <div className="container">
        <h2>Edit Profile</h2>
        <hr />
        <div className="row">
          <div className="col-md-4">

            {VERSION > 1 &&
            <div className="text-center mb-4">
              <img
                src="//placehold.it/100"
                className="rounded-circle mb-4"
                alt="avatar"
              />
              <input type="file" className="form-control border-0" />
            </div>
          }
            {this.renderProfileMenu()}
          </div>

          <div className="col-md-8">
            <Route path={`${match.url}/profile`} component={CustomerProfile} />
            <Route exact path={`${match.url}/order`} component={Order} />
          </div>
        </div>
      </div>
    );
  }
}