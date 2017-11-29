import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import { getOrderSetting } from "~/utils";

@translate("translations")
export default class extends Component {
	static propTypes = {
		outlet: PropTypes.object
	};

	render() {
		const { t, outlet, ...props } = this.props;
		const metadata = getOrderSetting(outlet);

		if (metadata.length) {
			return <div {...props}>{metadata.join(" | ")}</div>;
		}

		return <div className="clearfix" />;
	}
}
