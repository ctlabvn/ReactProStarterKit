import React, { Component } from 'react'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import TextField from 'material-ui/TextField'

export default class DateAndTimePicker extends Component {

  constructor(props) {
    super(props)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleChangeTime = this.handleChangeTime.bind(this)
    this.handleOpenDate = this.handleOpenDate.bind(this)

    this.state = {
      date: this.formatDate(new Date()),
      time: this.formatTime(new Date()),
      dateTime: this.formatDate(new Date()) + ' ' + this.formatTime(new Date()),
    }
  }

  _onChange = (e, date) => {
    if (this.props.onChange) {
      this.props.onChange(dateTime)
    }
  }

  handleChangeDate(e, date) {
    this.setState({
      date: this.formatDate(date),
      dateTime: this.formatDate(date) + ' ' + this.state.time,
    })
    this.refs.timePickerDialog.openDialog()
  }

  handleChangeTime(e, time) {
    this.setState({
      time: this.formatTime(time),
      dateTime: this.state.date + ' ' + this.formatTime(time),
    })
  }

  handleOpenDate(){
    this.refs.datePickerDialog.openDialog()
  }

  formatDate(date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  }

  formatTime(time) {
    return this.addZero(time.getHours()) + ':' + this.addZero(time.getMinutes())
  }

  addZero(i) {
    i === undefined ? 0 : i
    if (i < 10) {
      i = '0' + i
    }
    return i
  }

  render() {
    const value = this.state.dateTime ? this.state.dateTime : new Date()
    return (
      <div className="DateAndTimePicker">
        <TextField
          floatingLabelText={this.props.label}
          hintText="Select DateTime"
          fullWidth={true}
          value={value}
          onTouchTap={this.handleOpenDate}
        />
        <br/>
        <DatePicker
          style={{display: "none"}}
          ref="datePickerDialog"
          hintText="Select DateTime"
          formatDate={this.formatDate}
          onChange={this.handleChangeDate}
        />
        <TimePicker
          style={{display: "none"}}
          hintText="Select DateTime"
          format="24hr"
          ref="timePickerDialog"
          autoOk={true}
          onChange={this.handleChangeTime}
        />
      </div>
    )
  }
}
