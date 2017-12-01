import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { translate } from "react-i18next";

// elements
import Filter from "~/ui/components/Restaurant/Filter";
import Result from "./components/Result";

import {
  // parseQuery,
  isMobile
} from "~/utils";

import "./index.css";

@translate("translations")
export default class extends Component {
  onUpdateFilter = filters => {
    // console.log(filters);
    // this.result.removeSearchResult();
  };

  render() {
    const {
      // location,
      t
    } = this.props;
    // const options = parseQuery(location);
    return (
      <div className="restaurant-listing map-background">
        <Helmet>
          <title>{t("LABEL.RESTAURANT_LIST")}</title>
          <meta name="description" content={t("LABEL.RESTAURANT_LIST")} />
        </Helmet>
        {!isMobile && <Filter onUpdateFilter={this.onUpdateFilter} />}

        <div className="container">
          <div className="bg-white box-shadow restaurant-listing-cart">
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
