import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import { getSiblings } from "~/ui/utils";
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
        activeClassName={this.props.activeClassName}
      >
        {title}
      </NavLink>
    );
  }

  handleClick(e, onClick) {
    if (!this.props.link) {
      const { activeClassName } = this.props;

      this.node.classList.add(activeClassName);
      const siblings = getSiblings(this.node);
      siblings.map(sibling => sibling.classList.remove(activeClassName));
    }
    onClick && onClick(e);
  }

  renderItem(title) {
    return <span>{title}</span>;
  }

  render() {
    const { title, link, active, onClick, className, activeClassName } = this.props;
    return (
      <li
        ref={ref => (this.node = ref)}
        className={classNames("list-inline-item menu-item", {
          [activeClassName]: active
        }, className)}
        onClick={e => this.handleClick(e, onClick)}
      >
        {link ? this.renderLink(link, title) : this.renderItem(title)}
      </li>
    );
  }
}