import React, { Component } from "react";

// reactstrap
import { Button, FormGroup, Label, Input, DropdownItem } from "reactstrap";

export default ({
  input,
  label,
  meta: { touched, error, warning },
  orderTypes
}) => (
  <FormGroup check className="d-flex justify-content-between">
    {orderTypes.map((item, index) => (
      <Label check key={index} className="mr-4">
        <Input
          onChange={e => input.onChange(item.id)}
          type="radio"
          defaultChecked={index === orderTypes.length - 1}
          defaultChecked={item.id === input.value}
          name="order_type"
          className="mr-2"
        />
        {item.title}
      </Label>
    ))}
  </FormGroup>
);