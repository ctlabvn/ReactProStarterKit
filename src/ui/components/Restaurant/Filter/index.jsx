import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import PopoverFilterItem from "~/ui/components/PopoverFilterItem";

// component
// import Dropdown from "~/ui/components/Dropdown";

import options from "./options";
import "./index.css";

import * as authActions from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";
import api from "~/store/api";

import { parseJsonToObject } from "~/utils";
// import { isMobile } from "~/utils";

@translate("translations")
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
		// clone new one
		const optionsFilters = { ...filters };
		if (!filters.length) {
			const tags = await api.setting.getSettingTags();
			let tagData = {};
			tags.data.forEach(item => {
				tagData[item.tag_uuid] = item.name;
			});
			optionsFilters.tags.body = { ...filters.tags.body, ...tagData };

			// add countries
			const countries = await api.setting.getSettingCountries();
			let citiesData = {};
			if (countries.data) {
				for (let country of countries.data) {
					const cities = await api.setting.getSettingCities(country.short_name);
					if (cities.data) {
						for (let city of cities.data) {
							citiesData[city.short_name] = city.long_name;
						}
					}
				}
			}
			optionsFilters.city.body = {
				...filters.city.body,
				...citiesData
			};

			// update option
			const staticOptions = await api.setting.getSettingOptions();
			// console.log(staticOptions);
			staticOptions.data.forEach(item => {
				optionsFilters[item.option_key].body = {
					...filters[item.option_key].body,
					...parseJsonToObject(item.option_value)
				};
			});

			// save to redux
			this.props.updateFilters(optionsFilters);
			// mark ready
			options.ready = true;
		}
	};

	onSelectFilter(id, selected) {
		const { filters } = this.props;
		const optionsFilters = {
			...filters,
			[id]: {
				...filters[id],
				selected: selected.join(",")
			}
		};
		this.props.updateFilters(optionsFilters);
		this.props.onUpdateFilter && this.props.onUpdateFilter(optionsFilters);
	}

	componentDidMount() {
		this.props.onItemRef && this.props.onItemRef(this);
		// cache after amount of time, will define later
		// if(!this.props.filters.city){
		this.loadOptionFilter();
		// }
	}

	render() {
		// const {t} = this.props;

		const { filters, placeOnDrawer } = this.props;
		console.log(filters);
		return (
			!!filters && (
				<div className="my-2 container">
					{placeOnDrawer && <hr />}
					{Object.keys(filters).map((type, i) => {
						return (
							<PopoverFilterItem
								key={i}
								item={filters[type]}
								id={type}
								onSelectFilter={selected => this.onSelectFilter(type, selected)}
							/>
						);
					})}
				</div>
			)
		);
	}
}
