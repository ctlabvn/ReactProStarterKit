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
  // InputGroup,
  // Input,
  // InputGroupAddon
} from "reactstrap";

import * as commonActions from "~/store/actions/common";

import { InputField } from "~/ui/components/ReduxForm";
import { validateLogin } from "~/ui/utils";

@translate("translations")
@connect(null, commonActions)
@reduxForm({ form: "Login", validate: validateLogin, destroyOnUnmount: false })
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  componentDidMount() {
    this.props.onItemRef && this.props.onItemRef(this);
  }

  login = ({ email, password }) => {
    this.props.requestor("app/login", email, password, (err, ret) => {
      this.toggle();
      this.props.reset();
    });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    const { t, handleSubmit, submitting } = this.props;
    return (
      <Modal
        isOpen={this.state.modal}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>{t('LABEL.MODAL_LOGIN_HEADER')}</ModalHeader>
        <ModalBody>
          <Field
            placeholder={t('PLACEHOLDER.USERNAME')}
            className="mt-3"
            name="email"
            component={InputField}
          />

          <Field
            className="mt-3"
            placeholder={t('PLACEHOLDER.PASSWORD')}
            type="password"
            name="password"
            component={InputField}
          />

          <Button
            color="primary"
            disabled={submitting}
            onClick={handleSubmit(this.login)}
          >
            {t('BUTTON.LOGIN')}
          </Button>

        </ModalBody>
        <ModalFooter>
          <Link to="/password-reset">{t('password_reset')}</Link>
        </ModalFooter>
      </Modal>
    );
  }
}