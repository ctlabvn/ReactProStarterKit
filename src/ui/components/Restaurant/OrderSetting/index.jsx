import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

@translate('translations')
export default class extends Component {
	static propTypes = {
		outlet: PropTypes.object
	};

	formatCurrency = (price, symbol = "₫") => {
		const { t } = this.props;
		return t("format.currency", {
			price: price,
			symbol: symbol
		});
	}

	render() {
		const { t, outlet:{online_order_setting:setting}, ...props } = this.props;
		const metadata = []
		if(setting) {
			if(setting.do_delivery) {
				metadata.push(t('LABEL.DELIVERY'));
			}
			if(setting.do_takeaway) {
				metadata.push(t('LABEL.TAKEAWAY'));
			}

			// display this for delivery only
			if(setting.do_delivery) {
				if(setting.min_delivery_cost) {
					metadata.push(t('LABEL.MIN_ORDER') + ' ' + this.formatCurrency(setting.min_delivery_cost));
				}
				if(setting.max_delivery_cost) {
					metadata.push(t('LABEL.MAX_ORDER') + ' ' + this.formatCurrency(setting.max_delivery_cost));
				}
				if(setting.delivery_fee) {
					metadata.push(t('LABEL.DELIVERY_FEE') + ' ' + this.formatCurrency(setting.delivery_fee));
				}
			}
		}

		if(metadata.length) {
			return (
				<div {...props}>{metadata.join(" | ")}</div>
			)
		}

		return (
			<div className="clearfix"></div>
		);
	}
}