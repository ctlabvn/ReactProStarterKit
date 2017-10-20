import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { Row, Col, Label, Button, Collapse } from "reactstrap";

import ButtonRound from "~/ui/components/Button/Round";

@translate("translations")
export default class extends Component {

  constructor(props) {
    super(props);    
    this.state = { collapse: false };
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const {t, order, ...props} = this.props;
    return (      
      <div {...props}>
        <div style={{cursor:'pointer'}} onClick={this.toggle} className="w-100 border bg-info p-2  d-flex justify-content-between align-items-center">
          <strong className="d-flex flex-row align-items-center">
            <ButtonRound icon={this.state.collapse ? "minus" : "plus"}/> 
            <span className="ml-2">{order.outlet.name}</span>
          </strong>
          <span>{order.created_at}</span>
          <span>
            {t("format.currency", {
              price: order.order.price,
              symbol: 'đ'
            })}
          </span>          
        </div>        
        <Collapse className="p-2" isOpen={this.state.collapse}>
        {order.items.map(item => (
          <div className="d-flex mb-4 justify-content-start" key={item.id}>
            <div className="p-2">{item.qty}x</div>
            <div className="p-2 d-flex flex-column">
              {item.name}
              <img className="rounded-circle align-self-start border" width={50} alt="..." src="/images/donut.png" />
            </div>
            <div className="ml-auto p-2">
              {t("format.currency", {
                price: item.price * item.qty,
                symbol: item.currency_symbol || 'đ'
              })}
            </div>
          </div>
        ))}      
        </Collapse>  
      </div>
    );
  }
}
