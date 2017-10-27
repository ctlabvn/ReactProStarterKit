import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ButtonRound from "~/ui/components/Button/Round";

import "./index.css";

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    };
  }

  static propTypes = {
    num: PropTypes.number,
    move: PropTypes.number
  };

  static defaultProps = {
    num: 4,
    move: 1
  };

  moveRight = e => {
    this.setState({
      index: this.state.index + this.props.move
    });
  };

  moveLeft = e => {
    this.setState({
      index: this.state.index - this.props.move
    });
  };

  render() {
    const { num, move, children, className, ...props } = this.props;
    const { index } = this.state;
    const width = Math.round(1 / num * 100);

    const childrenWithProps = React.Children.map(children, child => (
      <div
        className="slide"
        // style={{
        //   flex: `0 0 ${width}%`,
        //   maxWidth: `${width}%`
        // }}
      >
        {child}
      </div>
    ));

    return (
      <div className={classNames("slider", className)} {...props}>
        {index > 0 && (
          <ButtonRound
            onClick={this.moveLeft}
            icon="angle-left"
            className="vertical-center control left-control"
          />
        )}
        <div className="slide-content">
          <div
            className="w-100 d-flex slide-content-inner"
            style={{
              transform: `translateX(-${index * width}%)`
            }}
          >
            {childrenWithProps}
          </div>
        </div>
        {index < children.length - num && (
          <ButtonRound
            onClick={this.moveRight}
            icon="angle-right"
            className="vertical-center control right-control"
          />
        )}
      </div>
    );
  }
}