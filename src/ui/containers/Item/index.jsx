import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

// elements
import Header from "./components/Header";
import Body from "./components/Body";
import IconLoading from "~/ui/components/Loading/icon";
import EmptyResult from "~/ui/components/EmptyResult";

import { extractMessage } from "~/utils";

// store
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
      item: null,
      outlet: null
    };
  }

  componentWillMount() {
    const { outlet_slug, item_slug } = this.props.match.params;
    this.loadData(outlet_slug, item_slug);
  }

  componentWillReceiveProps({ language, match }) {
    if (
      this.props.language !== language ||
      this.props.match.params.item_slug !== match.params.item_slug
    ) {
      this.loadData(match.params.outlet_slug, match.params.item_slug);
    }
  }

  loadData(outlet_slug, item_slug) {
    const { requestor, setToast } = this.props;
    requestor("restaurant/getItem", item_slug, outlet_slug, (err, { data }) => {
      if (err) {
        const message = extractMessage(err.message);
        setToast(message, "danger");
        this.setState({ outlet: null, item: {} });
      } else {
        requestor("restaurant/getOutlet", data.outlet_uuid, (err1, ret) => {
          this.setState({ outlet: err1 ? null : ret.data, item: data });
        });
      }
    });
  }

  render() {
    const { item, outlet } = this.state;
    if (!item) {
      return <IconLoading />;
    }

    return (
      <div className="map-background">
        {outlet ? (
          <div className="container container-xs">
            <Helmet>
              <title>{item.name}</title>
              <meta name="description" content={item.description} />
            </Helmet>
            <Header outlet={outlet} item={item} />
            {
              //<Body outlet={outlet} item={item} />
            }

          </div>
        ) : (
          <EmptyResult />
        )}
      </div>
    );
  }
}
