import React, { Component } from 'react'
import { DatePicker, TimePicker, TextField, IconButton } from 'material-ui'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import { withGoogleMap, GoogleMap, Marker, Circle, InfoWindow } from 'react-google-maps'
import { SearchBox } from 'react-google-maps'
import canUseDOM from "can-use-dom"
import raf from 'raf'


const InputGoogleMap = withGoogleMap(props=>(
  <GoogleMap
    defaultZoom={12}
    center={props.center}
  >
    {props.center && (
      <InfoWindow position={props.center}>
        <div>{props.content}</div>
      </InfoWindow>
    )}
    {props.center && (
      <Circle
        center={props.center}
        radius={props.radius}
        options={{
          fillColor: `red`,
          fillOpacity: 0.20,
          strokeColor: `red`,
          strokeOpacity: 1,
          strokeWeight: 1,
        }}
      />
    )}
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

export default class MapView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      center: null,
      content: null,
      radius: 6000,
      lat: null,
      long: null,
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
        content: `Error: The Geolocation service failed (${JSON.stringify(reason)}).`,
      })
    })
  }

  _onChange = (e, date) => {
    if (this.props.onChange) {
      this.props.onChange(lat)
    }
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
          center={this.state.center}
          content={this.state.content}
          radius={this.state.radius}
        />
      </div>
    )
  }
}
