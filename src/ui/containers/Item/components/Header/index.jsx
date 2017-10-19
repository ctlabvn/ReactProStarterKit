import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";

import "./index.css";
import options from "./options";

@translate('translations')
export default class extends Component {

  render() {
    const { t, outlet, item } = this.props;
    
    return (
      <div className="row flex-nowrap d-flex flex-row justify-content-between block bg-white mb-4 mt-5 w-100">
        <div className="col-10 pr-5">
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
            <span className="color-red">{outlet.address}</span>
          </div>

          <div className="flex-row d-flex justify-content-between">

          </div>

          <p className="w-100 mt-3 html-content" dangerouslySetInnerHTML={{__html:item.description}}/>
          <a href="/"> See more</a>

          <div className="border border-white-300 border-right-0 border-left-0 border-bottom-0 mt-4 left-side-block">
            <Menu className="menu-decorator text-uppercase">
            {options.menuItems.map((item, index)=>
              <MenuItem active={index === 0} title={t(item)} key={index}/>
            )}
            </Menu>
          </div>

        </div>
        <div className="col-2 d-flex flex-column justify-content-between align-content-between">
          <h3>
	          {t("format.currency", {
		          price: item.default_price,
		          symbol: item.currency.symbol
	          })}
          </h3>
          <button className="btn btn-danger btn-lg">{t('BUTTON.ADD_TO_CART')}</button>
        </div>
      </div>
    );
  }
}