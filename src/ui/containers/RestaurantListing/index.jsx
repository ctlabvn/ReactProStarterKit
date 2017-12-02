import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { translate } from "react-i18next";

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

@connect(
  state => ({
    filters: authSelectors.getFilters(state)
  })
)

export default class extends Component {
  onUpdateFilter = filters => {
    // console.log(filters);
    // this.result.removeSearchResult();
  };

  getFiler = filerName => {
    let {filters} = this.props;
    if(!filters || !filters[filerName] || !filters[filerName].selected || !filters[filerName].body) return null;
    return filters[filerName].selected.split(',').map(el => filters[filerName].body[el]).join(',');
  };

  render() {
    const {
      t, // location,
      } = this.props;
    // const options = parseQuery(location);

    let breadcrumbItems = [
      t("LINK.HOME"),
      t("LINK.RESTAURANT"),
      this.getFiler('city'),
      this.getFiler('ordering_method'),
      this.getFiler('delivery_fee'),
      this.getFiler('minimum_order'),
      this.getFiler('tags')
    ];

    return (
      <div className="restaurant-listing map-background">
        <Helmet>
          <title>{t("LABEL.RESTAURANT_LIST")}</title>
          <meta name="description" content={t("LABEL.RESTAURANT_LIST")}/>
        </Helmet>
        {!isMobile && <Filter onUpdateFilter={this.onUpdateFilter}/>}

        <div className="container">
          <div className="bg-white box-shadow restaurant-listing-cart">

            <FilerView
              items={breadcrumbItems}
            />

            <Result
              // tags={options.tags}
              onItemRef={ref => (this.result = ref)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const FilerView = ({items}) => {
  return (
    <div className="breadcrumb block m-0 text-uppercase font-fr-140 bg-transparent">
      {items.map((item, i) => item && (
        <span key={i} className="breadcrumb-item color-cg-074">
          {item}
        </span>
      ))}
    </div>
  )
}
