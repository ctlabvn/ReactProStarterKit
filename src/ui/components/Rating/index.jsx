import React, { Component } from "react";

import "./index.css";

export default class extends Component {

  static defaultProps = {
    score: 5
  }

  render() {
    const { score } = this.props;
    const color = score < 5 
      ? score < 2 ? 'red' : 'yellow' 
      : 'green'
    const stars = []
    for(let i=0;i<score;i++){
      stars.push(<i key={i} className={`fa fa-star color-${color}`} aria-hidden="true" />)
    }
    return (
      <div className="flex-center flex-row rating">
        {stars}
      </div>
    );
  }
}