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
	// constructor(props) {
	// 	super(props);
	// }

	loadOptionFilter = async () => {
		const { filters } = this.props;

		if(!filters.length) {
			const tags = await api.setting.getSettingTags();
			let tagData = {};
			tags.data.forEach(item => {
				tagData[item.tag_uuid] = item.name;
			});
			options.filters.tags.body = {...options.filters.tags.body, ...tagData};

			// add countries
			const countries = await api.setting.getSettingCountries();
			let citiesData = {};
			if(countries.data) {
				for(let country of countries.data) {
					const cities = await api.setting.getSettingCities(country.short_name);
					if(cities.data) {
						for(let city of cities.data) {
							citiesData[city.short_name] = city.long_name;
						}
					}
				}
			}
			options.filters.location.body = {...options.filters.location.body, ...citiesData};

			// update option
			const staticOptions = await api.setting.getSettingOptions();
			// console.log(staticOptions);
			staticOptions.data.forEach(item => {
				options.filters[item.option_key].body = {...options.filters[item.option_key].body, ...parseJsonToObject(item.option_value)};
			});

			// save to redux
			this.props.updateFilters(options.filters);			
		}
	}

	onSelectFilter(id, selected){		
		const { filters } = this.props;
		options.filters = {
			...filters,
			[id]: {
				...filters[id],
				selected
			}
		};
		this.props.updateFilters(options.filters);

		this.props.onUpdateFilter && this.props.onUpdateFilter(options.filters);
	}

	componentDidMount() {
		this.loadOptionFilter();
	}

  render() {
    // const {t} = this.props;
	  const { filters } = this.props;
	  return (
      !!filters && <div className="d-flex justify-content-center my-5">
			  { Object.keys(filters).map((type, i) => {
				  return <PopoverItem key={i} item={filters[type]} id={type} onSelectFilter={(selected)=>this.onSelectFilter(type, selected)} />;
			  })}
      </div>
	  );
  }
}