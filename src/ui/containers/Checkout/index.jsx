import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { Row, Col, Button } from "reactstrap";

// components
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";

// store
import * as commonActions from "~/store/actions/common";
import * as restaurantActions from "~/store/actions/restaurant";
import * as restaurantSelectors from "~/store/selectors/restaurant";
import * as authSelectors from "~/store/selectors/auth";

// components
import Signup from "./Signup";
import Login from "./Login";
import Order from "./Order";

import "./index.css";

@translate("translations")
@connect(
  state => ({
    isLogged: authSelectors.isLogged(state),
    address: authSelectors.getAddress(state)
  }),
  { ...commonActions, ...restaurantSelectors }
)
export default class extends Component {
  componentWillMount() {
    // get data if not have, or can validate follow expiry
  }

  renderHasAccount() {
    const { address } = this.props;
    return (
      <div>
        <h4 className="text-center">Delivery address</h4>
        <Menu className="list-group">
          {address.map((item, index) => (
            <MenuItem
              title={`${item.name} - ${item.address}`}
              active={index === 0}
              key={index}
            />
          ))}
        </Menu>

        <div className="w-100 text-center">
          <Button color="primary">Confirm & Pay</Button>
        </div>
      </div>
    );
  }

  renderHasNoAccount() {
    return (
      <div>
        <h4 className="text-center">Create an account</h4>
        <Signup />
        <h4 className="text-center mt-5">Have an account?</h4>
        <Login />
      </div>
    );
  }

  render() {
    const { t, isLogged } = this.props;
    return (
      <div className="container">
        <Row>
          <Col md="8">
            {isLogged ? this.renderHasAccount() : this.renderHasNoAccount()}
          </Col>
          <Col>
            <Order />
          </Col>
        </Row>
      </div>
    );
  }
}