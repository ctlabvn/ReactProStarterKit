import React, { Component } from "react";

import "./index.css";

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 className="mt-5">A Bootstrap 4 Starter Template</h1>
            <p className="lead">
              Complete with pre-defined file paths and responsive navigation!
            </p>
            <ul className="list-unstyled">
              <li>Bootstrap 4.0.0-beta</li>
              <li>jQuery 3.2.1</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}