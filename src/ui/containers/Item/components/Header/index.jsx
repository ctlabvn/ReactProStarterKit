import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import RestaurantOrderSetting from "~/ui/components/Restaurant/OrderSetting";
import RestaurantInfo from "~/ui/components/Restaurant/Info";
import Readmore from "~/ui/components/Restaurant/Readmore";
import ProductOptions from "~/ui/components/Product/Options";
import * as orderActions from "~/store/actions/order";
// import * as restaurantValidation from "~/store/utils/validation/restaurant";

import "./index.css";
import options from "./options";
import {checkOrderAvailable} from "~/store/utils/validation/restaurant";

@translate('translations')
@connect(null, orderActions)
export default class extends Component {

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

	render() {
		const { t, outlet, item } = this.props;
		const canAddOrder = checkOrderAvailable(outlet);

		return (
			<div className="row flex-nowrap d-flex flex-row justify-content-between block bg-white mb-4 mt-5 w-100">
				<div className="col-9 pr-5">
					<nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
						<Link className="breadcrumb-item color-gray-400" to={`/`}>
							{t('LINK.HOME')}
						</Link>
						<Link className="breadcrumb-item color-gray-400" to={`/restaurant`}>
							{t('LINK.RESTAURANT')}
						</Link>
						<Link className="breadcrumb-item color-gray-400" to={`/restaurant/${item.outlet_uuid}`}>
							{outlet.name}
						</Link>
						<span className="breadcrumb-item active color-gray-400">
              {item.name}
            </span>
					</nav>

					<h2 className="font-weight-bold text-uppercase">{item.name}</h2>

					<div className="flex-row d-flex justify-content-between">
						<RestaurantInfo outlet={outlet} />
					</div>

					<div className="flex-row d-flex justify-content-between">
						<RestaurantOrderSetting outlet={outlet} />
					</div>

					<Readmore line="500" more={t('LABEL.SHOW_MORE')} less={t('LABEL.SHOW_LESS')}>
						<p className="w-100 mt-3 html-content" dangerouslySetInnerHTML={{__html:item.description}}/>
					</Readmore>

					{item.item_options && item.item_options.map((item, index) => (
						<ProductOptions options={item.optionSet} name={item.name} />
					))}

					<div className="border border-white-300 border-right-0 border-left-0 border-bottom-0 mt-4 left-side-block">
						<Menu className="menu-decorator text-uppercase">
							{options.menuItems.map((item, index)=>
								<MenuItem active={index === 0} title={t(item)} key={index}/>
							)}
						</Menu>
					</div>

				</div>
				<div className="col-3 d-flex flex-column justify-content-between align-content-between">
					<h3 className="text-right">
						{t("format.currency", {
							price: item.default_price,
							symbol: item.currency && item.currency.symbol ? item.currency.symbol : ''
						})}
					</h3>
					{!!canAddOrder && <button className="btn btn-danger btn-lg" onClick={() => this.addOrderItem(item)}>{t('BUTTON.ADD_TO_CART')}</button>}
				</div>
			</div>
		);
	}
}