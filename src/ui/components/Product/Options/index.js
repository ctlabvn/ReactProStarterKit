import React, { Component } from "react";
import { translate } from "react-i18next";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";

import * as orderActions from "~/store/actions/order";

@translate("translations")
@connect(null, orderActions)
export default class extends Component {
	static propTypes = {
		options: PropTypes.array,
		currency: PropTypes.object,
	};

	addOrderItem(item) {
		const {
			default_price,
			item_options,
			item_uuid,
			currency,
			name,
			description
		} = item;
		this.props.addOrderItem({
			item_uuid,
			item_options,
			price: default_price,
			quantity: 1,
			name,
			description,
			currency_symbol: currency.symbol
		});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { options } = this.props;
		// validate mandatory
		for(let parent in options) {
			if(!!parent.optionSet && parent.mandatory) {
				let checkFlg = true;
				if(parent.multiple_choice) {
					for(let child in parent.optionSet) {

					}
				} else {
					console.log(document.querySelector('input[name]'))
				}
			}
		}
	}

	render() {
		const { t, canAddOrder, item, options, currency } = this.props;
		return (
			<form id="add-options" onSubmit={this.handleSubmit}>
				{options.map(parent => (
					<div className="row my-3 border-bottom">
						<div className="col-3">
							<span className={classNames("", parent.mandatory ? "border-bottom border-danger" : "")}>{parent.name}</span>
						</div>
						<div className="col-9 row">
							{!!parent.optionSet && parent.optionSet.map((child, index) => (
								<div className="col-lg-4" key={index}>
									<p>
										<input key={child.option_uuid} id={child.option_uuid} name={parent.multiple_choice ? `${parent.id}[${child.id}]` : parent.id} type={parent.multiple_choice ? "checkbox" : "radio"} className="mr-1" />
										<label htmlFor={child.option_uuid}>{child.name}</label>
										{child.price > 0 && (
											<small className="badge badge-danger">
												{t("format.currency", {
													price: child.price,
													symbol: currency.symbol ? currency.symbol : '₫'
												})}
											</small>
										)}
									</p>
								</div>
							))}
						</div>
						<div className="col-12">
							<span id={`error-${parent.id}`}></span>
						</div>
					</div>
				))}
				<div className="form-group text-right">
					{!!canAddOrder && <button className="btn btn-danger btn-lg"
					                          onClick={() => this.addOrderItem(item)}>{t('BUTTON.ADD_TO_CART')}</button>}
				</div>
			</form>
		);
	}
}