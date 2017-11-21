import React, { Component } from "react";
import classNames from "classnames";
import { DropdownItem } from "reactstrap";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";

// components
import Autocomplete from "~/ui/components/Autocomplete";
import Image from "~/ui/components/Image";

// store
import * as authActions from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";
import api from "~/store/api";
import { isMobile } from "~/utils";

import "./index.css";

@translate("translations")
@connect(
  state => ({
    config: authSelectors.getConfig(state)
  }),
  authActions
)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: {}
    };

    this.timeout = null;
  }

  componentWillMount() {
    const { searchStr } = this.props.config;
    this.getSuggestion(searchStr);
  }

  async getSuggestion(term) {
    if (term) {
      const ret = await api.restaurant.getSuggestion(term);
      this.setState({ suggestions: ret.data });
    }
  }

  handleSearch = term => {
    clearTimeout(this.timeout);
    // action
    this.timeout = setTimeout(() => {
      this.props.updateConfig("searchStr", term);
      this.getSuggestion(term);
    }, 1000);
  };

  render() {
    const { config, t } = this.props;
    const { suggestions } = this.state;
    const children = [];
    if (suggestions.items) {
      children.push(
        <DropdownItem
          key="items"
          className="d-md-flex border-bottom row no-gutters"
        >
          <strong className="col-md-4">Items</strong>
          <div className="border border-top-0 border-right-0 border-bottom-0 pl-4">
            {suggestions.items.map(item => (
              <Link
                key={item.id}
                to={`/restaurant/${item.outlet_slug ||
                  item.outlet_uuid}/${item.outlet_slug && item.slug
                  ? item.slug
                  : item.item_uuid}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </DropdownItem>
      );
    }
    if (suggestions.outlets) {
      children.push(
        <DropdownItem key="outlets" className="d-md-flex row no-gutters">
          <strong className="col-md-4">Restaurants</strong>
          <div className="border border-top-0 border-right-0 border-bottom-0 pl-4">
            {suggestions.outlets.map(item => (
              <Link
                className="w-100"
                key={item.id}
                to={`/restaurant/${item.slug || item.outlet_uuid}`}
              >
                {item.name}
                <br />
                <Image src={item.logo} height="20" className="mr-2" />
              </Link>
            ))}
          </div>
        </DropdownItem>
      );
    }
    return (
      <Autocomplete
        prepend={
          <i className="fa fa-search color-black-300 mr-2 icon-search" />
        }
        value={config.searchStr}
        className="header-suggestion"
        buttonClass="border-0 mt-2"
        inputClass={classNames({ "font-medium": isMobile }, "color-gray pl-2")}
        placeholder={t("PLACEHOLDER.TYPE_YOUR_SEARCH")}
        onSearch={this.handleSearch}
      >
        {children}
      </Autocomplete>
    );
  }
}
