import React, { Component } from "react";
import { Link } from "react-router-dom";

import PhotoGroup from "~/ui/components/PhotoGroup";
import Rating from "~/ui/components/Rating";
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";



import "./index.css";
import options from "./options";

export default class extends Component {

  render() {
    const {outlet} = this.props;    
    
    return (
      <div className="row flex-nowrap d-flex flex-row justify-content-between block bg-white mb-4 mt-5">
        <div className="col-10 w-100 pr-5">
          <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
            <a className="breadcrumb-item color-gray-400" href="#">
              Home
            </a>
            <a className="breadcrumb-item color-gray-400" href="#">
              PRODUCTS
            </a>
            <a className="breadcrumb-item color-gray-400" href="#">
              HANOI
            </a>
            <span className="breadcrumb-item active color-gray-400">
              DONUTS
            </span>
          </nav>

          <h2 className="font-weight-bold text-uppercase">{outlet.name}</h2>

          <div className="flex-row d-flex justify-content-between">
            {/*<Rating />*/}
            {/*<span>148 comments</span>*/}
            {/*<span>|</span>*/}
            <span className="color-red">{outlet.address}</span>
          </div>

          <div className="flex-row d-flex justify-content-between">
            <span>Sugar, Donuts</span>
            <span>|</span>
            <span>{outlet.phone}</span>
            <span>|</span>
            {/*<span>Min / Max Order : {outlet.online_order_setting.min_takeaway_cost} / {outlet.online_order_setting.max_takeaway_cost}</span>*/}
            <span>|</span>
            <span>08:00pm -> 00:00am</span>
          </div>

          <p className="w-100 mt-3 html-content" dangerouslySetInnerHTML={{__html:outlet.description}}/>
          <a href="/"> See more</a>
          

          {/*<Menu className="menu-tags text-uppercase mt-2">*/}
            {/*{options.menuItems.map((item, index)=>*/}
              {/*<MenuItem title={item} key={index}/>*/}
            {/*)}                        */}
          {/*</Menu>*/}

          {/*<div className="border border-white-300 border-right-0 border-left-0 border-bottom-0 mt-4 left-side-block">*/}
            {/*<Menu className="menu-decorator text-uppercase">*/}
            {/*{options.menuItems.map((item, index)=>*/}
              {/*<MenuItem active={index === 0} title={item} key={index}/>*/}
            {/*)}                        */}
            {/*</Menu>*/}
          {/*</div>*/}

        </div>
        <div className="col-2 d-flex flex-column justify-content-between align-content-between">
          <h1>{outlet.default_price}</h1>
          <button className="btn btn-danger btn-lg">Add To Cart</button>
        </div>
      </div>
    );
  }
}