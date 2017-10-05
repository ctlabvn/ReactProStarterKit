import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Header from '~/ui/components/Header'
import Footer from '~/ui/components/Footer'

import './index.css'

export default class App extends Component {

  static contextTypes = {
    router: PropTypes.object
  }


  render(){    
    
    const {children} = this.props

    return (
      <div>     

        <Header/>
        <div className="main-page">
          {children}
        </div>
        <Footer/>

      </div>
    )
  }
} 
