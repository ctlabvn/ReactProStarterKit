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
		filter: authSelectors.getFilter(state)
	}),
	authActions
)
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options: options.filters
		};
	}

	loadOptionFilter = async () => {
		const { options } = this.state;
		const { filter } = this.state;
		if(filter) {
			this.setState({options: filter});
		} else {
			// update tag
			const tags = await api.setting.getSettingTags();
			let tagData = {};
			tags.data.map(item => {
				tagData[item.tag_uuid] = item.name;
			});
			options.tags.body = {...options.tags.body, ...tagData};

			// update option
			const staticOptions = await api.setting.getSettingOptions();
			staticOptions.data.map(item => {
				options[item.option_key].body = {...options[item.option_key].body, ...parseJsonToObject(item.option_value)};
			});

			this.setState({options: options});
			// save to redux
			this.props.updateFilter(options);
		}
	}

	componentDidMount() {
		this.loadOptionFilter();
	}

  render() {
    // const {t} = this.props;
	  const { options } = this.state;
	  return (
      <div className="d-flex justify-content-center mb-4">
			  { Object.keys(options).map((type, i) => {
				  return <PopoverItem key={i} item={options[type]} id={type} />;
			  })}
      </div>
	  );
  }
}