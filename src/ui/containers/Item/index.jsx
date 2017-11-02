import React, { Component } from "react";
import { connect } from "react-redux";

// elements
import Header from "./components/Header";
import Body from "./components/Body";
import IconLoading from "~/ui/components/Loading/icon";
import EmptyResult from "~/ui/components/EmptyResult";

import { extractMessage } from "~/ui/utils";

// store
import api from "~/store/api";
import * as commonActions from "~/store/actions/common";
import "./index.css";

@connect(state => ({
  // language: authSelectors.getCustomer(state).language,
}), commonActions)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: null,
      outlet: null
    };
  }

  componentWillMount() {
    this.loadData();
  }

  async loadData() {
    const { uuid } = this.props.match.params;
    try {
      const item = await api.item.getDetail(uuid);
      const outlet = await api.restaurant.getOutlet(item.data.outlet_uuid);
      // check ret.error then show ret.message
      this.setState({ outlet: outlet.data, item: item.data });
    } catch (e) {
      const message = extractMessage(e.message);
      this.setState({ item: {} });
      this.props.setToast(message, "danger");
    }
  }

  componentWillReceiveProps({ language }) {
    if (this.props.language !== language) {
      this.loadData();
    }
  }

  render() {
    const { item, outlet } = this.state;
    if (!item) {
      return <IconLoading />;
    }

    return (
      <div className="screen-item">
        {outlet ?
        <div className="container">
          <Header outlet={outlet} item={item} />
          <Body outlet={outlet} item={item} />
        </div>
        : <EmptyResult/> }
      </div>
    );
  }
}