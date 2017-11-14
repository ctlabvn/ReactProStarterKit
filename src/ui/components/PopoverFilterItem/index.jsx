import React, { Component } from "react";
// import { connect } from "react-redux";
import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { translate } from "react-i18next";

// import * as authActions from "~/store/actions/auth";
// import * as authSelectors from "~/store/selectors/auth";

@translate("translations")
// @connect(
// 	state => ({
// 		filters: authSelectors.getFilters(state)
// 	}),
// 	authActions
// )
export default class PopoverFilterItem extends Component {
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
		const { t, id, item } = this.props;
		const { checkedItem } = this.state;

		if (item) {
			return (
				!!item.body && (
					<span className="popover-item">
						<button
							className="mr-1 btn bg-transparent"
							id={"Popover-" + id}
							onClick={this.toggle}
						>
							{t(item.text)}
							<i className="fa fa-angle-down ml-1" />
						</button>
						<Popover
							placement={item.placement}
							isOpen={this.state.popoverOpen}
							target={"Popover-" + id}
							toggle={this.toggle}
						>
							<PopoverHeader>{item.title}</PopoverHeader>
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
				)
			);
		}
		return <div />;
	}
}