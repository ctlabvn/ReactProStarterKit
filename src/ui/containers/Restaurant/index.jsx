import React, { Component } from "react"

// elements
import Header from './components/Header'
import Footer from './components/Footer'
import Body from './components/Body'

import "./index.css"

export default class extends Component {
  

  render() {
    
    return (
      <div className="container">

        <Header/>

        <Body/>

        <Footer/>

      </div>
    );
  }
}