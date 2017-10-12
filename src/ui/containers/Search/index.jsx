import React, { Component } from "react";

// elements
import Filter from "./components/Filter";
import Suggestion from "./components/Suggestion";
import Result from "./components/Result";

// store
import api from "~/store/api";

import "./index.css";

export default class extends Component {

  render() {
    
    return (
      <div>
        <Filter/>
        <Suggestion/>
        <Result/>
      </div>
    );
  }
}