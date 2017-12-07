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
// we use only updateConfig because we want to bypass all remaining props
import { updateConfig } from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";
import api from "~/store/api";
// import { isMobile } from "~/utils";

@translate("translations")
@connect(
  state => ({
    config: authSelectors.getConfig(state)
  }),
  { updateConfig }
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
    } else {
      this.setState({ suggestions: {} });
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

  getItemGallery(item) {
    const gallery = JSON.parse(item.gallery);
    return gallery ? gallery[0] : "";
  }

  renderSuggestionResult(key, label, extractLinkFn, extractImageFn, className) {
    const list = this.state.suggestions[key];
    if (list && list.length) {
      return (
        <div
          key={key}
          className={classNames("pl-2 no-gutters", className)}
        >
          <strong>{label}</strong>
          <div className="pt-2">
            {list.map(item => (
              <Link
                className="d-flex mb-2 w-100 justify-content-start align-items-center"
                key={item.id}
                to={extractLinkFn(item)}
              >
                <Image
                  showContainer
                  style={{ width: 30, height: 30 }}
                  src={extractImageFn(item)}
                  className="mr-2"
                />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    const { config, t, updateConfig, ...props } = this.props;
    const children = [];
    const itemsResult = this.renderSuggestionResult(
      "items",
      t("LABEL.ITEM"),
      item => {
        const outlet_slug = item.outlet ? item.outlet.slug : item.outlet_slug;
        return `/${outlet_slug || item.outlet_uuid}/${outlet_slug && item.slug
          ? item.slug
          : item.item_uuid}`;
      },
      this.getItemGallery,
      "suggestion-result"
    );
    const restaurantsResult = this.renderSuggestionResult(
      "outlets",
      t("LABEL.RESTAURANT"),
      item => `/${item.slug || item.outlet_uuid}`,
      item => item.logo,
      "mt-2"
    );

    itemsResult && children.push(itemsResult);
    restaurantsResult && children.push(restaurantsResult);

    return (
      <Autocomplete
        placeholder={t("PLACEHOLDER.TYPE_YOUR_SEARCH")}
        value={config.searchStr}
        onSearch={this.handleSearch}
        {...props}
      >
        {children}
      </Autocomplete>
    );
  }
}
