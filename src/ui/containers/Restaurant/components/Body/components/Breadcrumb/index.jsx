import React from 'react'
import PropTypes from 'prop-types'

import './index.css'

const Breadcrumb = ({categories, onSelected}) => {
  return (
    <div className="restaurant-body-breadcrumb col-md-6">
      <span className="mx-2 color-red">{`>`}</span>
      <span className="ml-2 color-red">SUBCAT1</span>
      <span className="ml-2 color-grey-light">-</span>
      <span className="ml-2 color-grey-light">SUBCAT2</span>
      <span className="ml-2 color-grey-light">-</span>
      <span className="ml-2 color-grey-light">SUBCAT3</span>
      <span className="ml-2 color-grey-light">-</span>
      <span className="ml-2 color-grey-light">Other categories <i className="ml-3 fa fa-angle-down" aria-hidden="true"/></span>
      {/*categories.map((el, i) => (
       <span onClick={() => onSelected(el.category_uuid)}>{i == 0 ? `a ${el.name}` : el.name}</span>
       )) */}
    </div>)
}

Breadcrumb.defaultProps = {
  categories: []
}

Breadcrumb.propTypes = {
  categories: PropTypes.array,
  onSelected: PropTypes.func
}

export default Breadcrumb