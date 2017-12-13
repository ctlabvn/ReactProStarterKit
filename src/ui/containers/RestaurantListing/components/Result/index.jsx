import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import areEqual from "fbjs/lib/areEqual";

// component
import InfiniteScroller from "~/ui/components/Scroller/Infinite";
import RestaurantItemPhoto from "~/ui/components/Restaurant/Item/Photo";
import EmptyResult from "~/ui/components/EmptyResult";
import IconLoading from "~/ui/components/Loading/icon";

// store
// import api from "~/store/api";
// import options from "./options";
import "./index.css";

// selectors && actions
import * as authActions from "~/store/actions/auth";
import * as restaurantActions from "~/store/actions/restaurant";
import * as commonActions from "~/store/actions/common";
import * as authSelectors from "~/store/selectors/auth";
// import * as restaurantSelectors from "~/store/selectors/restaurant";

// import { store } from "~/store";

import { extractMessage } from "~/utils";

@translate("translations")
@connect(
  state => ({
    language: authSelectors.getCustomer(state).language,
    filters: authSelectors.getFilters(state),
    config: authSelectors.getConfig(state)
  }),
  { ...authActions, ...restaurantActions, ...commonActions }
)
export default class extends Component {
  constructor(props) {
    super(props);
    const elements = []; //restaurantSelectors.getList(store.getState());
    this.state = {
      hasMore: true,
      elements
    };
  }

  loadMoreElement = async page => {
    const {
      config,
      filters,
      requestor,
      setToast
      // , tags
    } = this.props;

    let data = this.standardFilter(filters);
    if (config.searchStr) data["keyword"] = config.searchStr;
    // if (tags) data.tags = tags;
    requestor("restaurant/searchOutlet", page, data, (err, ret) => {
      if (err) {
        setToast(extractMessage(err.message), "danger");
        // show retry button
      } else if (ret) {
        this.updateView(ret);
      }
    });
  };

  standardFilter = filter => {
    let result = {};
    const listParam = Object.keys(filter);
    if (listParam.length) {
      for (let key of listParam) {
        if (filter[key] && filter[key]["selected"]) {
          result[key] = filter[key]["selected"];
        }
      }
    }
    return result;
  };

  updateView = ret => {
    if (ret.data.data && !this.unmounted) {
      const data = ret.data.data;
      this.setState(prevState => ({
        elements: prevState.elements.concat(data),
        hasMore: data.length > 0
      }));
    }
  };

  removeSearchResult = () => {
    this.scroller.pageLoaded = 0;
    this.setState({ hasMore: true, elements: [] });
  };

  componentWillReceiveProps({ config, language, filters }) {
    // console.log(config, this.props.config)
    if (
      this.props.config.searchStr !== config.searchStr ||
      this.props.language !== language ||
      !areEqual(filters, this.props.filters)
    ) {
      // when options is ready, mean that we load all filter options from server
      // no cache
      this.removeSearchResult();
    }
  }

  componentDidMount() {
    this.props.onItemRef && this.props.onItemRef(this);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  renderResult(elements, hasMore) {
    // const { t } = this.props;
    if (elements.length)
      return elements.map(item => (
        <RestaurantItemPhoto
          key={item.outlet_uuid}
          uuid={item.outlet_uuid}
          name={item.name}
          address={item.address}
          logo={item.logo}
          restaurant={item}
        />
      ));

    if (!hasMore) return <EmptyResult />;

    return <div />;
  }

  render() {
    // const { t } = this.props;
    const { elements, hasMore } = this.state;
    return (
      <div className="pb-4">
        <InfiniteScroller
          className="row d-flex"
          hasMore={hasMore}
          loader={<IconLoading />}
          loadMore={this.loadMoreElement}
          pageStart={elements.length ? 1 : 0}
          onItemRef={ref => (this.scroller = ref)}
        >
          {this.renderResult(elements, hasMore)}
        </InfiniteScroller>
      </div>
    );
  }
}
