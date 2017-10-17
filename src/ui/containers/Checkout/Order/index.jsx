import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import options from "./options";

export default class extends Component {
  render() {
    return (
      <div>
        <h4>Your order</h4>
        {options.products.map((item, index)=>
          <div className="d-flex justify-content-start" key={index}>
            <div className="p-2">1x</div>
            <div className="p-2">{item}</div>
            <div className="ml-auto p-2">$4</div>
          </div>
        )}
        <dl className="d-flex justify-content-start">
          <dt className="p-2 text-uppercase">Total</dt>
          <dd className="ml-auto p-2 font-weight-bold">$14</dd>
        </dl>
      </div>
    )
  }
}


