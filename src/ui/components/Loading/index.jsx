import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';

import './index.css'

export default class extends PureComponent {
  static propTypes = {
    color: PropTypes.string.isRequired,
    show: PropTypes.bool,
    showSpinner: PropTypes.bool
  }

  static defaultProps = {
    showSpinner: true
  }

  state = {
    size: 0,
    disappearDelayHide: false, // when dispappear, first transition then display none
    percent: 0,
    appearDelayWidth: 0 // when appear, first display block then transition width
  }

  componentWillReceiveProps(nextProps) {
    const { show } = nextProps
    if (show) {
      this.show()
    } else {
      this.hide()
    }
  }

  show() {
    let { size, percent } = this.state

    const appearDelayWidth = size === 0
    percent = this.calculatePercent(percent)

    this.setState({
      size: ++size,
      appearDelayWidth,
      percent
    })

    if (appearDelayWidth) {
      setTimeout(() => {
        this.setState({
          appearDelayWidth: false
        })
      })
    }
  }

  hide() {
    let { size } = this.state

    if (--size < 0) {
      this.setState({ size: 0 })
      return
    }

    this.setState({
      size: 0,
      disappearDelayHide: true,
      percent: 1
    })

    setTimeout(() => {
      this.setState({
        disappearDelayHide: false,
        percent: 0
      })
    }, 500)
  }

  getBarStyle() {
    const { disappearDelayHide, appearDelayWidth, percent } = this.state
    const { color } = this.props

    return {
      background: color,
      width: appearDelayWidth ? 0 : `${percent * 100}%`,
      display: disappearDelayHide || percent > 0 ? 'block': 'none'
    }
  }

  getSpinnerStyle() {
    const { size } = this.state
    const { color } = this.props

    return {
      display: size > 0 ? 'block': 'none',
      borderColor: color
    }
  }

  calculatePercent(percent) {
    percent = percent || 0
    let random = 0

    if (percent >= 0 && percent < 0.25) {
      random = (Math.random() * (5 - 3 + 1) + 10) / 100
    } else if (percent >= 0.25 && percent < 0.65) {
      random = (Math.random() * 3) / 100
    } else if (percent >= 0.65 && percent < 0.9) {
      random = (Math.random() * 2) / 100
    } else if (percent >= 0.9 && percent < 0.99) {
      random = 0.005
    } else {
      random = 0
    }

    percent += random
    return percent
  }

  render() {
    return (
      <div>
        <div className="loading">
          <div
            className="bar"
            style={this.getBarStyle()}>
            <div className="peg"></div>
          </div>
        </div>
        {this.props.showSpinner &&
          <div className="spinner">
            <div
              className="icon"
              style={this.getSpinnerStyle()}
            />
          </div>
        }
      </div>
    )
  }
}