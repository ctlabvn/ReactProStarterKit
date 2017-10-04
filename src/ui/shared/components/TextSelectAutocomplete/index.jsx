import React, { Component } from 'react'
import AutoComplete from 'material-ui/AutoComplete'

export default class TextSelectAutocomplete extends Component {

  constructor(props){
    super(props)
    this.state = {
      dataSource: [],
    }
    this.handleUpdateInput = this.handleUpdateInput.bind(this)
  }

  handleUpdateInput(value){
    this.setState({
      dataSource: [
        value,
        value + value,
        value + value + value,
      ],
    })
  }

  render() {
    const value = this.props.value ? new Date(this.props.value) : new Date()
    const props = {...this.props, value}
    return (
      <AutoComplete
        {...props}
        dataSource={this.state.dataSource}
        onUpdateInput={this.handleUpdateInput}
        floatingLabelText={this.props.label}
        fullWidth={true}
      />
    )
  }
}