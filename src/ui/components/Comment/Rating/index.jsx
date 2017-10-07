import React, { Component } from "react"

import Rating from '~/ui/components/Rating'

export default class extends Component {

  static defaultProps = {
    size: 80
  }

  render(){
    const {size} = this.props

    return (
      <div className="flex-row flex-center">
        <img width={size} height={size} src="/images/no-data.png" alt="..." class="rounded-circle"/>
        <div className="flex-column ml-3">
          <div className="d-flex flex-row">
            <Rating/>
            <span className="ml-1 small text-muted">Marie D. | August, 2017</span>
          </div>
          <span>A wonderful souvenir</span>
        </div>
      </div>
    )
  }
}