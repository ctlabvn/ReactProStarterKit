import React, { Component } from "react";

import { translate } from "react-i18next";
import { connect } from "react-redux";

// reactstrap
import { Button, Form, FormGroup, Label, Input, FormText, Row } from "reactstrap";

// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

// components
import { InputField } from "~/ui/components/ReduxForm";


import * as commonActions from "~/store/actions/common";

import { validate } from "./utils";


@translate("translations")
@connect(null, commonActions)
@reduxForm({ form: "Login", validate, destroyOnUnmount: false })
export default class extends Component {
  render() {
    return (
      <Form>
        <Row>
          <Field
            className="col"
            label="Email"
            name="email"
            component={InputField}
          />

          <Field
            className="col"
            label="Password"
            name="password"
            type="password"
            component={InputField}
          />
        </Row>

        <Button color="info">Login</Button>
      </Form>
    );
  }
}