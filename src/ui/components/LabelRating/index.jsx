import React, { Component } from "react";
import PropTypes from "prop-types";
import Rating from "~/ui/components/Rating";

import "./index.css";

export default class extends Component {
  static propTypes = {
    labels: PropTypes.array,
    percent: PropTypes.number,
    width: PropTypes.number
  };

  static defaultProps = {
    labels: ["Horrible", "Not good", "Medium", "Very good", "Excellent"],
    percent: 100,
    width: 300,
  };

  render() {
    const { labels, percent, width } = this.props;    
    const score = Rating.getScoreFromProgress(percent);    
    const label = labels[score-1] || labels[0];
    return (
      <div className="d-flex flex-row align-items-center label-rating mb-3">
        <span className="label">{label}</span>
        <div className="flex-row d-flex align-items-center w-100">
          <Rating percent={percent} type="Bar" width={width} />
          <span className="percent">{percent}%</span>
        </div>
      </div>
    )
  }
}