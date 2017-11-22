import React, { Component } from "react";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
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
@connect(state => ({
  isLogged: authSelectors.isLogged(state)
}))
export default class extends Component {
  renderProfileMenu() {
    const { t } = this.props;
    return (
      <ListGroup>
        <ListGroupItem>
          <NavLink
            activeClassName="font-weight-bold"
            className="color-black"
            to="/customer/profile"
          >
            <i className="fa fa-user mr-2" />
            {t("LABEL.PROFILE")}
          </NavLink>
        </ListGroupItem>
        {VERSION > 1 && (
          <ListGroupItem>
            <NavLink
              activeClassName="font-weight-bold"
              className="color-black"
              to="/customer/payment"
            >
              <i className="fa fa-credit-card mr-2" />
              {t("LABEL.PAYMENT")}
            </NavLink>
          </ListGroupItem>
        )}
        <ListGroupItem>
          <NavLink
            activeClassName="font-weight-bold"
            className="color-black"
            to="/customer/order"
          >
            <i className="fa fa-history mr-2" />
            {t("LABEL.ORDERS")}
          </NavLink>
        </ListGroupItem>
      </ListGroup>
    );
  }

  render() {
    const { match, isLogged, t } = this.props;
    if (!isLogged) {
      // can go to login page or something
      return (
        <h1 className="position-center">You are unauthorized, please login</h1>
      );
    }
    return (
      <div className="container">
        <Helmet>
          <title>{t("LABEL.EDIT_PROFILE")}</title>
          <meta name="description" content={t("LABEL.EDIT_PROFILE")} />
        </Helmet>

        <h2>{t("LABEL.EDIT_PROFILE")}</h2>
        <hr />
        <div className="row">
          <div className="col-md-3">
            {VERSION > 1 && (
              <div className="text-center mb-4">
                <img
                  src="//placehold.it/100"
                  className="rounded-circle mb-4"
                  alt="avatar"
                />
                <input type="file" className="form-control border-0" />
              </div>
            )}
            {this.renderProfileMenu()}
          </div>

          <div className="col-md-9">
            <Route path={`${match.url}/profile`} component={CustomerProfile} />
            <Route exact path={`${match.url}/order`} component={Order} />
          </div>
        </div>
      </div>
    );
  }
}
