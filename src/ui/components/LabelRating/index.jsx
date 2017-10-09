import React, { Component } from "react";
import PropTypes from "prop-types";
import Rating from "~/ui/components/Rating";

import "./index.css";

export default class extends Component {
  static propTypes = {
    labels: PropTypes.array,
    progress: PropTypes.number
  };

  static defaultProps = {
    labels: ["Horrible", "Not good", "Medium", "Very good", "Excellent"],
    progress: 100
  };

  render() {
    const { labels, progress } = this.props;    
    const score = Rating.getScoreFromProgress(progress);
    const label = labels[score-1] || labels[0];
    return (
      <div className="d-flex flex-row align-items-center label-rating">
        <span className="label">{label}</span>
        <div className="flex-row d-flex align-items-center">
          <Rating progress={progress} type="Bar" />
          <span className="percent">{progress}%</span>
        </div>
      </div>
    )
  }
}