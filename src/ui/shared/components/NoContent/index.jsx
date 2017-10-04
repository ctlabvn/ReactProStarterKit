import React from 'react'
import PropTypes from 'prop-types'

const NoContent = ({ pageName }) => (
    <div>
      <p >{`we couldn't find any ${pageName}`}</p>
    </div>
)

NoContent.propTypes = {
  pageName: PropTypes.string.isRequired,
}

export default NoContent
