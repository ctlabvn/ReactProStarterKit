import React, { Component } from "react";
import classNames from "classnames";

export default class extends Component {

  static defaultProps = {
    className: 'bg-white',
  };

  render(){
    const {icon, className, ...props} = this.props
    return (
      <button className={classNames("btn btn-round btn-shadow", className)} {...props}>
        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
      </button>
    )
  }
}