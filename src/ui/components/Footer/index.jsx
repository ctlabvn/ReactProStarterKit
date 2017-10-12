import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import classNames from "classnames";

// components
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import Dropdown from "~/ui/components/Dropdown";

import "./index.css";
import options from "./options";


@translate("translations")
@connect(state => ({
  isHome: state.routing.location.pathname === "/"
}))
export default class extends Component {
  render() {
    const { t, i18n, isHome } = this.props;
    return (
      <footer className={classNames("footer text-center menu-bottom",{
        "fixed-bottom": isHome
      })}>
        <Menu className="text-uppercase">
          <MenuItem
            title={
              <Dropdown
                className="dropup"
                title={t(`languages.${i18n.language}`)}                  
              >
                {options.locales.map(item => (
                  <a key={item} onClick={() => i18n.changeLanguage(item)}>
                    {t(`languages.${item}`)}
                  </a>
                ))}
              </Dropdown>
            }
          />
          <MenuItem link="/about" title="About us" />
          <MenuItem link="/about" title="Technology" />
          <MenuItem link="/about" title="Join us" />
          <MenuItem
            link="/login"
            title={
              <button
                type="button"
                className="btn btn-outline-danger btn-sm text-uppercase"
              >
                Login
              </button>
            }
          />
        </Menu>
        <Menu className="bottom">
          {options.items.map((item, index) => (
            <MenuItem key={index} link={item.link} title={item.title} />
          ))}
        </Menu>
      </footer>
    );
  }
}