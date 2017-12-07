import React from 'react';

import './index.css';

const Checkbox = (props) => {
  return (
    <div className={`custom-checkbox ${props.checked ? "selected" : ""}`}>
      {props.content}
      <input {...props}/>
      {props.type === "checkbox" && [
        <i key="1" className="fa fa-check-circle custom-checkbox-checked" aria-hidden="true"/>,
        <i key="2" className="fa fa-circle-o custom-checkbox-none" aria-hidden="true"/>
      ]}
      {props.type === "radio" && [
        <i key="1" className="fa fa-check-square custom-checkbox-checked" aria-hidden="true"/>,
        <i key="2" className="fa fa-square-o custom-checkbox-none" aria-hidden="true"/>
      ]}
    </div>)
};

export default Checkbox;