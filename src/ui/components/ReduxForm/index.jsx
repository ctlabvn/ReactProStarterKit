import React from "react";
import { Field } from "redux-form";

import {
  Input,
  InputGroup,
  InputGroupAddon,
  FormGroup,
  FormFeedback
} from "reactstrap";

export const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  leftAddon,
  rightAddon,
  ...custom,
}) => (
  <FormGroup {...custom}>
    <InputGroup>
      {leftAddon && <InputGroupAddon>{leftAddon}</InputGroupAddon>}
      <Input placeholder={label} {...input} valid={!error} type={type}/>
      {rightAddon && <InputGroupAddon>{rightAddon}</InputGroupAddon>}
    </InputGroup>
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
);