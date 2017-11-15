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
import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";
import * as authActions from "~/store/actions/auth";

import { isMobile } from "~/ui/utils";

@translate("translations")
@connect(
  state => ({
    isLogged: authSelectors.isLogged(state),
    config: authSelectors.getConfig(state),
    isHome: state.routing.location.pathname === "/restaurant"
  }),
  authActions
)
export default class extends Component {
  
  async componentWillMount() {
    const { config, updateConfig } = this.props;
    if (!config.languages) {
      const ret = await api.setting.getSettingLanguages();
      updateConfig("languages", ret.data);
    }
  }

  renderLanguage() {
    const { t, config, i18n } = this.props;
    let defaultLang = i18n.language;
    if(defaultLang === 'en-US'){
      defaultLang = 'en';
    }
    const defaultLangName = t(`languages.${defaultLang}`);
    if (!config.languages) return defaultLangName;
    const selectedItem = config.languages.find(item=>item.iso_code === defaultLang);
    return (
      <Dropdown title={selectedItem ? selectedItem.name : defaultLangName} className="dropup text-uppercase">
        {config.languages.map(item => (
          <a key={item.id} className={classNames({"text-info": item.iso_code === defaultLang})} onClick={() => i18n.changeLanguage(item.iso_code)}>
            {item.name}
          </a>
        ))}
      </Dropdown>
    );
  }

  render() {
    const { t, isHome } = this.props;
    return (
      <footer
        className={classNames("footer text-center menu-bottom bg-white float-left w-100", {
          "fixed-bottom": isHome && !isMobile
        })}
      >
        <Menu className="text-uppercase">
          <MenuItem title={this.renderLanguage()} />
          <MenuItem link="/about" title={t("LINK.FOOTER.ABOUT_US")} />
          <MenuItem link="/about" title={t("LINK.FOOTER.TECHNOLOGY")} />
          <MenuItem link="/about" title={t("LINK.FOOTER.JOIN_US")} />
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