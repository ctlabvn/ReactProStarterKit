import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import PopoverItem from "~/ui/components/PopoverItem";
import { parseJsonToObject } from "~/store/utils/json";

// component
// import Dropdown from "~/ui/components/Dropdown";

import options from "./options";
import "./index.css";

import * as authActions from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";
import api from "~/store/api";

@translate('translations')
@connect(
	state => ({
		filters: authSelectors.getFilters(state)
	}),
	authActions
)
export default class extends Component {
	constructor(props) {
		super(props);
	}

	loadOptionFilter = async () => {
		const { filters } = this.props;
		if(!filters.length) {
			const tags = await api.setting.getSettingTags();
			let tagData = {};
			tags.data.map(item => {
				tagData[item.tag_uuid] = item.name;
			});
			options.filters.tags.body = {...options.filters.tags.body, ...tagData};

			// update option
			const staticOptions = await api.setting.getSettingOptions();
			staticOptions.data.map(item => {
				options.filters[item.option_key].body = {...options.filters[item.option_key].body, ...parseJsonToObject(item.option_value)};
			});

			// save to redux
			this.props.updateFilters(options.filters);
		}
	}

	componentDidMount() {
		this.loadOptionFilter();
	}

  render() {
    // const {t} = this.props;
	  const { filters } = this.props;
	  return (
      !!filters && <div className="d-flex justify-content-center mb-4">
			  { Object.keys(filters).map((type, i) => {
				  return <PopoverItem key={i} item={filters[type]} id={type} />;
			  })}
      </div>
	  );
  }
}