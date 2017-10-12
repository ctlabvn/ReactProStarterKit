import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./index.css";

export default class extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    const { title, children, className, ...props } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {
        className: classNames(child.props.className, "dropdown-item")
      })
    );
    return (
      <div className={classNames("btn-group", className)}>
        <button
          className="btn btn-light btn-sm dropdown-toggle text-uppercase"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {title}
        </button>
        <div className="dropdown-menu">{childrenWithProps}</div>
      </div>
    );
  }
}