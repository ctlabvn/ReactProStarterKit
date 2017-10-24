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

// selectors
import * as authSelectors from "~/store/selectors/auth";

@translate("translations")
@connect(state => ({
  isLogged: authSelectors.isLogged(state),
  isHome: state.routing.location.pathname === "/"
}))
export default class extends Component {
  render() {
    const { t, i18n, isHome, isLogged } = this.props;
    return (
      <footer
        className={classNames("footer text-center menu-bottom", {
          "fixed-bottom": isHome
        })}
      >
        <Menu className="text-capitalize">
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
          <MenuItem link="/about" title={t('LINK.FOOTER.ABOUT_US')} />
          <MenuItem link="/about" title={t('LINK.FOOTER.TECHNOLOGY')} />
          <MenuItem link="/about" title={t('LINK.FOOTER.JOIN_US')} />
          
        </Menu>
        <Menu className="bottom">
          {options.items.map((item, index) => (
            <MenuItem key={index} link={item.link} title={t(item.title)} />
          ))}
        </Menu>
        
      </footer>
    );
  }
}