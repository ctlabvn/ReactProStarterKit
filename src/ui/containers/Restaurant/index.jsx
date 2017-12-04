import React, { Component } from "react";
import { connect } from "react-redux";
// import classNames from "classnames";
import { Helmet } from "react-helmet";

import { TabContent, TabPane } from "reactstrap";

// elements
import Header from "./components/Header";
// import Footer from "./components/Footer";
import Body from "./components/Body";
import Detail from "./components/Detail";
import Spinner from "~/ui/components/Spinner";
import EmptyResult from "~/ui/components/EmptyResult";

import { extractMessage } from "~/utils";

// store
// import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";
import * as commonActions from "~/store/actions/common";

import "./index.css";

@connect(
  state => ({
    language: authSelectors.getCustomer(state).language
  }),
  commonActions
)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outlet: null,
      tabID: "restaurant-body"
    };
  }

  handleSelectTab = tabID => {
    this.setState({ tabID });
  };

  componentWillMount() {
    const { outlet_slug } = this.props.match.params;
    this.loadOutlet(outlet_slug);
  }

  loadOutlet(outlet_slug) {
    const { requestor, setToast } = this.props;
    requestor("restaurant/getOutlet", outlet_slug, (err, ret) => {
      if (err) {
        const message = extractMessage(err.message);
        setToast(message, "danger");
        this.setState({ outlet: {} });
      } else if (ret) {
        this.setState({ outlet: ret.data });
      }
    });
  }

  componentWillReceiveProps({ language, match }) {
    if (
      this.props.language !== language ||
      this.props.match.params.outlet_slug !== match.params.outlet_slug
    ) {
      this.loadOutlet(match.params.outlet_slug);
    }
  }

  render() {
    const { outlet, tabID } = this.state;
    if (!outlet) {
      return <Spinner />;
    }

    if (!outlet.name) {
      return <EmptyResult />;
    }

    const outlet_slug = outlet.slug || this.props.match.params.outlet_slug;

    return (
      <div className="map-background">
        <Helmet>
          <title>{outlet.name}</title>
          <meta name="description" content={outlet.description} />
          {outlet.currency && (
            <meta itemprop="priceCurrency" content={outlet.currency.code} />
          )}
        </Helmet>

        <div className="container container-xs">
          <Header
            outlet={outlet}
            active={tabID}
            onSelectItem={this.handleSelectTab}
          />

          <TabContent activeTab={tabID}>
            <TabPane
              className="row block box-shadow bg-white mb-4 mt-5"
              tabId="restaurant-body"
            >
              <Body outlet_slug={outlet_slug} outlet={outlet} />
            </TabPane>
            <TabPane
              className="row block box-shadow bg-white mb-4 mt-5"
              tabId="restaurant-detail"
            >
              <Detail outlet_slug={outlet_slug} outlet={outlet} />
            </TabPane>
          </TabContent>

          {/*<Footer outlet={outlet} />*/}
        </div>
      </div>
    );
  }
}
