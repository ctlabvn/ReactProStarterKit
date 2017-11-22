import React, { Component } from "react";
// import PropTypes from "prop-types";
import classNames from "classnames";

import { connect } from "react-redux";
import * as authSelectors from "~/store/selectors/auth";
import * as commonActions from "~/store/actions/common";
import * as authActions from "~/store/actions/auth";

import { Form, FormGroup, Label, Input, Collapse } from "reactstrap";
import { history } from "~/store";

import options from "./options";
import "./index.css";

@connect(
  state => ({
    config: authSelectors.getConfig(state)
  }),
  { ...commonActions, ...authActions }
)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = { collapse: false };
  }

  toggle = () => {
    this.setState({
      collapse: !this.state.collapse
    });
  };

  setMode = e => {
    console.log(this);
    const { updateConfig, reset } = this.props;
    reset();
    updateConfig("mode", e.target.value);
    history.push("/");
  };

  render() {
    const { config } = this.props;
    const { collapse } = this.state;
    return (
      <div className="fixed-bottom devtool border px-2 bg-red color-white">
        <Form>
          <legend onClick={this.toggle} className="w-100 mb-0">
            <span className="font-large">Choose mode</span>
            <i
              className={classNames(
                "m-2 fa float-right",
                collapse ? "fa-angle-up" : "fa-angle-down"
              )}
            />
          </legend>
          <Collapse
            isOpen={this.state.collapse}
            className="border-top pt-2 w-100"
          >
            {options.modes.map(item => (
              <FormGroup check key={item}>
                <Label check>
                  <Input
                    onChange={this.setMode}
                    type="radio"
                    name="mode"
                    value={item}
                    checked={item === config.mode}
                  />
                  {item}
                </Label>
              </FormGroup>
            ))}
          </Collapse>
        </Form>
      </div>
    );
  }
}
