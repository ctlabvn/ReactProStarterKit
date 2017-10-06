import React, { Component } from "react"
import { Link } from 'react-router-dom'



export default class extends Component {

  render(){
    return (
      <nav className="breadcrumb">
        <a className="breadcrumb-item" href="#">Home</a>
        <a className="breadcrumb-item" href="#">Library</a>
        <a className="breadcrumb-item" href="#">Data</a>
        <span className="breadcrumb-item active">Bootstrap</span>
      </nav>
    )
  }
}
