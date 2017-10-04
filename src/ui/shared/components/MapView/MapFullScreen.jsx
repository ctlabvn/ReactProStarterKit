import React, { Component } from 'react'
import { DatePicker, TimePicker, TextField, IconButton } from 'material-ui'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import { withGoogleMap, GoogleMap, Marker, Circle, InfoWindow } from 'react-google-maps'
import { SearchBox } from 'react-google-maps'
import canUseDOM from "can-use-dom"
import raf from 'raf'


const INPUT_STYLE = {
  boxSizing: `border-box`,
  MozBoxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  marginTop: `27px`,
  padding: `0 12px`,
  borderRadius: `1px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
}


const InputGoogleMap = withGoogleMap(props=>(
  //<GoogleMap
  //   defaultZoom={12}
  //   center={props.center}
  // >
  //   {props.center && (
  //     <InfoWindow position={props.center}>
  //       <div>{props.content}</div>
  //     </InfoWindow>
  //   )}
  //   {props.center && (
  //     <Circle
  //       center={props.center}
  //       radius={props.radius}
  //       options={{
  //         fillColor: `red`,
  //         fillOpacity: 0.20,
  //         strokeColor: `red`,
  //         strokeOpacity: 1,
  //         strokeWeight: 1,
  //       }}
  //     />
  //   )}
  // </GoogleMap>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >

    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputPlaceholder="Customized your placeholder"
      inputStyle={INPUT_STYLE}
    />
    {props.markers.map((marker, index) => (
      <Marker position={marker.position} key={index} />
    ))}


  </GoogleMap>
))

const geolocation = (
  canUseDOM && navigator.geolocation ? navigator.geolocation :
  ({
    getCurrentPosition(success, failure) {
      failure(`Your browser doesn't support geolocation.`);
    },
  })
)

export default class MapFullScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      center: null,
      content: null,
      radius: 6000,
      lat: null,
      long: null,
      markers: [],
      bounds: null,
    }
    this.isUnmounted = false
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }

  componentDidMount() {
    const tick = () => {
      if (this.isUnmounted) {
        return
      }
      this.setState({ radius: Math.max(this.state.radius - 20, 0) })

      if (this.state.radius > 200) {
        raf(tick)
      }
    }
    geolocation.getCurrentPosition((position) => {
      if (this.isUnmounted) {
        return
      }
      this.setState({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        content: `Location found using HTML5.`,
      })

      raf(tick)
    }, (reason) => {
      if (this.isUnmounted) {
        return
      }
      this.setState({
        center: {
          lat: 60,
          lng: 105,
        },
        content: `Error: The Geolocation service failed (${reason}).`,
      })
    })
  }

  _onChange = (e, date) => {
    if (this.props.onChange) {
      this.props.onChange(lat)
    }
  }

  renderInputFullscreen() {
    return (
      <div style={{}}>

      </div>
    )
  }


  handleMapMounted(map) {
    this._map = map;
  }

  handleBoundsChanged() {
    this.setState({
      bounds: this._map.getBounds(),
      center: this._map.getCenter(),
    });
  }

  handleSearchBoxMounted(searchBox) {
    this._searchBox = searchBox;
  }

  handlePlacesChanged() {
    const places = this._searchBox.getPlaces();

    // Add a marker for each place returned from search bar
    const markers = places.map(place => ({
      position: place.geometry.location,
    }));

    // Set markers; set map center to first search result
    const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;

    this.setState({
      center: mapCenter,
      markers,
    });
  }

  render() {
    const value = this.state.dateTime ? this.state.dateTime : new Date()
    return (
      <div className="DateAndTimePicker">
        <TextField
          floatingLabelText={this.props.label}
          hintText="Select DateTime"
          value={value}
        />
        <IconButton disableTouchRipple >
          <EditorModeEdit />
        </IconButton>

        <InputGoogleMap
          containerElement={
            <div style={{ height: 300, width: 300 }} />
          }
          mapElement={
            <div style={{ height:"100%" }} />
          }          
          // position={{lat:-34.397,lng:150.644}}
          center={this.state.center}
          content={this.state.content}
          radius={this.state.radius}
        onMapMounted={this.handleMapMounted.bind(this)}
        onBoundsChanged={this.handleBoundsChanged.bind(this)}
        onSearchBoxMounted={this.handleSearchBoxMounted.bind(this)}
        onPlacesChanged={this.handlePlacesChanged.bind(this)}
        bounds={this.state.bounds}
        markers={this.state.markers}
        />
      </div>
    )
  }
}
