import React, { Component } from "react";
import { translate } from "react-i18next";

// components
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";

import "./index.css";
import options from "./options";

@translate("translations")
export default class extends Component {
  render() {
    const {t, i18n} = this.props;    
    return (
      <footer className="footer text-center">
        <Menu className="text-uppercase">
          <MenuItem
            title={
              <div className="btn-group dropup">
                <button
                  className="btn btn-light btn-sm dropdown-toggle text-uppercase"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {t(`languages.${i18n.language}`)}
                </button>
                <div className="dropdown-menu">
                  {options.locales.map(item=>
                    <a className="dropdown-item" key={item} onClick={()=>i18n.changeLanguage(item)}>
                    {t(`languages.${item}`)}
                  </a>
                  )}
                </div>
              </div>
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