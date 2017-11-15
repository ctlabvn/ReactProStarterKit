import React, { Component } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom"; 
import { translate } from "react-i18next";

import Image from "~/ui/components/Image";

import { getTodayString } from "~/store/utils/datetime";
import { parseJsonToObject } from "~/store/utils/json";
import './index.css';

@translate('translations')
export default class RestaurantInfo extends Component {
	static propTypes = {
		outlet: PropTypes.object,
		displayName: PropTypes.bool,
	};

	static defaultProps = {
	  displayName: false,
	}

	render() {
		const { t, outlet, displayName, ...props } = this.props;
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
					metadata.push(`${hoursOpendata.from.time} - ${hoursOpendata.to.time}`);
				} else {
					metadata.push(t('LABEL.RESTAURANT_CLOSED'));
				}
			}
		}
		return (
			<span {...props}>
				{outlet.logo &&
					<Image className="rounded mr-2 img-logo" src={outlet.logo} alt="" />
				}
				{displayName && 
					<Link className="color-black-300 mr-2" to={`/restaurant/${outlet.outlet_uuid}`}>{outlet.name}</Link>
				}
				{metadata.join(" | ")}
			</span>
		);
	}
}