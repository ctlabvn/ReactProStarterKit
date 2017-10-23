import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import "./index.css";

export default class extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  render() {
    const { title, children, className, ...props } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      <DropdownItem>{child}</DropdownItem>
    );
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className={className}>
        <DropdownToggle caret nav className="text-capitalize color-black">
          {title}
        </DropdownToggle>
        <DropdownMenu>{childrenWithProps}</DropdownMenu>
      </Dropdown>
    );
  }
}
