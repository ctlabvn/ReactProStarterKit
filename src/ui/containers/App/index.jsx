import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import Header from '~/ui/components/Header'
import Footer from '~/ui/components/Footer'
import Indicator from '~/ui/components/Indicator'

import './index.css'

export default class App extends Component {

  render(){    
    
    const {children} = this.props

    return (
      <div>     
        <Indicator/>
        <Header/>
        <div className="main-page float-left w-100">
          {children}
        </div>
        <Footer/>
      </div>
    )
  }
} 
