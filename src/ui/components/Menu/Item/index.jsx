import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import "./index.css";

export default class extends Component {
  static defaultProps = {
    activeClassName: "selected",
    active: false
  };

  renderLink(link, title) {
    return (
      <NavLink
        to={link}
        className="menu-item"
        activeClassName={this.props.activeClassName}
      >
        {title}
      </NavLink>
    );
  }

  handleClick(e, onClick) {
    if (!this.props.link) {
      const { activeClassName } = this.props;
      window
        .jQuery(e.target)
        .closest(".menu-item")
        .addClass(activeClassName)
        .siblings()
        .removeClass(activeClassName);
    }
    onClick && onClick(e);
  }

  renderItem(title) {
    return <span>{title}</span>;
  }

  render() {
    const { title, link, active, onClick, activeClassName } = this.props;
    return (
      <li
        className={classNames("list-inline-item menu-item", {
          [activeClassName]: active
        })}
        onClick={e => this.handleClick(e, onClick)}
      >
        {link ? this.renderLink(link, title) : this.renderItem(title)}
      </li>
    );
  }
}