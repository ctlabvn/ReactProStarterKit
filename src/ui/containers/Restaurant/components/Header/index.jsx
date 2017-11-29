import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

import PhotoGroup from "~/ui/components/PhotoGroup";
// import Rating from "~/ui/components/Rating";
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import RestaurantInfo from "~/ui/components/Restaurant/Info";
import RestaurantTag from "~/ui/components/Restaurant/Tag";
import Readmore from "~/ui/components/Readmore";
import Image from "~/ui/components/Image";
import { parseJsonToObject } from "~/utils";

import "./index.css";
import options from "./options";

@translate("translations")
export default class extends Component {
  render() {
    const { t, outlet, active, onSelectItem } = this.props;
    const gallery = parseJsonToObject(outlet.gallery, [
      "/images/no-image-icon.png"
    ]);
    return (
      <div className="row bg-white box-shadow">
        <div className="restaurant-header-main flex-md-nowrap block d-md-flex flex-row justify-content-between w-100">
          <div className="pr-md-5 w-100">
            <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0 p-0">
              <Link
                className="breadcrumb-item color-gray-400 font-weight-bold"
                to={`/`}
              >
                {t("LINK.HOME")}
              </Link>
              <Link
                className="breadcrumb-item color-gray-400 font-weight-bold"
                to={`/restaurant`}
              >
                {t("LINK.RESTAURANT")}
              </Link>
              <span className="breadcrumb-item active font-weight-bold">
                {outlet.name}
              </span>
            </nav>

            <h5>
              <span className="restaurant-name font-weight-bold text-uppercase color-grey-dark">
                {outlet.logo && (
                  <Image
                    className="rounded mr-2 img-logo"
                    src={outlet.logo}
                    alt=""
                  />
                )}
                {outlet.name}
              </span>
            </h5>

            <h6 className="color-red restaurant-address">
              <span className="mr-2">
                {outlet.address ? outlet.address : t("LABEL.NO_INFO")}
              </span>{" "}
              <span>-</span>{" "}
              <span>
                <i
                  className="ml-2 fa fa-map-marker restaurant-location-icon"
                  aria-hidden="true"
                />
              </span>
            </h6>

            <div className="flex-row d-flex justify-content-between mb-2">
              <RestaurantInfo outlet={outlet} />
            </div>

            <Readmore
              lines={3}
              more={t("LABEL.SHOW_MORE")}
              className="w-100 mt-3 html-content"
              less={t("LABEL.SHOW_LESS")}
            >
              <p dangerouslySetInnerHTML={{ __html: outlet.description }} />
            </Readmore>

            <RestaurantTag className="mt-4" outlet={outlet} />

            <div className="mt-5 border border-white-300 bg-white w-100 border-right-0 border-left-0 border-bottom-0">
              <Menu className="menu-decorator text-uppercase restaurant-header-menu">
                {options.menuItems.map((item, i) => (
                  <MenuItem
                    active={active === item.id}
                    onClick={() => onSelectItem && onSelectItem(item.id)}
                    title={
                      <strong className="color-grey">{`${t(item.name)} ${i === 0
                        ? ` (${outlet.total_items})`
                        : ""}`}</strong>
                    }
                    key={item.id}
                  />
                ))}
              </Menu>
            </div>
          </div>

          {gallery ? (
            <PhotoGroup
              images={gallery}
              className="photo-group-large mt-md-0 mt-4 mb-4"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
