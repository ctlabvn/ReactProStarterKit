import React from "react";
import { ConnectedRouter } from "react-router-redux";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import PropTypes from "prop-types";

import App from "./containers/App";

import NotFound from "./containers/NotFound";
import Home from "./containers/Home";
import Search from "./containers/Search";
import Restaurant from "./containers/Restaurant";
import Cart from "./containers/Cart";
import CustomerProfile from "./containers/Customer/Profile";
import Order from "./containers/Customer/Order";


// stateless component
const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/checkout" component={Cart} />
          <Route exact path="/restaurant/:uuid" component={Restaurant} />
          <Route exact path="/customer/profile" component={CustomerProfile} />
          <Route exact path="/customer/order" component={Order} />
          <Route component={NotFound} />
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Root;