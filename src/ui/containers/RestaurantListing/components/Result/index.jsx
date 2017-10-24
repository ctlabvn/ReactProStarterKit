import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";

// component
import InfiniteScroller from "~/ui/components/Scroller/Infinite";
import RestaurantItemPhoto from "~/ui/components/Restaurant/Item/Photo";
import EmptyResult from "~/ui/components/EmptyResult";

// store
import api from "~/store/api";
import options from "./options";
import "./index.css";

// selectors && actions
import * as authActions from "~/store/actions/auth";
import * as restaurantActions from "~/store/actions/restaurant";
import * as authSelectors from "~/store/selectors/auth";
import * as restaurantSelectors from "~/store/selectors/restaurant";

import { store } from "~/store";

@translate("translations")
@connect(
  state => ({
    config: authSelectors.getConfig(state)
  }),
  { ...authActions, ...restaurantActions }
)
export default class extends Component {
  constructor(props) {
    super(props);
    const elements = restaurantSelectors.getList(store.getState());
    this.state = {
      hasMore: true,
      elements
    };
  }

  loadMoreElement = async page => {
    const { config } = this.props;
    try {
      let ret = [];
      if (config.searchStr) {        
        ret = await api.restaurant.searchOutlet(page, config.searchStr);
        this.updateView(ret);      
      } else {
        ret = await api.restaurant.getOutlets(page);
        this.updateView(ret);
      }
      if (page === 1) {
        this.props.saveRestaurants(ret);
      }
    } catch (err) {
      console.log(err);
    }
  };

  updateView = ret => {
    if (!ret.status && ret.data.data && !this.unmounted) {
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

  componentWillReceiveProps({ config }) {
    if (
      // config.searchStr &&
      config.searchStr !== this.props.config.searchStr
      // config.searchStr.length >= 3
    ) {
      this.removeSearchResult();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  showLoading = () => (
    <div className="col-12 text-center d-flex flex-row justify-content-center py-2">
      <i className="fa fa-refresh fa-spin fa-3x fa-fw" />
    </div>
  );

  renderResult(elements, hasMore) {
    const { t } = this.props;
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

    if (!hasMore)
      return <EmptyResult/>;

    return null;
  }

  render() {
    const { t } = this.props;
    const { elements, hasMore } = this.state;
    return (
      <div className="container-fluid bg-white py-4">
        <InfiniteScroller
          className="row d-flex"
          hasMore={hasMore}
          loader={this.showLoading()}
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