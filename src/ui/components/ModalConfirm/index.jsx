/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

@translate("translations")
export default class ModalConfirm extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    onCancel: PropTypes.func,
    onOK: PropTypes.func,
    onItemRef: PropTypes.func
  };

  static defaultProps = {
    open: false
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: props.open
    };
  }

  open() {
    this.setState({
      modal: true
    });
  }

  close() {
    this.setState({
      modal: false
    });
  }

  componentDidMount() {
    this.props.onItemRef && this.props.onItemRef(this);
  }

  render() {
    const { children, onCancel, onOK, className, t } = this.props;
    return (
      <Modal
        zIndex={9999}
        backdrop="static"
        isOpen={this.state.modal}
        className={className}
      >
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onCancel}>
            {t("BUTTON.CANCEL")}
          </Button>{" "}
          <Button color="danger" onClick={onOK}>
            {t("BUTTON.CONFIRM")}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
