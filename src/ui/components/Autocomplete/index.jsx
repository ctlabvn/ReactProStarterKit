import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import {
  // Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu
  // DropdownItem
} from "reactstrap";

import { isMobile } from "~/utils";

import "./index.css";

export default class extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle = e => {
    const { dropdownOpen } = this.state;
    if (e.target === this.input && dropdownOpen) {
      return;
    }
    this.setState({
      dropdownOpen: !dropdownOpen
    });
  };

  search = e => {
    if(this.props.input) this.props.input.onChange(e.target.value);
    clearTimeout(this.timeout);
    const value = e.target.value;
    this.timeout = setTimeout(() => {
      this.props.onSearch(value);
      this.setState({
        dropdownOpen: true
      });
    }, 1000);
  };

  render() {

    const {
      children,
      input,
      placeholder,
      inputClass,
      buttonClass,
      onSearch,
      prepend,
      value,
      onKeyDown,
      ...props
    } = this.props;
    const { dropdownOpen } = this.state;

    //const value = input ? input.value : "";

    let obj = {};
    if(this.props.input) obj.value = this.props.input.value;

      return (
      <Dropdown isOpen={dropdownOpen} toggle={this.toggle} {...props}>
        <DropdownToggle
          nav={false}
          tag="span"
          className={classNames("bg-transparent w-100", buttonClass)}
        >
          {prepend}
          <input
            type="text"
            placeholder={placeholder}
            {...obj}
            defaultValue={value}
            onChange={this.search}
            className={classNames("custom-input w-100", inputClass)}
            ref={ref => (this.input = ref)}
            onKeyDown={onKeyDown}
          />
        </DropdownToggle>
        {!!children.length && (
          <DropdownMenu
            style={
              isMobile
                ? {
                    width: window.screen.width - 10
                  }
                : { width: 600 }
            }
          >
            {children}
          </DropdownMenu>
        )}
      </Dropdown>
    );
  }
}
