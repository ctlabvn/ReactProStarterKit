import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
//import PopoverFilterItem from "~/ui/components/PopoverFilterItem";
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import { Popover, PopoverHeader, PopoverBody } from "reactstrap";

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
  constructor(props) {
    super(props);
    this.state = {
      active: ""
    };
	 }

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
    this.setState({
      active: id
    });

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
    const {t} = this.props;
    const {active} = this.state;
		const { filters, placeOnDrawer, className } = this.props;
		return (
			!!filters && (
        //<div className={className}>
        //  {placeOnDrawer && <hr />}
        //  {Object.keys(filters).map((type, i) => {
        //    return (
        //      <PopoverFilterItem
        //        key={i}
        //        item={filters[type]}
        //        id={type}
        //        onSelectFilter={selected => this.onSelectFilter(type, selected)}
        //      />
        //    );
        //  })}
        //</div>

        <Menu className={className}>
          {placeOnDrawer && <hr />}
          <div className="container">
            {Object.keys(filters).map((type, i) => (
              !!filters[type].body &&
              <MenuItemPopover
                active={active === type}
                key={i}
                title={t(filters[type].text)}
                item={filters[type]}
                id={type}
                onSelectFilter={selected => this.onSelectFilter(type, selected)}
                ac
              />
            ))}
          </div>

        </Menu>
			)
		);
	}
}

class MenuItemPopover extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
      checkedItem: Array.isArray(props.item.selected)
        ? props.item.selected
        : [props.item.selected]
    };
  }

  handleFilter = e => {
    // update redux
    const { onSelectFilter, item } = this.props;
    let checkedItem = this.state.checkedItem.filter(v => v);
    const value = e.target.value;
    // filters[id].selected = e.currentTarget.value;
    if (item.multiple) {
      if (e.target.checked) {
        checkedItem = value ? [...checkedItem, value] : [""];
      } else {
        checkedItem = value ? checkedItem.filter(v => v !== value) : [];
      }
    } else {
      checkedItem = [value];
    }

    // this.props.updateFilters(filters);

    this.setState({
      checkedItem
    });

    onSelectFilter && onSelectFilter(checkedItem);
  };

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    const {title, item, id, active} = this.props;
    const { checkedItem } = this.state;

    return (
      <span className="popover-item">
        <MenuItem
          active={active}
          onClick={this.toggle}
          title={title}
          id={"Popover-" + id}
          icon="fa fa-angle-down ml-1"
        />
        <Popover
          placement={item.placement}
          isOpen={this.state.popoverOpen}
          target={"Popover-" + id}
          toggle={this.toggle}
        >
          <PopoverHeader>{title}</PopoverHeader>
          <PopoverBody>
            <div className="w-100">
              <ul className="list-unstyled">
                {Object.keys(item.body).sort().map((line, index) => (
                  <li key={index}>
                    <input
                      id={item.body[line] + index}
                      name={item.name}
                      value={line}
                      type={item.multiple ? "checkbox" : "radio"}
                      onChange={this.handleFilter}
                      checked={checkedItem.some(v => v === line)}
                    />
                    &nbsp;{" "}
                    <label htmlFor={item.body[line] + index}>
                      {item.body[line]}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}

