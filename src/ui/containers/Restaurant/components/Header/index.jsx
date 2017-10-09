import React, { Component } from "react"
import { Link } from 'react-router-dom'

import "./index.css";

export default class extends Component {

  render(){
    return (
      <div className="row block bg-white mb-4 mt-5">
        <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent">
          <a className="breadcrumb-item color-gray-400" href="#">Home</a>
          <a className="breadcrumb-item color-gray-400" href="#">RESTAURANT</a>
          <a className="breadcrumb-item color-gray-400" href="#">HANOI</a>
          <span className="breadcrumb-item active color-gray-400">DONUTS</span>
        </nav>
      </div>
    )
  }
}
