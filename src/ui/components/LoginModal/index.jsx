import React, { Component } from "react";
import { translate } from "react-i18next";
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
    const { handleSubmit, submitting } = this.props;
    return (
      <Modal
        isOpen={this.state.modal}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>Login</ModalHeader>
        <ModalBody>
          <Field
            placeholder="Username"
            className="mt-5"
            name="email"
            component={InputField}
          />

          <Field
            className="mt-3"
            placeholder="Password"
            type="password"
            name="password"
            component={InputField}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            disabled={submitting}
            onClick={handleSubmit(this.login)}
          >
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={this.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}