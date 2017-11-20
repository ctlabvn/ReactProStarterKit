import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { translate } from "react-i18next";

// elements
import Filter from "~/ui/components/Restaurant/Filter";
import Result from "./components/Result";


import { parseQuery, isMobile } from "~/utils";

import "./index.css";

@translate("translations")
export default class extends Component {

  onUpdateFilter = (filters)=>{
    // console.log(filters);
    // this.result.removeSearchResult();
  };

  render() {
    const {location, t} = this.props;
    const options = parseQuery(location);
    return (
      <div>
        <Helmet>            
            <title>{t('title')}</title>
            <meta name="description" content={t('description')} />
        </Helmet>
        {!isMobile && <Filter onUpdateFilter={this.onUpdateFilter}/>}
        <Result tags={options.tags} onItemRef={ref=>this.result=ref}/>
      </div>
    )
  }
}