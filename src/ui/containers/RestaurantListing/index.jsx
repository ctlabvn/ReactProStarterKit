import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { translate } from "react-i18next";

import classnames from "classnames";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

// elements
import Filter from "~/ui/components/Restaurant/Filter";
import Result from "./components/Result";

import {
  // parseQuery,
  isMobile
} from "~/utils";

import * as authSelectors from "~/store/selectors/auth";

import "./index.css";

@translate("translations")
@connect(state => ({
  filters: authSelectors.getFilters(state)
}))
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "restaurant"
    };
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  onUpdateFilter = filters => {
    // console.log(filters);
    // this.result.removeSearchResult();
  };

  getFiler = filerName => {
    let { filters } = this.props;
    if (
      !filters ||
      !filters[filerName] ||
      !filters[filerName].selected ||
      !filters[filerName].body
    )
      return null;
    return filters[filerName].selected
      .split(",")
      .map(el => filters[filerName].body[el])
      .join(",");
  };

  render() {
    const {
      t // location,
    } = this.props;
    // const options = parseQuery(location);
    const { activeTab } = this.state;
    let breadcrumbItems = [
      t("LINK.HOME"),
      t("LINK.RESTAURANT"),
      this.getFiler("city"),
      this.getFiler("ordering_method"),
      this.getFiler("delivery_fee"),
      this.getFiler("minimum_order"),
      this.getFiler("tags")
    ];

    return (
      <div className="restaurant-listing map-background">
        <Helmet>
          <title>{t("LABEL.RESTAURANT_LIST")}</title>
          <meta name="description" content={t("LABEL.RESTAURANT_LIST")} />
        </Helmet>

        {!isMobile && (
          <Filter
            className="menu-decorator restaurant-listing-filter restaurant-listing-filter-fixed my-2"
            onUpdateFilter={this.onUpdateFilter}
          />
        )}
        {!isMobile && (
          <Filter className="menu-decorator restaurant-listing-filter restaurant-listing-filter-fake my-2" />
        )}

        <div className="container mt-0">
          <Nav tabs className="flat-tabs justify-content-end pr-4 d-flex">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "restaurant" })}
                onClick={() => this.toggle("restaurant")}
              >
                {t("LABEL.RESTAURANTS")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "item"
                })}
                onClick={() => {
                  this.toggle("item");
                }}
              >
                {t("LABEL.ITEMS")}
              </NavLink>
            </NavItem>
          </Nav>
          <div className="bg-white box-shadow restaurant-listing-cart">
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="restaurant">
                <FilerView items={breadcrumbItems} />

                <Result
                  // tags={options.tags}
                  onItemRef={ref => (this.result = ref)}
                />
              </TabPane>
              <TabPane tabId="item">
                <h1>we are items</h1>
              </TabPane>
            </TabContent>
          </div>
        </div>
      </div>
    );
  }
}

const FilerView = ({ items }) => {
  return (
    <div className="breadcrumb block m-0 text-uppercase font-fr-140 bg-transparent">
      {items.map(
        (item, i) =>
          item && (
            <span key={i} className="breadcrumb-item color-cg-074">
              {item}
            </span>
          )
      )}
    </div>
  );
};
