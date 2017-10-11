import React, { Component } from "react";

// elements
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";

// store
import api from "~/store/api";

import "./index.css";

export default class extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      outlet: null
    };
  }

  async componentWillMount(){
    const {uuid} = this.props.match.params;
    const ret = await api.restaurant.getOutlet(uuid);
    // check ret.error then show ret.message
    this.setState({outlet: ret.data})
  }

  render() {
    const {outlet} = this.state;
    if(!outlet)
      return null;
    return (
      <div className="restaurant">
        <div className="container">
          <Header outlet={outlet}/>

          <Body outlet={outlet}/>

          <Footer outlet={outlet}/>
        </div>
      </div>
    );
  }
}