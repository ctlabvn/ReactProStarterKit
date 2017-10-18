import React, { Component } from "react";
import { connect } from "react-redux";

// elements
import Header from "./components/Header";
import Body from "./components/Body";

// store
import api from "~/store/api";
import "./index.css";

@connect(state => ({
  // language: authSelectors.getCustomer(state).language,
}))
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
    const item = await api.item.getDetail(uuid);
    const outlet = await api.restaurant.getOutlet(item.data.outlet_uuid);
    // check ret.error then show ret.message
    this.setState({ outlet: outlet.data, item: item.data });
  }

  componentWillReceiveProps({ language }) {
    if (this.props.language !== language) {
      this.loadData();
    }
  }

  render() {
    const { item, outlet } = this.state;
    if (!item) {
      return (
        <div className="d-flex flex-row justify-content-center">
          <i className="fa fa-refresh fa-spin fa-3x fa-fw" />
        </div>
      );
    }

    return (
      <div className="screen-item">
        <div className="container">
          <Header outlet={outlet} item={item} />
          <Body outlet={outlet} item={item} />
        </div>
      </div>
    );
  }
}