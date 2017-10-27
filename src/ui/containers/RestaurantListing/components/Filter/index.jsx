import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import PopoverItem from "~/ui/components/PopoverItem";

// component
// import Dropdown from "~/ui/components/Dropdown";

import options from "./options";
import "./index.css";

@translate('translations')
export default class extends Component {
	// constructor(props) {
	// 	super(props);

	// 	this.state = {
	// 		popovers: options.filters
	// 	};
	// }

  render() {
    
    // const {t} = this.props;
	  return (
      <div className="d-flex justify-content-center mb-4">
			  { options.filters.map((popover, i) => {
				  return <PopoverItem key={i} item={popover} id={i} />;
			  })}
      </div>
	  );

    // return (
    //   <div className="d-flex flex-row justify-content-center border-bottom search-filter">
    //     {Object.keys(options.filters).map(filterKey=>
    //       <Dropdown key={filterKey} title={t(filterKey)} className="col-md-2">
    //         {options.filters[filterKey].map((item, index)=>
    //           <span key={index}>{item}</span>
    //         )}
    //       </Dropdown>
    //     )}
    //   </div>
    // );
  }
}