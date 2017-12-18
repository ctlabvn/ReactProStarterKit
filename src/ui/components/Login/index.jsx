import React, { Component } from "react";

import { translate } from "react-i18next";
import { connect } from "react-redux";

// reactstrap
import {
  Button,
  Form,
  // FormGroup,
  // Label, Input,
  // FormText,
  Row
} from "reactstrap";

// redux form
import { Field, reduxForm } from "redux-form";

// components
import { InputField2 } from "~/ui/components/ReduxForm";

import * as commonActions from "~/store/actions/common";

import { validateLogin, extractMessage } from "~/utils";
import "./index.css";

@translate("translations")
@connect(null, commonActions)
@reduxForm({ form: "Login", validate: validateLogin, destroyOnUnmount: false })
export default class extends Component {
  login = ({ email, password }) => {

    const { requestor, setToast, t } = this.props;

    return new Promise(resolve => {
      this.props.requestor("app/login", email, password, (err, ret) => {
        this.props.reset();
        this.props.onLogged && this.props.onLogged(ret);

        if (err) {
          setToast(extractMessage(err.message), "danger");
        }
      });
      resolve(true);
    });
  };

  render() {
    const { t, handleSubmit, submitting } = this.props;
    return (
      <div className="login">
        <div className="color-red font-fb-120 text-uppercase text-left">You have an account</div>
        <Field
          className="mt-2 mb-0"
          label="Email"
          name="email"
          component={InputField2}
        />

        <Field
          className="mt-2 mb-0"
          label="Password"
          name="password"
          type="password"
          component={InputField2}
        />

        <div className="color-c-130 font-fr-100 mt-2 text-right"><u>{t("LABEL.FORGOT_PASSWORD")}</u></div>

        <div className="text-center mt-2">
          <Button
            disabled={submitting}
            onClick={handleSubmit(this.login)}
          >
            {t("BUTTON.LOGIN")}
          </Button>
        </div>
      </div>
    );
  }
}
