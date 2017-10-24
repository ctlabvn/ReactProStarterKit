import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

import PhotoGroup from "~/ui/components/PhotoGroup";
import Rating from "~/ui/components/Rating";
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import RestaurantOrderSetting from "~/ui/components/Restaurant/OrderSetting";
import RestaurantInfo from "~/ui/components/Restaurant/Info";
import RestaurantTag from "~/ui/components/Restaurant/Tag";
import Readmore from "~/ui/components/Restaurant/Readmore";
import { parseJsonToObject } from "~/store/utils/json";

import "./index.css";
import options from "./options";

@translate('translations')
export default class extends Component {

  render() {
    const {t,outlet} = this.props;
    const gallery = parseJsonToObject(outlet.gallery, ["/images/no-image-icon.png"]);

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

          <h2 className="font-weight-bold text-capitalize">{outlet.name}</h2>

          <div className="flex-row d-flex justify-content-between">
            <RestaurantInfo outlet={outlet} />
          </div>

          <div className="flex-row d-flex justify-content-between">
            <RestaurantOrderSetting outlet={outlet} />
          </div>

          <Readmore line="500" more={t('LABEL.SHOW_MORE')} less={t('LABEL.SHOW_LESS')}>
            <p className="w-100 mt-3 html-content" dangerouslySetInnerHTML={{__html:outlet.description}}/>
          </Readmore>

          <RestaurantTag outlet={outlet} />

          <div className="border border-white-300 border-right-0 border-left-0 border-bottom-0 mt-4 left-side-block">
            <Menu className="menu-decorator text-uppercase">
            {options.menuItems.map((item, index) => {
              let title = index === 0 ? t(item.name) + ` (${outlet.total_items})` : t(item.name);
              return <MenuItem active={index === 0} title={title} key={index} classToggle="restaurant-tab" idToggle={item.id} />
            })}
            </Menu>
          </div>

        </div>

        {gallery ? <PhotoGroup images={gallery} className="photo-group-large"/> : ''}
      </div>
    );
  }
}