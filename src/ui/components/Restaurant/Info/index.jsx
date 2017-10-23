import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import './index.css';
import { getTodayString } from "~/store/utils/datetime";
import { parseJsonToObject } from "~/store/utils/json";

@translate('translations')
export default class extends Component {
	static propTypes = {
		outlet: PropTypes.object
	};

	render() {
		const { t, outlet, ...props } = this.props;
		const metadata = [];
		if(outlet) {
			if(outlet.address) {
				metadata.push(outlet.address);
			}
			if(outlet.phone) {
				metadata.push(outlet.phone);
			}
			if(outlet.online_order_setting && outlet.online_order_setting.hours_open) {
				const workingTime = parseJsonToObject(outlet.online_order_setting.hours_open);
				const todayString = getTodayString();
				const hoursOpendata = workingTime[todayString.toString().toUpperCase()];
				if(hoursOpendata && hoursOpendata.open) {
					metadata.push(`${hoursOpendata.from} - ${hoursOpendata.to}`);
				} else {
					metadata.push(t('LABEL.RESTAURANT_CLOSED'));
				}
			}
		}

		return (
			<span>
				{outlet.logo &&
					<img className="rounded mr-4 img-logo" src={outlet.logo} alt="" />
				}
				{metadata.join(" | ")}
			</span>
		);
	}
}