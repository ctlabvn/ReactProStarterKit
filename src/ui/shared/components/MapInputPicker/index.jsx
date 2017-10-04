import React, { Component } from 'react'
import { DatePicker, TimePicker, TextField, AutoComplete } from 'material-ui'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/places/SearchBox'
import Geosuggest from 'react-geosuggest'

const style = {
  searchBox: {
    boxSizing: 'border-box',
    MozBoxSizing: 'border-box',
    border: '1px solid transparent',
    width: '240px',
    height: '32px',
    marginTop: 10,
    padding: '0 12px',
    borderRadius: '1px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    fontSize: '14px',
    outline: 'none',
    textOverflow: 'ellipses',
    display: 'none',
  },
  mapBox: {
    display: 'none',
  },
}

const InputGoogleMap = withGoogleMap(props=>(
  <div>
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputPlaceholder="Find your delivery address"
      inputStyle={style.searchBox}
    />
    <GoogleMap
      ref={props.onMapMounted}
      defaultZoom={14}
      center={props.center}
      inputStyle={style.mapBox}
      onBoundsChanged={props.onBoundsChanged}
    >      
      {props.markers.map((marker, index) => (<Marker position={marker.position} key={index} />))}
    </GoogleMap>
  </div>
))

export default class MapInputPicker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bounds: null,
      center: {
        lat: 21.027951,
        lng: 105.831145,
      },
      markers: [],
    }
    this.handleMapMounted = this.handleMapMounted.bind(this)
    this.handleBoundsChanged = this.handleBoundsChanged.bind(this)
    this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this)
    this.handlePlacesChanged = this.handlePlacesChanged.bind(this)
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
    console.log('handleMapMounted')
    this._map = map
  }

  handleBoundsChanged() {
    console.log('handleBoundsChanged')
    this.setState({
      bounds: this._map.getBounds(),
      center: this._map.getCenter(),
    })
  }

  handleSearchBoxMounted(searchBox) {
    console.log('handleSearchBoxMounted', searchBox)
    this._searchBox = searchBox
  }

  handlePlacesChanged(suggest) {
    const places = suggest.gmaps

    // Add a marker for each place returned from search bar
    const markers = [{position: places.geometry.location}]
    // Set markers set map center to first search result
    const mapCenter = markers.length > 0 ? markers[0].position : this.state.center

    this.setState({
      center: mapCenter,
      markers,
    })
  }

  render() {
    const fixtures = [
      {label: 'Hanoi', location: {lat: 21.027951, lng: 105.831145}},
    ]
    return (
      <div className="DateAndTimePicker">
        
        <Geosuggest
          ref={el=>this._geoSuggest=el}
          placeholder="Start typing!"
          initialValue="Hanoi"
          fixtures={fixtures}
          onSuggestSelect={this.handlePlacesChanged.bind(this)}
          location={new google.maps.LatLng(21.027951, 105.831145)}
          radius="50"
        />

        <TextField
          fullWidth={true}
          floatingLabelText={this.props.label}
          hintText="Select your location"
          onChange={this.handleGeoChanged.bind(this)}
        />

        <InputGoogleMap
          containerElement={
            <div style={{ height: 300, width: '100%' }} />
          }
          mapElement={
            <div style={{ height: '100%' }} />
          }
          center={this.state.center}
          onMapMounted={this.handleMapMounted}
          onBoundsChanged={this.handleBoundsChanged}
          onSearchBoxMounted={this.handleSearchBoxMounted}
          bounds={this.state.bounds}
          onPlacesChanged={this.handlePlacesChanged}
          markers={this.state.markers}
        />
      </div>
    )
  }
}
