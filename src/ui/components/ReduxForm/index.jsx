import React from "react";
// import { Field } from "redux-form";
import classNames from "classnames";
import {
  Input,
  Label,
  // InputGroup,
  // InputGroupAddon,
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
      valid={!touched || !error}
      type={type}
      className={classNames({ "h-100": type === "textarea" })}
    />
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
);

export const SelectField = ({
  input,
  label,
  meta: { touched, error, warning },
  children,
  ...custom
}) => (
  <FormGroup {...custom}>
    {label && <Label>{label}</Label>}
    <Input {...input} valid={!touched || !error} type="select">
      {children}
    </Input>
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
);
