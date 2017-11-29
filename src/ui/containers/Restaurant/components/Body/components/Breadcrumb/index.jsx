import React from 'react'
import PropTypes from 'prop-types'

import './index.css'

const Breadcrumb = ({categories, onSelected}) => {
  return (
    <div className="restaurant-body-breadcrumb">
      <span className="mx-2 color-red font-weight-bold">{`>`}</span>
      <span className="ml-2 color-red font-weight-bold">SUBCAT1</span>
      <span className="ml-2 color-grey-light font-weight-bold">-</span>
      <span className="ml-2 color-grey-light font-weight-bold">SUBCAT2</span>
      <span className="ml-2 color-grey-light font-weight-bold">-</span>
      <span className="ml-2 color-grey-light font-weight-bold">SUBCAT3</span>
      <span className="ml-2 color-grey-light font-weight-bold">-</span>
      <span className="ml-2 color-grey-light font-weight-bold">Other categories <i className="ml-3 fa fa-angle-down" aria-hidden="true"/></span>
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