import React, { Component } from "react";
import PropTypes from "prop-types";

// use name for faster search
export default class Image extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    fallbackSrc: PropTypes.string,    
  };

  static defaultProps = {
    fallbackSrc: "/images/no-image-icon.png",    
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.fallback = () => {
      if (this.props.fallbackSrc) {
        this.setState({ failed: true });
      }
    };
  }

  render() {
    const { src, fallbackSrc, ...props } = this.props;
    if (this.state.failed) {
      return <img alt="" src={fallbackSrc} {...props} />;
    } else {
      return <img alt="" src={src} onError={this.fallback} {...props} />;
    }
  }
}