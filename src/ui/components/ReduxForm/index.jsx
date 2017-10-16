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
  ...custom
}) => (
  <FormGroup {...custom}>
    <Input placeholder={label} {...input} valid={!error} type={type} />
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
);