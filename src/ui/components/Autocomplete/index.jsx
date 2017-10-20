import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import {
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import "./index.css";

export default class extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,      
    };
  }

  toggle = (e) => {
    const {dropdownOpen} = this.state;
    if(e.target === this.input && dropdownOpen){
      return
    }
    this.setState({
      dropdownOpen: !dropdownOpen
    });
  };

  search = (e) => {
    clearTimeout(this.timeout);
    const value = e.target.value;
    this.timeout = setTimeout(() => {
      this.props.onSearch(value);
      this.setState({
        dropdownOpen: true,
      })
    }, 1000);
  };

  render() {
    const { children, onSearch, ...props } = this.props;
    const { searchText, dropdownOpen } = this.state;    
    return (
      <Dropdown isOpen={dropdownOpen} toggle={this.toggle} {...props}>
        <DropdownToggle className="bg-transparent w-100">
            <input onChange={this.search} className="custom-input w-100" ref={ref=>this.input = ref}/>
        </DropdownToggle>                          
        {!!children.length && <DropdownMenu>{children}</DropdownMenu>}
      </Dropdown>
    );
  }
}
