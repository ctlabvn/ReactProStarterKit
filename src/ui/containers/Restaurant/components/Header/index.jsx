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
    return (
      <div className="row flex-nowrap d-flex flex-row justify-content-between block bg-white mb-4 mt-5">
        <div className="w-100 pr-5">
          <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
            <a className="breadcrumb-item color-gray-400" href="#">
              Home
            </a>
            <a className="breadcrumb-item color-gray-400" href="#">
              RESTAURANT
            </a>
            <a className="breadcrumb-item color-gray-400" href="#">
              HANOI
            </a>
            <span className="breadcrumb-item active color-gray-400">
              DONUTS
            </span>
          </nav>

          <h2 className="font-weight-bold text-uppercase">Dunkin’ Donuts</h2>

          <div className="flex-row d-flex justify-content-between">
            <Rating />
            <span>148 comments</span>
            <span>|</span>
            <span className="color-red">242 Rue de Rivoli, 75001, Paris</span>
            <span>|</span>
            <span>17 Restaurants in Paris</span>
          </div>

          <div className="flex-row d-flex justify-content-between">
            <span>Sugar, Donuts</span>
            <span>|</span>
            <span>+33 1 23 45 67 89</span>
            <span>|</span>
            <span>Min / Max Order : $5 / $500</span>
            <span>|</span>
            <span>08:00pm -> 00:00am</span>
          </div>

          <p className="w-100 mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor.
            <a href="/"> See more</a>
          </p>

          <Menu className="menu-tags text-uppercase">
            {options.menuItems.map((item, index)=>
              <MenuItem title={item} key={index}/>
            )}                        
          </Menu>

          <div className="border border-white-300 border-right-0 border-left-0 border-bottom-0 mt-4 left-side-block">
            <Menu className="menu-decorator text-uppercase">
            {options.menuItems.map((item, index)=>
              <MenuItem active={index === 0} title={item} key={index}/>
            )}                        
            </Menu>
          </div>

        </div>

        <PhotoGroup images={options.images} className="photo-group-large"/>
      </div>
    );
  }
}