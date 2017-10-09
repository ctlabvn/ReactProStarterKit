import React, { Component } from "react"

export default class extends Component {

  render(){
    const {icon} = this.props
    return (
      <button className="btn btn-round btn-shadow bg-white">
        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
      </button>
    )
  }
}