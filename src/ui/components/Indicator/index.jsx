import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loading from '~/ui/components/Loading'
import * as commonSelectors from '~/store/selectors/common'

// this helps changing one line to modify logic
@connect(state => ({
  requestsPending : commonSelectors.areRequestsPending(state),
}))
export default class Indicator extends Component {
  render(){
    return (
      <Loading
            show={this.props.requestsPending}
            color="red"
          />
    )
  }
}