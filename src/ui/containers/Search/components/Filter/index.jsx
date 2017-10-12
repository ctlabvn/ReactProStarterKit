import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

// component
import Dropdown from "~/ui/components/Dropdown";

import options from "./options";
import "./index.css";

@translate('translations')
export default class extends Component {
  render() {
    
    const {t} = this.props;    

    return (
      <div className="d-flex flex-row justify-content-center">
        {Object.keys(options.filters).map(filterKey=>
          <Dropdown key={filterKey} title={t(filterKey)} className="col-md-2"> 
            {options.filters[filterKey].map((item, index)=>
              <span key={index}>{item}</span>
            )}
          </Dropdown>
        )}                        
      </div>
    );
  }
}