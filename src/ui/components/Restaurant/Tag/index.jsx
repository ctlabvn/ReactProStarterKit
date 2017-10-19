import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { Badge } from 'reactstrap';

@translate('translations')
export default class extends Component {
	static propTypes = {
		outlet: PropTypes.object
	};

	render() {
		const { outlet, ...props } = this.props;
		return (
			<div id="restaurant-tags" className="mt-3">
				{outlet.tags && outlet.tags.map((item, index) => (
					<Badge color="secondary"><h5 className="m-0">{item.name}</h5></Badge>
				))}
			</div>
		);
	}
}