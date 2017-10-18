import React from "react";
import { Field } from "redux-form";
import classNames from "classnames";
import {
  Input,
  Label,
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
  placeholder,
  ...custom
}) => (
  <FormGroup {...custom}>
    {label && <Label>{label}</Label>}
    <Input
      placeholder={placeholder}
      {...input}
      valid={!error}
      type={type}
      className={classNames({ "h-100": type === "textarea" })}
    />
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
);