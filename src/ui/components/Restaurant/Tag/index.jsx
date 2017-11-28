import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import { Badge } from "reactstrap";

import * as authSelectors from "~/store/selectors/auth";
import * as authActions from "~/store/actions/auth";
import * as commonActions from "~/store/actions/common";

import "./index.css";

@translate("translations")
@connect(
	state => ({
		filters: authSelectors.getFilters(state)
	}),
	{ ...commonActions, ...authActions }
)
export default class extends Component {
	static propTypes = {
		tags: PropTypes.Array,
		color: PropTypes.string
	};

	static defaultProps = {
		color: "secondary"
	};

	constructor(props) {
		super(props);
		this.state = {
			tags: props.tags || props.outlet.tags
		};
	}

	updateFilterTags(selected) {
		const { filters, updateFilters } = this.props;
		const optionsFilters = {
			...filters,
			tags: {
				...filters.tags,
				selected
			}
		};
		updateFilters(optionsFilters);
	}

	componentDidMount() {
		const { requestor, outlet } = this.props;
		if (!this.state.tags) {
			requestor(
				"restaurant/getRestaurantTag",
				outlet.outlet_uuid,
				(err, ret) => {
					if (ret.data) {
						this.setState({ tags: ret.data });
					}
				}
			);
		}
	}

	render() {
		const { tags } = this.state;
		const { className, color = "" } = this.props;
		if (tags) {
			return (
				<div className={classNames("restaurant-tags", className)}>
					{tags.map((item, index) => (
						<Link
							onClick={() => this.updateFilterTags(item.tag_uuid)}
							to="/restaurant"
							key={index}
						>
							<Badge
								key={index}
								color={color}
								className="text-default px-2 pt-1"
							>
								{item.name}
							</Badge>
						</Link>
					))}
				</div>
			);
		}

		return <div className="clearfix" />;
	}
}
