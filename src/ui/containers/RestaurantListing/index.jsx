import React, { Component } from "react";

// elements
import Filter from "./components/Filter";
import Result from "./components/Result";

// store
// import api from "~/store/api";

import "./index.css";

export default class extends Component {

  onUpdateFilter = (filters)=>{
    // console.log(filters);
    this.result.removeSearchResult();
  };

  render() {
    return (
      <div>
        <Filter onUpdateFilter={this.onUpdateFilter}/>
        <Result onItemRef={ref=>this.result=ref}/>
      </div>
    )
  }
}