import React, { Component } from "react";
// import { connect } from "react-redux";
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { translate } from "react-i18next";

// import * as authActions from "~/store/actions/auth";
// import * as authSelectors from "~/store/selectors/auth";

@translate('translations')
// @connect(
// 	state => ({
// 		filters: authSelectors.getFilters(state)
// 	}),
// 	authActions
// )
export default class extends Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			popoverOpen: false,
			checkedItem: this.props.item.selected
		};
	}

	handleFilter = (e) => {
		// update redux
		const { onSelectFilter } = this.props;
		// filters[id].selected = e.currentTarget.value;


		// this.props.updateFilters(filters);

		this.setState({
			checkedItem: e.currentTarget.value
		});

		onSelectFilter && onSelectFilter(e.currentTarget.value)
	}

	toggle() {
		this.setState({
			popoverOpen: !this.state.popoverOpen
		});
	}

	render() {
		const { t, id, item } = this.props;
		const { checkedItem } = this.state;

		if(item) {
			return (
				!!item.body && <span className="popover-item">
	        <button className="mr-1 btn bg-transparent" id={'Popover-' + id} onClick={this.toggle}>
	          {t(item.text)}
	          <i className="fa fa-angle-down ml-1" />
	        </button>
	        <Popover placement={item.placement} isOpen={this.state.popoverOpen} target={'Popover-' + id} toggle={this.toggle}>
	          <PopoverHeader>{item.title}</PopoverHeader>
	          <PopoverBody>
		          <div className="w-100">
								<ul className="list-unstyled">
									{Object.keys(item.body).map((line, index) => (
										<li key={index}>
											<input id={item.body[line] + index} name={item.name} value={line} type="radio" onChange={this.handleFilter} checked={line === checkedItem} />
											&nbsp; <label htmlFor={item.body[line] + index}>{item.body[line]}</label>
										</li>
									))}
								</ul>
							</div>
	          </PopoverBody>
	        </Popover>
	      </span>
			);
		}
		return (
			<div></div>
		);
	}
}