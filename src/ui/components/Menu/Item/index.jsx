import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./index.css"

export default class extends Component {

  renderLink(link, title){
    return (
      <NavLink to={link} activeClassName="selected">
          {title}
        </NavLink>
    )
  }

  handleClick(e, onClick){    
    window.jQuery(e.target).addClass('selected').parents().siblings().find('.selected').removeClass('selected');
    onClick && onClick(e);
  }

  renderItem(onClick, title){
    return (
      <span className="menu-item color-gray-300" onClick={e => this.handleClick(e, onClick)}>{title}</span>
    )
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