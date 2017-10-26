import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import PopoverItem from "~/ui/components/PopoverItem";

// store
import * as authActions from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";

import options from "./options";
import "./index.css";

@translate('translations')
@connect(
	state => ({
		config: authSelectors.getFilter(state)
	}),
	authActions
)
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			popovers: options.filters
		}
	}

	handleFilter = () => {
		console.log('ok');
	}

  render() {
    const {t} = this.props
	  return (
      <div className="d-flex justify-content-center mb-4">
			  { this.state.popovers.map((popover, i) => {
				  return <PopoverItem key={i} item={popover} id={i} onCheck={this.handleFilter()} />
			  })}
      </div>
	  )

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