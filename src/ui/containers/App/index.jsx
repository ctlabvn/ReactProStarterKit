import React, { Component } from "react";
// import PropTypes from 'prop-types'
import Toast from "~/ui/components/Toast";
import Header from "~/ui/components/Header";
import Footer from "~/ui/components/Footer";
import Indicator from "~/ui/components/Indicator";

import { isMobile } from "~/utils";

import "./index.css";

export default class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.currentElement = null;
  // }

  // componentDidMount() {
  //   document.querySelector("body").addEventListener("click", ({ target }) => {
  //     if (target.tagName.match(/input|textarea/i)) {
  //       this.currentElement = target;
  //       this.currentElement.dataPlaceholder = target.placeholder;
  //       target.placeholder = "";
  //     } else if (this.currentElement) {
  //       this.currentElement.placeholder = this.currentElement.dataPlaceholder;
  //     }
  //   });
  // }

  render() {
    const { children } = this.props;
    const minHeight = window.screen.height - 350;
    return (
      <div>
        <Indicator />
        <Header />
        <div className="main-page float-left w-100" style={{ minHeight }}>
          {children}
        </div>
        {!isMobile && <Footer />}
        <Toast />
      </div>
    );
  }
}
