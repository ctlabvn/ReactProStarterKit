/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

export default class ModalConfirm extends React.Component {

  static propTypes = {
    open: PropTypes.bool,
    onCancel: PropTypes.func,
    onOK: PropTypes.func,
    onItemRef: PropTypes.func,
  };

  static defaultProps = {
    open: false,
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

  componentDidMount(){
    this.props.onItemRef && this.props.onItemRef(this);
  }

  render() {
    const {children, onCancel, onOK, className} = this.props;
    return (
        <Modal zIndex={9999} backdrop="static" isOpen={this.state.modal} className={className}>          
          <ModalBody>
            {children}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={onCancel}>Cancel</Button>{' '} 
            <Button color="primary" onClick={onOK}>Ok</Button>           
          </ModalFooter>
        </Modal>      
    );
  }
}
