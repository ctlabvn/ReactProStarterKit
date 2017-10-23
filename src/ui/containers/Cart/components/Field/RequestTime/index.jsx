import React, { Component } from "react";
import MaskedInput from "~/ui/components/MaskedInput";
import moment from "moment";
import classNames from "classnames";

// component
import Dropdown from "~/ui/components/Dropdown";

import "./index.css";

export default class extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      roundedMinute: this.getRoundedMinute(),
    };

    // 1 minute interval
    this.intervalID = setInterval(()=>{
      this.setState({
        roundedMinute: this.getRoundedMinute(),
      })
    }, 60000);
  }

  getRoundedMinute(){
    const now = moment();
    return now.hour() * 60 + Math.ceil(now.minute() / 15) * 15;
  }

  getMinuteFromStr(value){
    if(!value) return null;
    const now = moment(value, "hh:mm a");
    return now.hour() * 60 + now.minute();
  }

  componentWillUnmount(){
    clearInterval(this.intervalID)
  }

  getTimeFormat(now, minutes){
    return now.hour(0).minute(minutes).format('LT');
  }

  render() {
    const { input, hoursRange } = this.props;
    const {roundedMinute} = this.state;
    const now = moment();    
    const today = now.format('dddd').toUpperCase();
    const range = hoursRange[today];
    const min = this.getMinuteFromStr(range.from) || 0;
    const max = this.getMinuteFromStr(range.to) || 24 * 60;
    const children = [];    
    if(roundedMinute < max && roundedMinute > min){
      for(let start = roundedMinute; start < max;start+=15){
        children.push(<span className={classNames({
          'text-info': input.value === start
        })} key={start} onClick={()=>input.onChange(start)}>{this.getTimeFormat(now, start)}</span>);
      }    
    }
      return (
        <small>
          <i className="fa fa-clock-o" aria-hidden="true" /> Delivery time :
          <Dropdown className="scrollable float-right request-time" title={this.getTimeFormat(now, input.value || roundedMinute)}> 
            {children}
          </Dropdown>
        </small>
      );
    }

       
  
}