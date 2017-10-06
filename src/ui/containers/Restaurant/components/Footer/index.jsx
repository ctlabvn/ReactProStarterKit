import React, { Component } from "react"
import { Link } from 'react-router-dom'

// component
import Rating from '~/ui/components/Rating'

export default class extends Component {

  render(){
    return (

      <div className="row block bg-white">
        <Rating/>
      </div>
    )
  }
}
