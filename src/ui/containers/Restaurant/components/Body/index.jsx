import React, { Component } from "react"
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import * as commonActions from '~/store/actions/common'

@connect(null, commonActions)
export default class extends Component {

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

  render(){
    const {data} = this.state
    return (
      <div className="row">
          <div className="col-lg-12 text-center">
            

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
    )
  }
}

