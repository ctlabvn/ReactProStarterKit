import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { 
  // Row, Col, 
  // Label, Button, 
  Collapse 
} from "reactstrap";

import ButtonRound from "~/ui/components/Button/Round";
import Image from "~/ui/components/Image";

@translate("translations")
export default class extends Component {

  static propTypes = {
    collapse: PropTypes.bool,
  };

  static defaultProps = {
    collapse: false,
  };

  constructor(props) {
    super(props);    
    this.state = { collapse: props.collapse };
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const {t, order, collapse, ...props} = this.props;    
    return (      
      <div {...props}>
        <div style={{cursor:'pointer'}} onClick={this.toggle} className="w-100 p-2  d-flex justify-content-between align-items-center">
          
          <Link to={`/restaurant/${order.outlet.uuid}`}>
            <span className="font-weight-bold mr-2">{order.outlet.name}</span>
            <span>( {order.order.created_at} )</span>
          </Link>          
          
          <strong className="d-flex flex-row align-items-center">            
            {t("format.currency", {
              price: order.order.price,
              symbol: order.outlet.currency.symbol
            })}
            <ButtonRound className="ml-2" icon={this.state.collapse ? "plus" : "minus"}/> 
          </strong>  

        </div>   
        <hr/>     
        <Collapse className={classNames("p-2 flex-wrap", {"d-flex":!this.state.collapse})} isOpen={!this.state.collapse}>
        {order.items.map(item => (
          <div className="d-flex flex-column mb-4 col-md-3" key={item.id}>            
            <Link className="color-black-300" to={`/item/${item.id}`}>
              <span className="w-100 float-left">({item.qty}x) {item.name}</span>
              <Image width={120} alt="..." 
                src={item.image.url_thumb} />              
            </Link>            
            <div className="color-black-300 mt-2">
              {t("format.currency", {
                price: item.price * item.qty,
                symbol: order.outlet.currency.symbol
              })}
            </div>
          </div>
        ))}               
        </Collapse>  
      </div>
    );
  }
}
