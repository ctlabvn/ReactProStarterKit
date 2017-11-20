import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
// import { connect } from "react-redux";

import {
	Button,
} from "reactstrap";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import RestaurantOrderSetting from "~/ui/components/Restaurant/OrderSetting";
import RestaurantInfo from "~/ui/components/Restaurant/Info";
import Readmore from "~/ui/components/Readmore";
import ProductOptions from "~/ui/components/Product/Options";
import AddItemValidator from "~/ui/components/AddItemValidator";


// store
// import * as restaurantValidation from "~/store/utils/validation/restaurant";

import "./index.css";
import options from "./options";
import { checkOrderAvailable } from "~/store/utils/validation/restaurant";

@translate("translations")
export default class extends Component {
	constructor(props) {
		super(props);

		this.state = {
			optionsPrice: 0
		};
	}

	onChangeOption = optionsPrice => {
		this.setState({ optionsPrice });
	};

	addOrderItem(item, item_options = []) {
		this.addItemValidator.handleAddOrderItem(item, item_options);		
	}

	render() {
		const { t, outlet, item } = this.props;
		const { optionsPrice } = this.state;
		const canAddOrder = checkOrderAvailable(outlet);
		const showProductOptions =
			item.item_options && item.item_options.length > 0;
		return (
			<div className="bg-white px-md-0 px-2">
				<div className="pt-4 px-md-4 mt-5 w-100">					
						<nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
							<Link className="breadcrumb-item color-gray-400" to={`/`}>
								{t("LINK.HOME")}
							</Link>
							<Link
								className="breadcrumb-item color-gray-400"
								to={`/restaurant`}
							>
								{t("LINK.RESTAURANT")}
							</Link>
							<Link
								className="breadcrumb-item color-gray-400"
								to={`/restaurant/${item.outlet_uuid}`}
							>
								{outlet.name}
							</Link>
							<span className="breadcrumb-item active color-gray-400">
								{item.name}
							</span>
						</nav>

						<h4 className="text-uppercase color-black-400 row no-gutters">
							<strong className="col-md-8">{item.name}</strong>
							<span className="col-md-4 color-red text-md-right">
								{t("format.currency", {
									price: item.default_price + optionsPrice,
									symbol:
										item.currency && item.currency.symbol
											? item.currency.symbol
											: ""
								})}
							</span>											
						</h4>

						<div className="flex-row d-flex justify-content-between">
							<RestaurantInfo displayName={true} outlet={outlet} />
						</div>

						<div className="flex-row d-flex justify-content-between">
							<RestaurantOrderSetting outlet={outlet} />
						</div>

						<Readmore
							line="500"
							more={t("LABEL.SHOW_MORE")}
							// less={t("LABEL.SHOW_LESS")}
						>
							<p
								className="w-100 mt-3 html-content"
								dangerouslySetInnerHTML={{ __html: item.description }}
							/>
						</Readmore>
					
					
				</div>
				<div className="px-md-4 w-100">
					{showProductOptions && (
						<ProductOptions
							autoClear={false}
							shiftToMenu={true}
							onChangeOption={this.onChangeOption}
							onAddOrderItem={(item, options) =>
								this.addOrderItem(item, options)}
							canAddOrder={canAddOrder}
							item={item}
						/>
					)}

					{
						!showProductOptions && canAddOrder &&
					  (
						<Button size="sm" color="danger"			
							className="btn-shift-to-menu float-right"
							onClick={() => this.addOrderItem(item)}
						>
							{t("BUTTON.ADD_TO_CART")}
						</Button>
					)}

					<div className="border-top border-white-300 mt-4">
						<Menu className="menu-decorator text-uppercase">
							{options.menuItems.map((item, index) => (
								<MenuItem active={index === 0} title={t(item)} key={index} />
							))}
						</Menu>
					</div>
				</div>

				<AddItemValidator outlet={outlet} onItemRef={ref=>this.addItemValidator=ref}/>

			</div>
		);
	}
}