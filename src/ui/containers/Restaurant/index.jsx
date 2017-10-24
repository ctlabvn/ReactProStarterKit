import React, { Component } from "react";
import { connect } from "react-redux";

// elements
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import Detail from "./components/Detail";
import Spinner from "~/ui/components/Spinner";
import EmptyResult from "~/ui/components/EmptyResult";

// store
import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";
import * as commonActions from "~/store/actions/common";

import "./index.css";

@connect(state => ({
  // language: authSelectors.getCustomer(state).language,
}), commonActions)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outlet: null
    };
  }

  componentWillMount() {
    const { uuid } = this.props.match.params;
    this.loadOutlet(uuid);
  }

  async loadOutlet(uuid) {    
    try {
      // fetch outlet detail then push to state
      const retOutlet = await api.restaurant.getOutlet(uuid);
      const retOutletCaterogies = await api.restaurant.getCategories(uuid);
      retOutlet.data.categories = retOutletCaterogies.data.data;
      // check ret.error then show ret.message
      this.setState({ outlet: retOutlet.data });
    } catch (e) {
      this.props.setToast(e.message.general, "danger");
      this.setState({ outlet: {} });
    }
  }

  componentWillReceiveProps({ language, match }) {    
    if ((this.props.language !== language) || (this.props.match.params.uuid !== match.params.uuid)) {
      this.loadOutlet(match.params.uuid);
    }
  }

  render() {
    const { outlet } = this.state;
    if (!outlet) {
      return <Spinner />;
    }

    if(!outlet.name){
      return <EmptyResult/>;
    }

    const toggleClass = "restaurant-tab";
    return (
      <div className="restaurant">
        <div className="container">
          <Header outlet={outlet} />

          <Body outlet={outlet} toggleClass={toggleClass} />
          <Detail outlet={outlet} toggleClass={toggleClass} />

          {/*<Footer outlet={outlet} />*/}
        </div>
      </div>
    );
  }
}