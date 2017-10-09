import React, { Component } from "react"

import Rating from '~/ui/components/Rating'

export default class extends Component {

  static defaultProps = {
    size: 80
  }

  render(){
    const {size, title} = this.props

    return (
      <div className="d-flex flex-row align-items-center">
        <img width={size} height={size} src="/images/no-data.png" alt="..." class="rounded-circle"/>
        <div className="flex-column ml-3">
          <div className="d-flex flex-row">
            <Rating/>
            <span className="ml-1 small text-muted">Marie D. | August, 2017</span>
          </div>
          <span>{title}</span>
        </div>
      </div>
    )
  }
}