import React, { Component } from "react";

import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";

import "./index.css";
import options from "./options";

export default class extends Component {
  render() {
    return (
      <footer className="footer text-center">
        <Menu>
          {options.items.map((item, index) => (
            <MenuItem key={index} link={item.link} title={item.title} />
          ))}
        </Menu>
      </footer>
    );
  }
}