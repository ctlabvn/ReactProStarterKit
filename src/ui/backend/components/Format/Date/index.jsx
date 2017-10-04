import React, { Component } from 'react'

const pad = (val) => {
  val = parseInt(val, 10);
  return val >= 10 ? val : "0" + val
}

const formatDate = value=> {
  
  try{
    const date = typeof value === 'string' ? new Date(value) : value
    return pad(date.getDate()) + '-' + pad(date.getMonth() + 1) + '-' + date.getFullYear()
  } catch(ex){
    return ''  
  }  
  
}
      

export default class FormatDate extends Component {

  render() {
    const {date} = this.props
    const dateFormatted = formatDate(date)
    return (       
        <span>{dateFormatted}</span>              
    )
  }
}