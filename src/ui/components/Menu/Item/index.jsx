import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import { getSiblings } from "~/ui/utils";
import "./index.css";

export default class extends Component {
  static defaultProps = {
    activeClassName: "selected",
    active: false,
	  clickIt: false
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

	  const idToggle = this.node.getAttribute("data-toggle-id");
	  const classToggle = this.node.getAttribute("data-toggle-class");
	  if (idToggle && classToggle) {
		  var selects = document.getElementsByClassName(classToggle);
		  for (var i = 0, il = selects.length; i < il; i++) {
			  selects[i].style.display = "none";
		  }
		  document.getElementById(idToggle).style.display = "block";
	  }

	  onClick && onClick(e);
  }

  renderItem(title) {
    return <span>{title}</span>;
  }

  componentDidMount() {
	  const { clickIt } = this.props;
	  if(clickIt) {
		  this.node.click();
    }
  }

  render() {
    const { totalItem, idToggle, classToggle, title, link, active, onClick, className, activeClassName } = this.props;
    return (totalItem !== 0 &&
      <li
        ref={ref => (this.node = ref)}
        className={classNames("list-inline-item menu-item", {
          [activeClassName]: active
        }, className)}
        data-toggle-id={idToggle}
        data-toggle-class={classToggle}
        onClick={e => this.handleClick(e, onClick)}
      >
        {link ? this.renderLink(link, title) : this.renderItem(title)}
      </li>
    );
  }
}