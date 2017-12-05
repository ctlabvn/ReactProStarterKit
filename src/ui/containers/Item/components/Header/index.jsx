import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
// import { connect } from "react-redux";

import { Button } from "reactstrap";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import RestaurantInfo from "~/ui/components/Restaurant/Info";
import Readmore from "~/ui/components/Readmore";
import ProductOptions from "~/ui/components/Product/Options";
import AddItemValidator from "~/ui/components/AddItemValidator";
import RestaurantTag from "~/ui/components/Restaurant/Tag";
import Image from "~/ui/components/Image";

// store
// import * as restaurantValidation from "~/store/utils/validation/restaurant";

import "./index.css";
import options from "./options";
import { checkOrderAvailable, getTodayString, parseJsonToObject, formatCurrency } from "~/utils";

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

    const { online_order_setting: orderSettings, currency = {}} = outlet;
    let openTime = null;
    if (orderSettings && orderSettings.hours_open) {
      const workingTime = parseJsonToObject(
        orderSettings.hours_open
      );
      const todayString = getTodayString().toUpperCase();

      const hoursOpendata = workingTime[todayString];
      if (hoursOpendata && hoursOpendata.open) {
        openTime = `${hoursOpendata.from.time || hoursOpendata.from} - ${hoursOpendata.to.time || hoursOpendata.to}`;
      } else {
        openTime = t("LABEL.RESTAURANT_CLOSED");
      }
    }

    let gallery = [];
    if(item && item.gallery) gallery = JSON.parse(item.gallery);

		return (
			<div className="bg-white px-md-0 px-2 item-header-main">
				<div className="pt-4 px-md-4 mt-5 w-100">
					<nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
						<Link className="breadcrumb-item color-gray-400" to={`/`}>
							{t("LINK.HOME")}
						</Link>
						<Link className="breadcrumb-item color-gray-400" to={`/restaurant`}>
							{t("LINK.RESTAURANT")}
						</Link>
						<Link
							className="breadcrumb-item color-gray-400"
							to={`/${outlet.slug || item.outlet_uuid}`}
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

          <div className="d-md-flex flex-md-row-reverse justify-content-between border-top">

            <div className="item-header-img pb-3">
              <Image className="border border-box" src={gallery[0]} alt="..." />
            </div>

            <div>
              <div className="color-red mb-2 pt-2">
                <span className="mr-1 text-uppercase font-fb-140">{outlet.name}</span>
                <span className="font-fr-140">
                  <span className="mr-2">
                    {outlet.address ? outlet.address : t("LABEL.NO_INFO")}
                  </span>
                  <span className="mr-2">|</span>
                  {orderSettings.do_takeaway && <span className="mr-2">{t("LABEL.TAKEAWAY")}</span>}
                  <span className="mr-2">|</span>
                  {orderSettings.do_delivery && <span className="mr-2">{t("LABEL.DELIVERY")}</span>}
                  <span>
                    <i
                      className="ml-2 fa fa-map-marker restaurant-location-icon"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </div>

              <div className="color-cg-040 font-fr-110 mb-2">
                <span className="mr-2">{openTime}</span>
                {orderSettings && orderSettings.do_delivery && [
                  orderSettings.min_delivery_cost && [<span key="11" className="mr-2">|</span>,<span key="12" className="mr-2">{`${t("LABEL.MIN_ORDER")} ${formatCurrency(orderSettings.min_delivery_cost, currency.symbol)}`}</span>],
                  orderSettings.max_delivery_cost && [<span key="21" className="mr-2">|</span>,<span key="22" className="mr-2">{`${t("LABEL.MAX_ORDER")} ${formatCurrency(orderSettings.max_delivery_cost, currency.symbol)}`}</span>],
                  orderSettings.delivery_fee && [<span key="31" className="mr-2">|</span>,<span key="32" className="mr-2">{`${t("LABEL.DELIVERY_FEE")} ${formatCurrency(orderSettings.delivery_fee, currency.symbol)}`}</span>]
                ]}
              </div>

              <Readmore
                line="500"
                more={t("LABEL.SHOW_MORE")}
                 less={t("LABEL.SHOW_LESS")}
              >
                <p
                  className="w-100 mt-3 html-content"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </Readmore>

              <RestaurantTag className="mt-3 pb-3" outlet={outlet} />

            </div>
          </div>
				</div>
				<div className="px-md-4 w-100">
					{showProductOptions && (
						<ProductOptions
              className="item-header-product-options"
							autoClear={false}
							shiftToMenu={true}
							onChangeOption={this.onChangeOption}
							onAddOrderItem={(item, options) =>
								this.addOrderItem(item, options)}
							canAddOrder={canAddOrder}
							item={item}
						/>
					)}

					{!showProductOptions &&
						canAddOrder && (
							<Button
								size="sm"
								color="danger"
								className="btn-shift-to-menu float-right"
								onClick={() => this.addOrderItem(item)}
							>
								{t("BUTTON.ADD_TO_CART")}
							</Button>
						)}

					<div className="border-white-300 mt-4">
						<Menu className="menu-decorator text-uppercase restaurant-header-menu">
							{options.menuItems.map((item, index) => (
								<MenuItem
                  active={index === 0}
                  title={
                  <strong className="color-grey">{t(item)}</strong>
                  }
                  key={index}
                />
							))}
						</Menu>
					</div>
				</div>

				<AddItemValidator
					outlet={outlet}
					onItemRef={ref => (this.addItemValidator = ref)}
				/>
			</div>
		);
	}
}
