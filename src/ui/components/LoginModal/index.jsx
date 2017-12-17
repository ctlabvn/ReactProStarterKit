import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import classNames from "classnames";

// redux form
import { Field, reduxForm } from "redux-form";

// reactstrap
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
  // InputGroup,
  // Input,
  // InputGroupAddon
} from "reactstrap";

import * as commonActions from "~/store/actions/common";

import { InputField } from "~/ui/components/ReduxForm";
import { validateLogin, extractMessage } from "~/utils";
import Login from "~/ui/components/Login";
import Signup from "~/ui/components/Signup";
import * as authSelectors from "~/store/selectors/auth";

import "./index.css";

@translate("translations")
@connect(state => ({
  isLogged: authSelectors.isLogged(state)
}), commonActions)
@reduxForm({ form: "Login", validate: validateLogin, destroyOnUnmount: false })
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      errorMessage: null
    };
  }

  componentDidMount() {
    this.props.onItemRef && this.props.onItemRef(this);
  }

  login = ({ email, password }) => {
    // console.log("vai dan", this.props.submitting);
    return new Promise(resolve => {
      this.props.requestor("app/login", email, password, (err, ret) => {
        if (err) {
          const errorMessage = extractMessage(err.message);
          this.setState({ errorMessage });
        } else {
          this.toggle();
          this.props.reset();
        }
        resolve(true);
      });
    });
  };

  toggle = () => {
    const { modal } = this.state;
    if (!modal) {
      this.props.reset();
    }
    this.setState({
      modal: !modal,
      errorMessage: null
    });
  };

  render() {
    const { t, handleSubmit, submitting, isLogged } = this.props;



    return (
      <Modal
        isOpen={!isLogged && this.state.modal}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalBody className="text-center p-0">
          <div className="login-modal-btn-close text-right"><span role="button" onClick={this.toggle}><i className="fa fa-times" aria-hidden="true"/></span></div>
          <Login />
          <Signup />
          {
          //  <Field
          //    placeholder={t("PLACEHOLDER.USERNAME")}
          //    className="mt-3"
          //    name="email"
          //    component={InputField}
          //  />
          //
          //  <Field
          //  className="mt-3"
          //  placeholder={t("PLACEHOLDER.PASSWORD")}
          //  type="password"
          //  name="password"
          //  component={InputField}
          //  />
          //
          //  <Button
          //  color="danger"
          //  disabled={submitting}
          //  onClick={handleSubmit(this.login)}
          //  >
          //{t("BUTTON.LOGIN")}
          //  </Button>
          //  {this.state.errorMessage && (
          //    <Alert color="danger" className="mt-4">
          //      {this.state.errorMessage}
          //    </Alert>
          //  )}
          }
        </ModalBody>

        {
          //<ModalFooter>
          //  <div className="w-100 text-center">
          //    <Link onClick={this.toggle} to="/password-reset">
          //      {t("LABEL.PASSWORD_RESET")}
          //    </Link>
          //  </div>
          //</ModalFooter>
        }

      </Modal>
    );
  }
}
