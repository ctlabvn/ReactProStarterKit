import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";

// component
import InfiniteScroller from "~/ui/components/Scroller/Infinite";
import RestaurantItemPhoto from "~/ui/components/Restaurant/Item/Photo";

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
    config: authSelectors.getConfig(state),    
  }),
  { ...authActions, ...restaurantActions }
)
export default class extends Component {
  constructor(props) {
    super(props);
    const elements = restaurantSelectors.getList(store.getState());
    this.state = {
      hasMore: true,
      elements,      
    };
  }

  loadMoreElement = async (page) => {
    // console.log('page', page)
    const { config } = this.props;
    try {
      let ret = [];
      if (config.searchStr) {
        ret = await api.restaurant.searchOutlet(
          page,
          config.searchStr
        );
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
    if (!ret.status && ret.data.data) {
      const data = ret.data.data;      
      this.setState(prevState => ({
        elements: prevState.elements.concat(data),
        hasMore: data.length > 0
      }));
    }
  };

  componentWillReceiveProps(nextProps) {
    const { config } = this.props;
    if (config.searchStr && config.searchStr.length >= 3) {
      this.scroller.pageLoaded = 0;
      this.setState({ hasMore: true, elements: []});            
    }
  }

  showLoading = () => (
    <div className="col-12 text-center d-flex flex-row justify-content-center py-2">
      <i className="fa fa-refresh fa-spin fa-3x fa-fw" />
    </div>
  );

  render() {
    const { elements } = this.state;
    return (
      <div className="container-fluid bg-white py-4">
        <InfiniteScroller
          ref={ref=>this.scroller = ref}
          className="row d-flex"
          hasMore={this.state.hasMore}
          loader={this.showLoading()}
          pageStart={elements.length ? 1 : 0}
          loadMore={this.loadMoreElement}
        >
          {elements.map((item) => (
            <RestaurantItemPhoto
              key={item.outlet_uuid}
              uuid={item.outlet_uuid}
              name={item.name}
              address={item.address}
              logo={item.logo}
              restaurant={item}
            />
          ))}
        </InfiniteScroller>
      </div>
    );
  }
}