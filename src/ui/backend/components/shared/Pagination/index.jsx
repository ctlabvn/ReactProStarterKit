import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left'
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'
import IconButton from 'material-ui/IconButton'

import injectSheet from 'react-jss'
import styles from './styles'


@injectSheet(styles)
class Pagination extends Component {

  // for strong type, for convenient we use offset instead of page
  static propTypes = {
    offset: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    handlePageClick: PropTypes.func.isRequired,
  }

  render(){

    const {classes, total, limit, offset, handlePageClick } = this.props
    const page = Math.floor(offset / limit) + 1
    const from = Math.min(offset + 1, total)
    const to = Math.min((offset + limit), total)
    // for mobile, use onTouchTap for faster response, but must include injectTouchTap
    return (
      <div className={classes.pagination}>
        <IconButton
          disabled={page === 1}
          disableTouchRipple={true}
          onClick={e => handlePageClick(page - 1)}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          disabled={page * limit >= total}
          disableTouchRipple={true}
          onClick={e => handlePageClick(page + 1)}
        >
          <ChevronRight />
        </IconButton>
        <div className={classes.info}>
          {from} - {to} of {total}
        </div>
      </div>
    )
  }

}

export default Pagination
