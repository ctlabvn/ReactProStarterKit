import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { Form, Button, Row, Col } from "reactstrap";
import { connect } from "react-redux";

// redux form
import {
  Field,
  // FieldArray,
  SubmissionError,
  reduxForm
} from "redux-form";

// comonents
// import ProductItem from "~/ui/components/Product/Item";
// import EmptyResult from "~/ui/components/EmptyResult";
import { InputField, SelectField } from "~/ui/components/ReduxForm";
import Login from "~/ui/components/Login";

import { history } from "~/store";

// import options from "./options";

// store
// import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";
import * as commonActions from "~/store/actions/common";

import { extractMessage, countries } from "~/utils";
import { validate } from "./utils";

// use same form
@translate("translations")
@reduxForm({
  form: "VerifyPhone",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
@connect(
  state => ({
    isLogged: authSelectors.isLogged(state)
  }),
  commonActions
)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLogin: false
    };
  }

  // will run because of connect from redux, it will set props via state
  componentWillReceiveProps({ isLogged }) {
    if (isLogged) {
      history.push("/");
    }
  }

  resendPhone = ({ phone, country_code }) => {
    // console.log(email)
    const { requestor, setToast, t } = this.props;
    return new Promise(resolve => {
      requestor("customer/resendPhoneCode", phone, country_code, (err, ret) => {
        if (err) {
          setToast(extractMessage(err.message), "danger");
        } else {
          setToast(t("LABEL.RESEND_VERIFY_CODE_SUCCEED"), "success");
          this.setState({ showConfirm: true });
        }
        resolve(true);
      });
    });
  };

  verifyPhone = ({ phone, country_code, verification_code }) => {
    // custom validation for different method, so we use the same form
    const { requestor, setToast, t } = this.props;
    if (!verification_code) {
      throw new SubmissionError({
        verification_code: t("LABEL.ENTER_VERIFICATION_CODE")
      });
    }
    return new Promise(resolve => {
      requestor(
        "customer/verifyPhoneCode",
        phone,
        country_code,
        verification_code,
        (err, ret) => {
          if (err) {
            setToast(extractMessage(err.message), "danger");
          } else {
            setToast(t("LABEL.RESEND_VERIFY_CODE_SUCCEED"), "success");
            this.setState({ showLogin: true });
          }
          resolve(true);
        }
      );
    });
  };

  renderVerifyPhone() {
    const { handleSubmit, submitting, t } = this.props;
    return (
      <div className="w-50 mt-5">
        <h2 className="text-center">{t("LABEL.VERIFY_CODE")}</h2>
        <Form>
          <Field label={t("LABEL.PHONE")} name="phone" component={InputField} />

          <Field
            label={t("LABEL.COUNTRY_CODE")}
            name="country_code"
            component={SelectField}
          >
            {countries.map((country, index) => (
              <option key={index} value={country.country_code}>
                {country.name}
              </option>
            ))}
          </Field>

          <Field
            label={t("LABEL.VERIFY_CODE")}
            name="verification_code"
            component={InputField}
          />
          <Row>
            <Col>
              <Button
                block
                color="danger"
                disabled={submitting}
                onClick={handleSubmit(this.verifyPhone)}
              >
                {t("LABEL.CONFIRM")}
              </Button>
            </Col>
            <Col>
              <Button
                block
                color="danger"
                disabled={submitting}
                onClick={handleSubmit(this.resendPhone)}
              >
                {t("LABEL.RESEND")}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    const { showLogin } = this.state;
    return (
      <div className="container d-flex justify-content-center">
        {showLogin ? (
          <div className="w-50 mt-5">
            <h2 className="text-center">{t("LABEL.LOGIN_YOUR_ACCOUNT")}</h2>
            <Login />
          </div>
        ) : (
          this.renderVerifyPhone()
        )}
      </div>
    );
  }
}
