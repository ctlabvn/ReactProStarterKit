import React, { Component } from "react";
import PropTypes from "prop-types";

import "./index.css";

export default class extends Component {
  static propTypes = {
    type: PropTypes.oneOf(["Star", "Bar"]),
    colors: PropTypes.array,
    score: PropTypes.number,    
    progress: PropTypes.number
  };

  static defaultProps = {
    score: 5,
    type: "Star",
    colors: ["red", "orange", "yellow", "yellow", "green"],
    progress: 100,   
    width: 400,
    height: 10, 
  };

  getColorFromScore(score){
    return this.props.colors[score - 1] || this.props.colors[4];
  }

  renderAsStar(score) {
    const color = this.getColorFromScore(score)
    const stars = [];
    for (let i = 0; i < score; i++) {
      stars.push(
        <i key={i} className={`fa fa-star color-${color}`} aria-hidden="true" />
      );
    }
    return <div className="align-items-center flex-row rating">{stars}</div>;
  }

  static getScoreFromProgress(progress) {
    if (progress >= 87) return 5;
    if (progress >= 12) return 4;
    if (progress >= 6) return 3;
    if (progress >= 3) return 2;
    return 1;
  }

  renderAsBar(progress) {
    const {width, height} = this.props
    const score = this.constructor.getScoreFromProgress(progress);
    const color = this.getColorFromScore(score)
    return (
      <div className="progress" style={{
        width,
        height,
      }}>
        <div
          className={`progress-bar bg-${color}`}
          role="progressbar"
          style={{width: `${progress}%`}}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    );
  }

  render() {
    const { score, progress, type } = this.props;
    return type === "Star"
      ? this.renderAsStar(score)
      : this.renderAsBar(progress);
  }
}