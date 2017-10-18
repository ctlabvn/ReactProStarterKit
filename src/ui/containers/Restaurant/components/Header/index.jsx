import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

import PhotoGroup from "~/ui/components/PhotoGroup";
import Rating from "~/ui/components/Rating";
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";

import "./index.css";
import options from "./options";

@translate('translations')
export default class extends Component {

  render() {
    const {t,outlet} = this.props;
    const gallery = JSON.parse(outlet.gallery.replace(/\\/g, ''));
    console.log(typeof gallery);

    return (
      <div className="row flex-nowrap d-flex flex-row justify-content-between block bg-white mb-4 mt-5">
        <div className="w-100 pr-5">
          <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
            <Link className="breadcrumb-item color-gray-400" to={`/`}>
	            {t('LINK.HOME')}
            </Link>
            <Link className="breadcrumb-item color-gray-400" to={`/restaurant`}>
	            {t('LINK.RESTAURANT')}
            </Link>
            <span className="breadcrumb-item active color-gray-400">
              {outlet.name}
            </span>
          </nav>

          <h2 className="font-weight-bold text-uppercase">{outlet.name}</h2>

          <div className="flex-row d-flex justify-content-between">
            <span className="color-red">{outlet.address}</span>
            <span>{outlet.phone}</span>
            <span>Time: {outlet.online_order_setting && outlet.online_order_setting.hours_open ? outlet.online_order_setting.hours_open : ''}</span>
          </div>

          <div className="flex-row d-flex justify-content-between">
            {outlet.online_order_setting && outlet.online_order_setting.do_delivery ? '<span>Delivery</span>' : ''}
            {outlet.online_order_setting && outlet.online_order_setting.do_takeaway ? '<span>Takeaway</span>' : ''}
            <span>Min delivery:{outlet.online_order_setting && outlet.online_order_setting.min_delivery_cost ? outlet.online_order_setting.min_delivery_cost : ''}</span>
            <span>Max delivery:{outlet.online_order_setting && outlet.online_order_setting.max_delivery_cost ? outlet.online_order_setting.max_delivery_cost : ''}</span>
            <span>Fee: {outlet.online_order_setting && outlet.online_order_setting.delivery_fee ? outlet.online_order_setting.delivery_fee : ''}</span>
          </div>

          <p className="w-100 mt-3 html-content" dangerouslySetInnerHTML={{__html:outlet.description}}/>
          <a href="/"> See more</a>

          <Menu className="menu-tags text-uppercase mt-2">
            {outlet.tags.map((item, index)=>
              <MenuItem title={item.name} key={index}/>
            )}                        
          </Menu>

          <div className="border border-white-300 border-right-0 border-left-0 border-bottom-0 mt-4 left-side-block">
            <Menu className="menu-decorator text-uppercase">
            {options.menuItems.map((item, index) =>
              <MenuItem active={index === 0} title={t(item)} key={index} id={item.id} />
            )}
            </Menu>
          </div>

        </div>

        {gallery ? <PhotoGroup images={gallery} className="photo-group-large"/> : ''}
      </div>
    );
  }
}