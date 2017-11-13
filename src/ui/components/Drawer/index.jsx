import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from "classnames";
import Footer from "~/ui/components/Footer";

import "./index.css";

export default class Drawer extends Component {

  render(){
    const {className, ...props} = this.props;
    return (
      <div className={classNames("drawer", className)} {...props} id="drawer">
        <div className="drawer-inner">  
          <Link id="home-link" className="color-black-300 mb-2" style={{display:'block'}} to="/">Home</Link>        
          <Footer/>
        </div>
      </div>
    )
  }
}