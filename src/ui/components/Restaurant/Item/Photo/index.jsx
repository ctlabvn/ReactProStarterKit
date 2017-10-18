import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import MenuItem from "~/ui/components/Menu/Item";

import "./index.css";

export default class extends Component {
  static propTypes = {
    uuid: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    logo: PropTypes.string,
	  onlineOrderSetting: PropTypes.Object,
	  tags: PropTypes.Array,
  };

  render() {
    const { name, address, logo, onlineOrderSetting, tags, uuid, ...props } = this.props;
    return (
      <div className="col-6 my-3">
        <div className="media rounded">
          <img className="media-image d-flex mr-3 rounded" src={logo} alt="" />
            <div className="media-body">
              <Link to={`/restaurant/${uuid}`}><h5>{name}</h5></Link>
              <hr className="my-2" />
              {address}
              <br/>
              {onlineOrderSetting && onlineOrderSetting.do_delivery ? <span className="badge badge-light mr-2">Delivery</span> : ''}
              {onlineOrderSetting && onlineOrderSetting.do_takeaway ? <span className="badge badge-light mr-2">Takeaway</span> : ''}
              {onlineOrderSetting && onlineOrderSetting.hours_open ? onlineOrderSetting.hours_open : ''}
              <br />
              {tags && tags.map((item, index) => {
                <span className="badge badge-secondary mr-2">{item.name}</span>
              })}
            </div>
        </div>
      </div>
    );
  }
}