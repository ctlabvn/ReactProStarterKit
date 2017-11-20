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

  componentWillMount(){
    const {searchStr} = this.props.config;
    this.getSuggestion(searchStr);
  }

  async getSuggestion(term){
    if(term){
      const ret = await api.restaurant.getSuggestion(term);
      this.setState({ suggestions: ret.data });
    }
  }

  handleSearch = term => {
    clearTimeout(this.timeout);
    // action
    this.timeout = setTimeout(() => {
      this.props.updateConfig("searchStr", term);
      this.getSuggestion(term)
    }, 1000);
  };

  render() {
    const { config, t } = this.props;
    const { suggestions } = this.state;
    const children = [];
    if (suggestions.items) {
      suggestions.items.forEach(item =>
        children.push(
          <DropdownItem key={item.id}>
            <Link to={`/restaurant/${item.outlet_uuid}/item/${item.slug || item.item_uuid}`}>{item.name}</Link>
          </DropdownItem>
        )
      );
    }
    if (suggestions.outlets) {
      suggestions.outlets.forEach(item =>
        children.push(
          <DropdownItem key={item.id}>
            <Link to={`/restaurant/${item.slug || item.outlet_uuid}`}>
              <Image src={item.logo} width="50" className="mr-2" />
              {item.name}
            </Link>
          </DropdownItem>
        )
      );
    }
    return (
      <Autocomplete
        prepend={<i className="fa fa-search color-black-300 mr-2 icon-search" />}
        value={config.searchStr}
        className="header-suggestion"
        buttonClass="border-0 mt-2"
        inputClass={classNames({"font-medium": isMobile}, "color-gray pl-2")}
        placeholder={t("PLACEHOLDER.TYPE_YOUR_SEARCH")}
        onSearch={this.handleSearch}
      >
        {children}
      </Autocomplete>
    );
  }
}