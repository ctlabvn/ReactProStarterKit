import React, { Component } from "react";
import PropTypes from "prop-types";

// use name for faster search
export default class Image extends Component {
  static propTypes = {
    src: PropTypes.string,
    fallbackSrc: PropTypes.string,
    showContainer: PropTypes.bool
  };

  static defaultProps = {
    fallbackSrc: "//placehold.it/100",
    showContainer: false
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
    const { src, fallbackSrc, showContainer, ...props } = this.props;
    if (!src || this.state.failed) {
      return <img alt="" src={fallbackSrc} {...props} />;
    } else {
      return showContainer ? (
        <div {...props}>
          <img
            alt=""
            src={src}
            onError={this.fallback}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      ) : (
        <img alt="" src={src} onError={this.fallback} {...props} />
      );
    }
  }
}
