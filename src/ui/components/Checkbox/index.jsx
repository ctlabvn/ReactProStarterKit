import React from 'react'
import PropTypes from 'prop-types'
import { Input } from "reactstrap";

import './index.css'

const Checkbox = (props) => {
  return (
    <div className={`custom-checkbox ${props.checked ? "selected" : ""}`}>
      {props.content}
      <input {...props}/>
      <span className={`checkmark ${props.type === "checkbox" ? "checkmark-circle" : ""}`}/>
    </div>)
}

export default Checkbox