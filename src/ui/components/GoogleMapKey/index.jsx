import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  // Marker
} from "react-google-maps";

import Spinner from "~/ui/components/Spinner";

import { GOOGLE_API_KEY } from "~/store/constants/api";

@withScriptjs
@withGoogleMap
class MapWithScript extends Component {
  componentDidMount() {
    this.props.onItemRef && this.props.onItemRef(this);
  }

  render() {
    return <GoogleMap defaultZoom={12} {...this.props} />;
  }
}

export default class extends Component {
  static propTypes = {
    key: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    key: GOOGLE_API_KEY,
    height: "100%"
  };

  render() {
    const { key, height, ...props } = this.props;

    return (
      <MapWithScript
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${key}`}
        loadingElement={<Spinner />}
        containerElement={<div style={{ height }} />}
        mapElement={<div style={{ height: `100%` }} />}
        {...props}
      />
    );
  }
}