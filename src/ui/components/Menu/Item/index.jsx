import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./index.css";

export default class extends Component {
  static defaultProps = {
    activeClassName: "selected"
  };

  renderLink(link, title) {
    return (
      <NavLink to={link} className="menu-item" activeClassName={this.props.activeClassName}>
        {title}
      </NavLink>
    );
  }

  handleClick(e, onClick) {
    const { activeClassName } = this.props;
    window
      .jQuery(e.target)
      .addClass(activeClassName)
      .parents()
      .siblings()
      .find('.' + activeClassName)
      .removeClass(activeClassName);
    onClick && onClick(e);
  }

  renderItem(onClick, title) {
    return (
      <span
        className="menu-item color-gray-300"
        onClick={e => this.handleClick(e, onClick)}
      >
        {title}
      </span>
    );
  }

  render() {
    const { title, link, onClick } = this.props;
    return (
      <li className="list-inline-item">
        {link ? this.renderLink(link, title) : this.renderItem(onClick, title)}
      </li>
    );
  }
}