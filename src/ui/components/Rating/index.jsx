import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";

import "./index.css";

export default class extends Component {
  static propTypes = {
    type: PropTypes.oneOf(["Star", "Bar"]),
    colors: PropTypes.array,
    score: PropTypes.number,    
    percent: PropTypes.number
  };

  static defaultProps = {
    score: 5,
    type: "Star",
    colors: ["red", "orange", "yellow", "yellow", "green"],
    percent: 100,   
    width: 400,
    height: 10, 
  };

  getColorFromScore(score){
    return this.props.colors[score - 1] || this.props.colors[4];
  }

  renderAsStar(score) {
    const {className} = this.props;
    const color = this.getColorFromScore(score)
    const stars = [];
    for (let i = 0; i < score; i++) {
      stars.push(
        <i key={i} className={`fa fa-star color-${color}`} aria-hidden="true" />
      );
    }
    return <div className={classNames("align-items-center flex-row rating", className)}>{stars}</div>;    
  }

  static getScoreFromProgress(percent) {
    if (percent >= 87) return 5;
    if (percent >= 12) return 4;
    if (percent >= 6) return 3;
    if (percent >= 3) return 2;
    return 1;
  }

  renderAsBar(percent) {
    const {width, height, className} = this.props
    const score = this.constructor.getScoreFromProgress(percent);
    const color = this.getColorFromScore(score)
    return (
      <div className={classNames("progress", className)} style={{
        width,
        height,
      }}>
        <div
          className={`progress-bar bg-${color}`}
          role="progressbar"
          style={{width: `${percent}%`}}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    );
  }

  render() {
    const { score, percent, type } = this.props;
    return type === "Star"
      ? this.renderAsStar(score)
      : this.renderAsBar(percent);
  }
}