import React, { Component } from "react"
import { connect } from 'react-redux'

import * as commonActions from '~/store/actions/common'

import "./index.css"

@connect(null, commonActions)
export default class Home extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      data: [],
    }
    this.loadData = this.loadData.bind(this)
  }

  loadData(){
    this.props.requestor('restaurant/getOutlets', (err, ret)=>{
      this.setState({
        data: ret.data.data,
      })
    })
  }

  render() {
    const {data} = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 className="mt-5">List restaurant</h1>
            <p className="lead">
              list restaurant
            </p>

            <button onClick={this.loadData}>
              Load data
            </button>

            <div>
              {data.map(item=>
                <div key={item.id}>
                  <h5>{item.name}</h5>
                  <p dangerouslySetInnerHTML={{__html:item.description}} />
                  <img src={item.logo} alt="" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}