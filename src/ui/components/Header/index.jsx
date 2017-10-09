import React, { Component } from "react"
import { Link } from 'react-router-dom'

import "./index.css"

export default class extends Component {

  componentDidMount(){
    window.jQuery(this.cartButton).popover({
      html: true,
      trigger: 'click',
      content: this.cartContent,
      placement: 'bottom',
    })
  }

  componentWillUnMount(){
    window.jQuery(this.cartButton).popover('dispose')
  }

  render() {
    return (
      <nav className="navbar fixed-top header">
        <div className="container-fluid p-0">
          <div>
            <Link className="navbar-brand" to="/">
              <img src="/images/logo.png" alt="" />
            </Link>

            <input
              type="text"
              className="custom-input font-large color-gray"
              placeholder="Type your search"
            />
          </div>

          <div className="d-flex align-items-center flex-row">
            <button
              ref={ref=>this.cartButton = ref}
              type="button"
              className="btn btn-round bg-red"
              data-container="body"
            >
              <i
                className="fa fa-shopping-cart"
                aria-hidden="true"
                id="cart-icon"
              />
              <span className="badge bg-red">0</span>
              <div className="popover-content text-center" ref={ref=>this.cartContent = ref}>
                <img src="/images/no-data.png" height="100" alt="" />
                <p className="color-gray text-uppercase">Your shopping cart is empty.</p>
              </div>
            </button>            

            <i className="fa fa-bars ml-40" aria-hidden="true" />
          </div>
        </div>
      </nav>
    );
  }
}