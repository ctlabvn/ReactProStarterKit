import React, { Component } from "react";

// elements
import Filter from "~/ui/components/Restaurant/Filter";
import Result from "./components/Result";


import { parseQuery, isMobile } from "~/ui/utils";

import "./index.css";

export default class extends Component {

  onUpdateFilter = (filters)=>{
    // console.log(filters);
    // this.result.removeSearchResult();
  };

  render() {
    const {location} = this.props;
    const options = parseQuery(location);
    return (
      <div>
        {!isMobile && <Filter onUpdateFilter={this.onUpdateFilter}/>}
        <Result tags={options.tags} onItemRef={ref=>this.result=ref}/>
      </div>
    )
  }
}