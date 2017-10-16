import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// store
import * as commonActions from "~/store/actions/common";
import * as restaurantActions from "~/store/actions/restaurant";
import * as restaurantSelectors from "~/store/selectors/restaurant";
import * as authSelectors from "~/store/selectors/auth";

// components
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";

import "./index.css";
@translate('translations')
@connect(
  state => ({
    restaurants: restaurantSelectors.getList(state),
    language: authSelectors.getCustomer(state).language,
  }),
  { ...commonActions, ...restaurantSelectors }
)
export default class extends Component {
  componentWillMount() {
    // get data if not have, or can validate follow expiry
    const { restaurants, requestor } = this.props;    
    if (!restaurants.length) {
      requestor("restaurant/getOutlets");
    }
  }

  loadOutlets = async () => {
    // this.props.requestor("restaurant/getOutlets");
    this.props.history.push(`/search?q=${this.inputSearch.value.trim()}`);
  };

  componentWillReceiveProps({language}){
    if(this.props.language !== language) {
      // can pass language, but language already stored in cookie, we just re-store it in localStorage
      this.props.requestor("restaurant/getOutlets");
    }
  }

  render() {
    const { t, restaurants } = this.props;
    return (
      <div className="d-flex flex-column align-items-center">
        <img alt="" src="/images/home-logo.png" />

        <div className="input-group input-group-lg col-md-5 m-5">
          <input
            ref={ref => (this.inputSearch = ref)}
            type="text"
            className="form-control"
            placeholder={t('PLACEHOLDER.TYPE_YOUR_PRODUCT')}
            aria-label=""
          />
          <span className="input-group-btn">
            <button
              className="btn btn-outline-secondary"
              onClick={this.loadOutlets}
            >
              <i className="fa fa-search" aria-hidden="true" />
            </button>
          </span>
        </div>
        <div className="col-md-5">
          <label className="pull-left">{t('LABEL.SUGGESSTION')}:</label>
        </div>
        <Menu className="col-md-5">
          {restaurants.map(item => (
            <MenuItem
              key={item.outlet_uuid}
              link={`/restaurant/${item.outlet_uuid}`}
              title={item.name}
            />
          ))}
        </Menu>
      </div>
    );
  }
}