import React, { Component } from "react";
import classNames from "classnames";

export default class extends Component {

  static defaultProps = {
    className: 'bg-white',
  };

  render(){
    const {icon, className, ...props} = this.props;

    var style = {
      lineHeight: "0.5",
      fontSize: "1.5rem"
    }

    return (
      <button style={style} className={classNames("btn btn-round btn-shadow", className)} {...props}>
        {/*
         <i className={`fa fa-${icon}`} aria-hidden="true"></i>
        */}
        {icon === "plus" ? "+" : "-"}
      </button>
    )
  }
}