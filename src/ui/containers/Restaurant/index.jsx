import React, { Component } from "react";
import { connect } from "react-redux";

// elements
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";

// store
import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";

import "./index.css";

@connect(state => ({
  language: authSelectors.getCustomer(state).language,
}))
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outlet: null
    };
  }

  componentWillMount() {
    this.loadOutlet();
  }

  async loadOutlet() {
    const { uuid } = this.props.match.params;
    const ret = await api.restaurant.getOutlet(uuid);
    // check ret.error then show ret.message
    this.setState({ outlet: ret.data });
  }

  componentWillReceiveProps({ language }) {
    if (this.props.language !== language) {
      this.loadOutlet();
    }
  }

  render() {
    const { outlet } = this.state;
    if (!outlet) {
      return (
        <div className="d-flex flex-row justify-content-center">
          <i className="fa fa-refresh fa-spin fa-3x fa-fw" />
        </div>
      );
    }

    return (
      <div className="restaurant">
        <div className="container">
          <Header outlet={outlet} />

          <Body outlet={outlet} />

          <Footer outlet={outlet} />
        </div>
      </div>
    );
  }
}